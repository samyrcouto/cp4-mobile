import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { auth } from "../services/firebase";
import { criarRegistro, type StatusEstudo } from "../services/firestore";

const statusOptions: StatusEstudo[] = ["Planejado", "Em andamento", "Concluído"];

export default function CadastroRegistro() {
  const [materia, setMateria] = useState("");
  const [assunto, setAssunto] = useState("");
  const [data, setData] = useState("");
  const [tempoEstudo, setTempoEstudo] = useState("");
  const [status, setStatus] = useState<StatusEstudo>("Planejado");
  const [loading, setLoading] = useState(false);

  async function salvar() {
    const uid = auth.currentUser?.uid;
    if (!uid) { Alert.alert("Erro", "Usuário não autenticado."); return; }
    if (!materia.trim() || !assunto.trim() || !data.trim() || !tempoEstudo.trim()) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios."); return;
    }
    if (!/^\d+$/.test(tempoEstudo.trim()) || Number(tempoEstudo) <= 0) {
      Alert.alert("Erro", "O tempo de estudo deve ser um número maior que zero."); return;
    }
    try {
      setLoading(true);
      await criarRegistro(uid, { materia: materia.trim(), assunto: assunto.trim(), data: data.trim(), tempoEstudo: tempoEstudo.trim(), status });
      Alert.alert("Sucesso", "Estudo cadastrado no Firestore.", [{ text: "OK", onPress: () => router.replace("/registros") }]);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível cadastrar o estudo.");
    } finally { setLoading(false); }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar estudo</Text>
      <TextInput style={styles.input} placeholder="Matéria" value={materia} onChangeText={setMateria} />
      <TextInput style={styles.input} placeholder="Assunto" value={assunto} onChangeText={setAssunto} />
      <TextInput style={styles.input} placeholder="Data (ex.: 05/10/2026)" value={data} onChangeText={setData} />
      <TextInput style={styles.input} placeholder="Tempo de estudo em minutos" value={tempoEstudo} onChangeText={setTempoEstudo} keyboardType="numeric" />
      <Text style={styles.label}>Status</Text>
      {statusOptions.map((item) => (
        <TouchableOpacity key={item} style={[styles.status, status === item && styles.statusSelected]} onPress={() => setStatus(item)}>
          <Text style={status === item ? styles.statusSelectedText : undefined}>{item}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.button} onPress={salvar} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar no Firestore</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: "#f4f4f4" },
  title: { fontSize: 28, fontWeight: "bold", marginVertical: 20 },
  input: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: "#ddd" },
  label: { fontWeight: "bold", marginBottom: 8, marginTop: 5 },
  status: { backgroundColor: "#fff", padding: 14, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: "#ddd" },
  statusSelected: { borderColor: "#111", backgroundColor: "#eee" },
  statusSelectedText: { fontWeight: "bold" },
  button: { backgroundColor: "#111", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 15 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
