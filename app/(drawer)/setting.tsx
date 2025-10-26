import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useLogout } from "../../hooks/useAuth";

export default function SettingScreen() {
    const { mutate: logout, isPending } = useLogout();
    
    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Logout",
                onPress: () => logout(),
                style: "destructive"
            }
        ]);
    };

    return (
        <View className="flex-1 p-4">
            <TouchableOpacity 
                className="bg-red-500 p-4 rounded-md"
                onPress={handleLogout}
                disabled={isPending}
            >
                <Text className="text-white text-center font-semibold">
                    {isPending ? "Logging out..." : "Logout"}
                </Text>
            </TouchableOpacity>
        </View>
    )
}