import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function SignUpScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

        setIsLoading(true);
        
        try {
            // TODO: Implement actual signup logic here
            console.log("Signup attempt:", { name, email, password });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
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
        } catch (error) {
            Alert.alert("Error", "Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
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
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                />

                                <Input
                                    label="Email Address"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />

                                <View>
                                    <Input
                                        label="Password"
                                        placeholder="Create a password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-8"
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
                                        label="Confirm Password"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-8"
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
                                    title={isLoading ? "Creating Account..." : "Create Account"}
                                    onPress={handleSignUp}
                                    disabled={isLoading}
                                    size="large"
                                    className="w-full"
                                />
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
