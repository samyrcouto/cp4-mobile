import { useEffect } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { auth } from "../services/firebase";

export default function Index() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        const sessao = await AsyncStorage.getItem(
          "@cp4_session"
        );

        if (user && sessao) {
          router.replace("/home");
        } else {
          await AsyncStorage.removeItem(
            "@cp4_session"
          );

          router.replace("/login");
        }
      }
    );

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />

      <></>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});