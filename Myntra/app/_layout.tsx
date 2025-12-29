import { Stack } from "expo-router";
import { AuthProvider } from "@/src/myntra/context/AuthContext";
import { ThemeProvider } from "@/src/context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="product/[id]" />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
