import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../global.css";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const colorschema = useColorScheme()

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView className="flex-1">

        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <StatusBar
              backgroundColor={colorschema === "light" ? "#60A5FA" : "#121212"}
              style={colorschema !== "light" ? "light" : "light"}
            />
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: colorschema === "light" ? "#ffffff" : "#1A1A1A",
                },
                headerLargeTitleStyle: {
                  color: colorschema === "light" ? "#111111" : "#FFFFFF",
                },
                headerTintColor: `${colorschema === "light" ? "#111111" : "#60A5FA"}`
                
              }}
            >
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
                  presentation: 'modal'
                }}
              />
              <Stack.Screen
                name="group"
                options={{
                  headerShown: true,
                  title: 'Create Group',
                  presentation: "modal"
                }} />
              <Stack.Screen
                name="group/[id]"
                options={{
                  headerShown: true,
                  title: 'Group Details',
                }} />
            </Stack>
          </BottomSheetModalProvider>
          <PortalHost />
          <Toast />
        </SafeAreaProvider>

      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
