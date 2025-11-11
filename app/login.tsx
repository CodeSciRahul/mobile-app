import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { signin } from "../services/apiServices";
import { storeAuthData } from "../util/store";
export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';


    const {mutate: signinMutation, isPending: isLoading} = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => 
            await signin(email, password),
        onSuccess: async (response) => {
            const token = response.data.token;
            const userInfo = response.data.user
            await storeAuthData(token, userInfo);
            router.replace("/(drawer)/(tab)/contacts")
        },
        onError: (error: any) => {
            console.error("Login error:", error);
            Alert.alert("Login Failed", error.response?.data?.message || "Something went wrong");
        }
    })

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (!email.includes("@")) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }

        signinMutation({ email, password });
    };

    const handleSignUp = () => {
        router.push("/signup");
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-[#181818]">
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    className="dark:bg-[#181818] bg-white"
                >
                    <View className="flex-1 px-6 pt-8">
                        {/* Header */}
                        <View className="items-center">
                            <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-4">
                                <Ionicons name="chatbubbles" size={40} color="white" />
                            </View>
                            <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome Back</Text>
                            <Text className="text-gray-600 dark:text-gray-400 text-center">
                                Sign in to your account to continue
                            </Text>
                        </View>

                        {/* Form */}
                        <View className="flex-1 justify-center">
                            <View className="space-y-6">
                                <Input
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                                    className="mb-4 py-2 text-gray-900 dark:text-gray-100"
                                />

                                <View>
                                    <Input
                                        placeholder="Enter your password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                                        className="mb-4 text-gray-900 dark:text-gray-100"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3"
                                    >
                                        <Ionicons 
                                            name={showPassword ? "eye-off" : "eye"} 
                                            size={20} 
                                            color={isDark ? '#9CA3AF' : '#6B7280'} 
                                        />
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity className="self-end mb-6">
                                    <Text className="text-blue-600 dark:text-blue-400 font-medium">
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>

                                <Button
                                    onPress={handleLogin}
                                    disabled={isLoading}
                                    className="w-full  bg-blue-600 text-white"
                                >
                                    <Text className="text-white text-center font-bold">{isLoading ? "Signing In..." : "Sign In"}</Text>
                                </Button>
                            </View>
                        </View>

                        {/* Footer */}
                        <View className="pb-8">
                            <View className="flex-row items-center justify-center space-x-2">
                                <Text className="text-gray-600 dark:text-gray-400">Don't have an account?</Text>
                                <TouchableOpacity onPress={handleSignUp}>
                                    <Text className="text-blue-600 dark:text-blue-400 font-semibold">
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}