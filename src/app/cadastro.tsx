import { useState } from "react";

import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { router } from "expo-router";

import {
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { auth } from "../services/firebase";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] =
    useState("");

  const [loading, setLoading] = useState(false);

  async function cadastrar() {
    if (
      !nome.trim() ||
      !email.trim() ||
      !senha ||
      !confirmarSenha
    ) {
      Alert.alert(
        "Erro",
        "Preencha todos os campos."
      );

      return;
    }

    if (
      !email.includes("@") ||
      !email.includes(".")
    ) {
      Alert.alert(
        "Erro",
        "Digite um e-mail válido."
      );

      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert(
        "Erro",
        "As senhas não são iguais."
      );

      return;
    }

    if (senha.length < 6) {
      Alert.alert(
        "Erro",
        "A senha deve ter pelo menos 6 caracteres."
      );

      return;
    }

    try {
      setLoading(true);

      const credencial =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          senha
        );

      await updateProfile(
        credencial.user,
        {
          displayName: nome.trim(),
        }
      );

      await AsyncStorage.setItem(
        "@cp4_session",
        JSON.stringify({
          uid: credencial.user.uid,
          email: credencial.user.email,
          nome: nome.trim(),
        })
      );

      Alert.alert(
        "Sucesso",
        "Conta criada com sucesso!"
      );

      router.replace("/home");
    } catch (error: any) {
      console.log(error);

      let mensagem =
        "Não foi possível criar sua conta.";

      if (
        error.code ===
        "auth/email-already-in-use"
      ) {
        mensagem =
          "Esse e-mail já está cadastrado.";
      }

      if (
        error.code ===
        "auth/invalid-email"
      ) {
        mensagem = "E-mail inválido.";
      }

      if (
        error.code ===
        "auth/weak-password"
      ) {
        mensagem =
          "A senha informada é muito fraca.";
      }

      Alert.alert(
        "Erro",
        mensagem
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Criar conta
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={cadastrar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Criar conta
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
      >
        <Text style={styles.link}>
          Já possui uma conta? Entrar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f4f4f4",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  button: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  link: {
    textAlign: "center",
    marginTop: 20,
  },
});