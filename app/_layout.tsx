import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../global.css";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView className="flex-1">

        <SafeAreaProvider>
        <BottomSheetModalProvider>
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
                presentation: 'modal'
              }}
            />
            <Stack.Screen
              name="group"
              options={{
                headerShown: true,
                title: 'Create Group',
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
