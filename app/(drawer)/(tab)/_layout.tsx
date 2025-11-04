import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
    return (
        <Tabs
        screenOptions={{
            headerShown: false
        }}
        >
            <Tabs.Screen 
            name="contacts"
            options={{ title: 'Contacts',
                tabBarIcon: ({ color, size}) => (
                    <Ionicons name="person-outline" color={color} size={size} />
                )
            }} 
            />
            <Tabs.Screen name="groups" options={{ title: 'Groups',
                tabBarIcon: ({ color, size}) => (
                    <Ionicons name="people-outline" color={color} size={size} />
                )
            }} />
        </Tabs>
    )
}