import { useState } from "react";

import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../services/firebase";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");

  async function recuperarSenha() {
    if (!email.trim()) {
      Alert.alert(
        "Erro",
        "Informe seu e-mail."
      );

      return;
    }

    try {
      await sendPasswordResetEmail(
        auth,
        email.trim()
      );

      Alert.alert(
        "Solicitação enviada",
        "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."
      );
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        "Aviso",
        "Não foi possível realizar a solicitação."
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Recuperar senha
      </Text>

      <Text style={styles.description}>
        Digite seu e-mail para receber
        as instruções de recuperação.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={recuperarSenha}
      >
        <Text style={styles.buttonText}>
          Enviar recuperação
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
    marginBottom: 10,
  },

  description: {
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
    fontWeight: "bold",
  },
});