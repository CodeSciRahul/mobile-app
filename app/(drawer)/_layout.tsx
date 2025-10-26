import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import AuthGuard from "../../components/AuthGuard";

export default function DrawerLayout() {
    return (
        <AuthGuard>
            <Drawer
            screenOptions={{
                drawerActiveBackgroundColor: '#f0f0f0',
                drawerInactiveBackgroundColor: 'transparent',
                swipeEnabled: true,
                drawerStyle: {},
            }}>
                <Drawer.Screen
                    name="(tab)"
                    options={{
                        title: 'My Chats',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="chatbox-outline" color={color} size={size} />
                        ),
                        drawerLabel: 'Chats',
                    }} />
                <Drawer.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="person" color={color} size={size} />
                        )
                    }} />
                <Drawer.Screen
                    name="setting"
                    options={{
                        title: 'Setting',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="settings" color={color} size={size} />
                        )

                    }} />
            </Drawer>
        </AuthGuard>
    )
}