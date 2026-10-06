import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { deleteUser, onAuthStateChanged, signOut, type User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../services/firebase";

export default function Perfil() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

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
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: excluirConta },
      ],
    );
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
        Alert.alert(
          "Faça login novamente",
          "Por segurança, saia da conta, faça login novamente e tente excluir a conta.",
        );
        return;
      }
      Alert.alert("Erro", "Não foi possível excluir a conta.");
    }
  }

  if (!user) {
    return <View style={styles.loading}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha conta</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{user.displayName || "Não informado"}</Text>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{user.email || "Não informado"}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/home")}>
        <Text style={styles.buttonText}>Voltar para Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.buttonText}>Sair da conta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={confirmarExclusao}>
        <Text style={styles.buttonText}>Excluir conta</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        A senha é gerenciada pelo Firebase Authentication e não é armazenada no Firestore nem no AsyncStorage.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#f4f4f4" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 30, fontWeight: "bold", marginVertical: 30 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 12, marginBottom: 20 },
  label: { color: "#777", marginTop: 12 },
  value: { fontSize: 18, fontWeight: "bold", marginTop: 4 },
  button: { backgroundColor: "#111", padding: 16, borderRadius: 10, alignItems: "center", marginBottom: 12 },
  logoutButton: { backgroundColor: "#444", padding: 16, borderRadius: 10, alignItems: "center", marginBottom: 12 },
  deleteButton: { backgroundColor: "#b00020", padding: 16, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  note: { marginTop: 20, color: "#666", lineHeight: 20 },
});
