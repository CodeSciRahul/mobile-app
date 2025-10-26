import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeToken = async (token: string) => {
    try {
        await AsyncStorage.setItem("token", JSON.stringify(token));
    } catch (error) {
        console.error("Error storing token:", error);
        throw error;
    }
}

export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        return token ? JSON.parse(token) : null;
    } catch (error) {
        console.error("Error getting token:", error);
        throw error;
    }
}

export const removeToken = async () => {
    try {
        AsyncStorage.removeItem("token");
        return true;
    } catch (error) {
        console.error("Error removing token:", error);
        throw error;
    }
}