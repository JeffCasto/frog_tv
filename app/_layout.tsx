import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FrogTerrariumProvider } from "../providers/FrogTerrariumProvider";
import { ChatProvider } from "../providers/ChatProvider";
import { AchievementProvider } from "../providers/AchievementProvider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="achievements" options={{ presentation: "modal", headerShown: true, title: "Achievements" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AchievementProvider>
          <FrogTerrariumProvider>
            <ChatProvider>
              <RootLayoutNav />
            </ChatProvider>
          </FrogTerrariumProvider>
        </AchievementProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}