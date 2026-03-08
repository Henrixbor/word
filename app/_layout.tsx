import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import {
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from "@expo-google-fonts/fredoka";
import {
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import { api } from "../services/api";
import { useAuthStore } from "../stores/authStore";

const queryClient = new QueryClient();

export default function RootLayout() {
  const backendToken = useAuthStore((state) => state.user?.backendToken);
  const [fontsLoaded] = useFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  useEffect(() => {
    if (!backendToken) return;

    void api.pingPresence(backendToken).catch(() => {});
    const interval = setInterval(() => {
      void api.pingPresence(backendToken).catch(() => {});
    }, 20000);

    return () => clearInterval(interval);
  }, [backendToken]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
