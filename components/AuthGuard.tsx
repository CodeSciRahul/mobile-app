import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { getToken } from "../util/store";
interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const token = getToken();

  useEffect(() => {
    if (!token) {
      console.log("token not found, redirecting to login")
      router.replace("/login");
    }
  }, [token]);

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
