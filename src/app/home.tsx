import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { deleteUser, onAuthStateChanged, signOut, type User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../services/firebase";
import { listarRegistros, type RegistroEstudo } from "../services/firestore";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [registros, setRegistros] = useState<RegistroEstudo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRegistros, setLoadingRegistros] = useState(false);

  async function carregarRegistros(uid: string) {
    try {
      setLoadingRegistros(true);
      setRegistros(await listarRegistros(uid));
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar seus registros do Firestore.");
    } finally {
      setLoadingRegistros(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
      if (!usuario) {
        router.replace("/login");
        return;
      }
      setUser(usuario);
      setLoading(false);
      await carregarRegistros(usuario.uid);
    });
    return unsubscribe;
  }, []);



  async function logout() {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("@cp4_session");
      router.replace("/login");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  }

  function confirmarExclusao() {
    Alert.alert("Excluir conta", "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: excluirConta },
    ]);
  }

  async function excluirConta() {
    try {
      const usuario = auth.currentUser;
      if (!usuario) return;
      await deleteUser(usuario);
      await AsyncStorage.removeItem("@cp4_session");
      Alert.alert("Conta excluída", "Sua conta foi excluída com sucesso.");
      router.replace("/login");
    } catch (error: any) {
      console.log(error);
      if (error.code === "auth/requires-recent-login") {
        Alert.alert("Faça login novamente", "Por segurança, saia da conta, faça login novamente e tente excluir a conta.");
        return;
      }
      Alert.alert("Erro", "Não foi possível excluir a conta.");
    }
  }

  if (loading || !user) {
    return <View style={styles.loading}><ActivityIndicator size="large" /></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Controle de Estudos</Text>
      <Text style={styles.welcome}>Olá, {user.displayName || "Usuário"}!</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Seus estudos</Text>
        <Text style={styles.count}>{loadingRegistros ? "..." : registros.length}</Text>
        <Text style={styles.muted}>registro(s) cadastrados no Firestore</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/registros")}>
        <Text style={styles.buttonText}>Ver meus estudos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/cadastro-registro")}>
        <Text style={styles.secondaryText}>+ Cadastrar estudo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/perfil")}>
        <Text style={styles.secondaryText}>Minha conta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.buttonText}>Sair da conta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={confirmarExclusao}>
        <Text style={styles.buttonText}>Excluir conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: "#f4f4f4" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 30, fontWeight: "bold", marginTop: 30 },
  welcome: { fontSize: 18, marginTop: 8, marginBottom: 25 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 12, marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  count: { fontSize: 36, fontWeight: "bold", marginTop: 8 },
  muted: { color: "#777" },
  primaryButton: { backgroundColor: "#111", padding: 16, borderRadius: 10, alignItems: "center", marginBottom: 12 },
  secondaryButton: { backgroundColor: "#fff", padding: 16, borderRadius: 10, alignItems: "center", marginBottom: 12, borderWidth: 1, borderColor: "#ddd" },
  secondaryText: { fontWeight: "bold" },
  logoutButton: { backgroundColor: "#444", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 15 },
  deleteButton: { backgroundColor: "#b00020", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 12 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
