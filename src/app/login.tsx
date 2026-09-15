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
    signInWithEmailAndPassword,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { auth } from "../services/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function entrar() {
    if (!email.trim() || !senha) {
      Alert.alert(
        "Erro",
        "Preencha o e-mail e a senha."
      );

      return;
    }

    try {
      setLoading(true);

      const credencial =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          senha
        );

      await AsyncStorage.setItem(
        "@cp4_session",
        JSON.stringify({
          uid: credencial.user.uid,
          email: credencial.user.email,
        })
      );

      router.replace("/home");
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        "Erro no login",
        "E-mail ou senha inválidos."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        CP4
      </Text>

      <Text style={styles.title}>
        Bem-vindo
      </Text>

      <Text style={styles.subtitle}>
        Entre na sua conta
      </Text>

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

      <TouchableOpacity
        style={styles.button}
        onPress={entrar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.push("/recuperar-senha")
        }
      >
        <Text style={styles.link}>
          Esqueci minha senha
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.push("/cadastro")
        }
      >
        <Text style={styles.link}>
          Não possui conta? Cadastre-se
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

  logo: {
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 5,
    marginBottom: 30,
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