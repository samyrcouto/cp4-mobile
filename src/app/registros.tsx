import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { auth } from "../services/firebase";
import { excluirRegistro, listarRegistros, type RegistroEstudo } from "../services/firestore";

export default function Registros() {
  const [registros, setRegistros] = useState<RegistroEstudo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async (refresh = false) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      refresh ? setRefreshing(true) : setLoading(true);
      setRegistros(await listarRegistros(uid));
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível consultar os registros.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  function confirmarExclusao(registro: RegistroEstudo) {
    Alert.alert("Excluir registro", "Tem certeza que deseja excluir este estudo?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => excluir(registro.id) },
    ]);
  }

  async function excluir(id: string) {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      await excluirRegistro(uid, id);
      setRegistros((atual) => atual.filter((item) => item.id !== id));
      Alert.alert("Sucesso", "Registro excluído do Firestore.");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível excluir o registro.");
    }
  }

  if (loading) return <View style={styles.loading}><ActivityIndicator size="large" /></View>;

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => carregar(true)} />}>
      <Text style={styles.title}>Meus estudos</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/cadastro-registro")}>
        <Text style={styles.buttonText}>+ Novo registro</Text>
      </TouchableOpacity>

      {registros.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyTitle}>Nenhum registro encontrado.</Text><Text>Cadastre seu primeiro estudo para começar.</Text></View>
      ) : registros.map((registro) => (
        <View key={registro.id} style={styles.card}>
          <Text style={styles.materia}>{registro.materia}</Text>
          <Text style={styles.assunto}>{registro.assunto}</Text>
          <Text>Data: {registro.data}</Text>
          <Text>Tempo: {registro.tempoEstudo} minutos</Text>
          <Text>Status: {registro.status}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.editButton} onPress={() => router.push({ pathname: "/editar-registro", params: { id: registro.id } })}>
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmarExclusao(registro)}>
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f4f4f4" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 30, fontWeight: "bold", marginVertical: 20 },
  primaryButton: { backgroundColor: "#111", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 15 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  card: { backgroundColor: "#fff", padding: 18, borderRadius: 12, marginBottom: 14 },
  materia: { fontSize: 20, fontWeight: "bold" },
  assunto: { fontSize: 16, marginBottom: 10, color: "#555" },
  actions: { flexDirection: "row", gap: 10, marginTop: 15 },
  editButton: { flex: 1, padding: 13, borderRadius: 8, alignItems: "center", borderWidth: 1, borderColor: "#111" },
  editText: { fontWeight: "bold" },
  deleteButton: { flex: 1, backgroundColor: "#b00020", padding: 13, borderRadius: 8, alignItems: "center" },
  empty: { backgroundColor: "#fff", padding: 25, borderRadius: 12, alignItems: "center" },
  emptyTitle: { fontSize: 17, fontWeight: "bold", marginBottom: 5 },
});
