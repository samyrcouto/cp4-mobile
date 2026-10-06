import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { auth } from "../services/firebase";
import { listarRegistros, atualizarRegistro, type StatusEstudo } from "../services/firestore";

const statusOptions: StatusEstudo[] = ["Planejado", "Em andamento", "Concluído"];

export default function EditarRegistro() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [materia, setMateria] = useState("");
  const [assunto, setAssunto] = useState("");
  const [data, setData] = useState("");
  const [tempoEstudo, setTempoEstudo] = useState("");
  const [status, setStatus] = useState<StatusEstudo>("Planejado");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function carregar() {
      const uid = auth.currentUser?.uid;
      if (!uid || !id) return;
      try {
        const registro = (await listarRegistros(uid)).find((item) => item.id === id);
        if (!registro) { Alert.alert("Erro", "Registro não encontrado.", [{ text: "OK", onPress: () => router.back() }]); return; }
        setMateria(registro.materia); setAssunto(registro.assunto); setData(registro.data); setTempoEstudo(registro.tempoEstudo); setStatus(registro.status);
      } catch (error) { console.log(error); Alert.alert("Erro", "Não foi possível carregar o registro."); }
      finally { setLoading(false); }
    }
    carregar();
  }, [id]);

  async function salvar() {
    const uid = auth.currentUser?.uid;
    if (!uid || !id) return;
    if (!materia.trim() || !assunto.trim() || !data.trim() || !tempoEstudo.trim()) { Alert.alert("Erro", "Preencha todos os campos obrigatórios."); return; }
    if (!/^\d+$/.test(tempoEstudo.trim()) || Number(tempoEstudo) <= 0) { Alert.alert("Erro", "O tempo de estudo deve ser um número maior que zero."); return; }
    try {
      setSaving(true);
      await atualizarRegistro(uid, id, { materia: materia.trim(), assunto: assunto.trim(), data: data.trim(), tempoEstudo: tempoEstudo.trim(), status });
      Alert.alert("Sucesso", "Registro atualizado no Firestore.", [{ text: "OK", onPress: () => router.replace("/registros") }]);
    } catch (error) { console.log(error); Alert.alert("Erro", "Não foi possível atualizar o registro."); }
    finally { setSaving(false); }
  }

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar estudo</Text>
      <TextInput style={styles.input} placeholder="Matéria" value={materia} onChangeText={setMateria} />
      <TextInput style={styles.input} placeholder="Assunto" value={assunto} onChangeText={setAssunto} />
      <TextInput style={styles.input} placeholder="Data" value={data} onChangeText={setData} />
      <TextInput style={styles.input} placeholder="Tempo de estudo em minutos" value={tempoEstudo} onChangeText={setTempoEstudo} keyboardType="numeric" />
      <Text style={styles.label}>Status</Text>
      {statusOptions.map((item) => <TouchableOpacity key={item} style={[styles.status, status === item && styles.selected]} onPress={() => setStatus(item)}><Text>{item}</Text></TouchableOpacity>)}
      <TouchableOpacity style={styles.button} onPress={salvar} disabled={saving}>{saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar alterações</Text>}</TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: "#f4f4f4" },
  title: { fontSize: 28, fontWeight: "bold", marginVertical: 20 },
  input: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: "#ddd" },
  label: { fontWeight: "bold", marginBottom: 8 },
  status: { backgroundColor: "#fff", padding: 14, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: "#ddd" },
  selected: { backgroundColor: "#eee", borderColor: "#111" },
  button: { backgroundColor: "#111", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 15 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
