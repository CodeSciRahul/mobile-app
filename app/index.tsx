import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuthToken } from "../hooks/useAuth";

export default function Index() {
  const { data: token, isLoading } = useAuthToken();

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        router.replace("/(drawer)/(tab)/contacts");
      } else {
        console.log("token not found, redirecting to login fron index")
        router.replace("/login");
      }
    }
  }, [token, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-blue-600">Redirecting...</Text>
    </View>
  );
}