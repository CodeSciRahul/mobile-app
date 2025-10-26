import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      {/* 404 Icon */}
      <View className="w-32 h-32 bg-gray-100 rounded-full items-center justify-center mb-8">
        <Ionicons name="alert-circle-outline" size={64} color="#8E8E93" />
      </View>

      {/* Error Message */}
      <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Page Not Found
      </Text>
      
      <Text className="text-lg text-gray-600 mb-8 text-center leading-6">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </Text>

      {/* Action Buttons */}
      <View className="w-full max-w-sm">
        <TouchableOpacity 
          className="bg-blue-500 py-4 rounded-xl mb-4"
          onPress={() => router.push('/(drawer)/(tab)/contacts')}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Go to Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="border border-gray-300 py-4 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-gray-700 text-center font-semibold text-lg">
            Go Back
          </Text>
        </TouchableOpacity>
      </View>

      {/* Help Text */}
      <Text className="text-sm text-gray-500 mt-8 text-center">
        If you think this is an error, please contact support.
      </Text>
    </View>
  );
}