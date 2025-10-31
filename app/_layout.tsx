import { Toasts } from "@backpackapp-io/react-native-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen 
            name="(drawer)" 
            options={{ 
              headerShown: false,
              presentation: 'modal'
            }} 
          />
          <Stack.Screen 
            name="chat/[id]" 
            options={{ 
              headerShown: false,
              presentation: 'card'
            }} 
          />
          <Stack.Screen 
          name="group" 
          options={{ 
            headerShown: true,
            title: 'Create Group',
          }} /> 
        </Stack>
        <Toasts />
      </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
