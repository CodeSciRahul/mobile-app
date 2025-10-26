import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";


const mockProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    address: "123 Main St, Anytown, USA",
    city: "Anytown",
    state: "CA",
    zip: "12345",
    country: "USA",
    profilePicture: null,
    bio: "I am a software engineer and a technology enthusiast.",
}

export default function ProfileScreen() {
    return (
        <View className="flex-1 item-center justify-center">
            <View>
                {mockProfile?.profilePicture ? (
                    <Image 
                    source={{ uri: mockProfile.profilePicture }} 
                    className="w-20 h-20 rounded-full" />
                ) : (
                    <Ionicons name="person-outline" color="black" size={24} />
                )}
            </View>
        </View>
    )
}