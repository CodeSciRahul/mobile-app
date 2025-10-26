import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { clearAuthData, getToken, getUserInfo } from "../util/store";

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await clearAuthData();
    },
    onSuccess: () => {
      queryClient.clear();
      router.replace("/login");
    }
  });
};

export const useAuthToken = () => {
  return useQuery({
    queryKey: ['auth', 'token'],
    queryFn: getToken,
    staleTime: Infinity,
  });
};

export const useRemoveAuthToken = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await clearAuthData();
    },
    onSuccess: () => {
      queryClient.clear();
    }
  });
};

export const useUserInfo = () => {
  return useQuery({
    queryKey: ['auth', 'userInfo'],
    queryFn: getUserInfo,
    staleTime: Infinity,
  });
};