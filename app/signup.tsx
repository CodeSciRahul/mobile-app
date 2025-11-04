import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { signup } from "../services/apiServices";

export default function SignUpScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {mutate: signupMutation, isPending: isLoading} = useMutation({
        mutationFn: async ({ name, email, password }: { name: string; email: string; password: string }) => 
            await signup({ name, email, password }),
        onSuccess: (response) => {
            console.log("Signup successful", response.data);
            Alert.alert(
                "Success", 
                "Account created successfully! Please sign in.",
                [
                    {
                        text: "OK",
                        onPress: () => router.replace("/login")
                    }
                ]
            );
        },
        onError: (error: any) => {
            console.error("Signup error:", error);
            Alert.alert("Error", error.response?.data?.message || "Signup failed. Please try again.");
        }
    });

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (!email.includes("@")) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        signupMutation({ name, email, password });
    };

    const handleLogin = () => {
        router.push("/login");
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 px-6 pt-8">
                        {/* Header */}
                        <View className="items-center mb-6">
                            <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-4">
                                <Ionicons name="person-add" size={40} color="white" />
                            </View>
                            <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
                            <Text className="text-gray-600 text-center">
                                Join us and start chatting with friends
                            </Text>
                        </View>

                        {/* Form */}
                        <View className="flex-1 justify-center">
                            <View className="space-y-6">
                                <Input
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    className="mb-4"
                                />

                                <Input
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    className="mb-4"
                                />

                                <View>
                                    <Input
                                        placeholder="Create a password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        className="mb-4"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3"
                                    >
                                        <Ionicons 
                                            name={showPassword ? "eye-off" : "eye"} 
                                            size={20} 
                                            color="#6B7280" 
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View>
                                    <Input
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                        className="mb-4"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3"
                                    >
                                        <Ionicons 
                                            name={showConfirmPassword ? "eye-off" : "eye"} 
                                            size={20} 
                                            color="#6B7280" 
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View className="mb-6">
                                    <Text className="text-xs text-gray-500 leading-4">
                                        By creating an account, you agree to our Terms of Service and Privacy Policy.
                                    </Text>
                                </View>

                                <Button
                                    onPress={handleSignUp}
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 text-white"
                                >
                                    <Text className="text-white text-center font-bold">{isLoading ? "Creating Account..." : "Create Account"}</Text>
                                </Button>
                            </View>
                        </View>

                        {/* Footer */}
                        <View className="pb-8">
                            <View className="flex-row items-center justify-center space-x-2">
                                <Text className="text-gray-600">Already have an account?</Text>
                                <TouchableOpacity onPress={handleLogin}>
                                    <Text className="text-blue-600 font-semibold">
                                        Sign In
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
