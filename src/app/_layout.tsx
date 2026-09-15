import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="cadastro"
        options={{
          title: "Cadastro",
        }}
      />

      <Stack.Screen
        name="recuperar-senha"
        options={{
          title: "Recuperar senha",
        }}
      />

      <Stack.Screen
        name="home"
        options={{
          title: "Minha conta",
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}

