import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';

// Token storage using SecureStore for sensitive data
export const storeToken = async (token: string) => {
    try {
        await SecureStore.setItemAsync("auth_token", token);
    } catch (error) {
        console.error("Error storing token:", error);
        throw error;
    }
}

export const getToken = async () => {
    try {
        const token = await SecureStore.getItemAsync("auth_token");
        return token;
    } catch (error) {
        console.error("Error getting token:", error);
        throw error;
    }
}

export const removeToken = async () => {
    try {
        await SecureStore.deleteItemAsync("auth_token");
        return true;
    } catch (error) {
        console.error("Error removing token:", error);
        throw error;
    }
}

// User information storage using AsyncStorage for non-sensitive data
export const storeUserInfo = async (userInfo: User) => {
    try {
        await AsyncStorage.setItem("user_info", JSON.stringify(userInfo));
    } catch (error) {
        console.error("Error storing user info:", error);
        throw error;
    }
}

export const getUserInfo = async (): Promise<User | null> => {
    try {
        const userInfo = await AsyncStorage.getItem("user_info");
        return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
        console.error("Error getting user info:", error);
        throw error;
    }
}

export const removeUserInfo = async () => {
    try {
        await AsyncStorage.removeItem("user_info");
        return true;
    } catch (error) {
        console.error("Error removing user info:", error);
        throw error;
    }
}

// Clear all authentication data
export const clearAuthData = async () => {
    try {
        await Promise.all([
            removeToken(),
            removeUserInfo()
        ]);
        return true;
    } catch (error) {
        console.error("Error clearing auth data:", error);
        throw error;
    }
}

// Store both token and user info together
export const storeAuthData = async (token: string, userInfo: User) => {
    try {
        await Promise.all([
            storeToken(token),
            storeUserInfo(userInfo)
        ]);
        return true;
    } catch (error) {
        console.error("Error storing auth data:", error);
        throw error;
    }
}