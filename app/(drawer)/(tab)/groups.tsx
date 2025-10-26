import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Groups, Group } from '../../../types';
import { getGroups } from '../../../services/apiServices';
export default function GroupsScreen() {
  const { data: groups, isLoading } = useQuery<Groups>({
    queryKey: ['groups'],
    queryFn: async () => {
      const response = await getGroups();
      return response.data;
    },
  });
  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity 
    className="flex-row items-center p-4 border-b border-gray-200"
    onPress={() => router.push(`/chat/${item?._id}`)}>
      <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center mr-3">
        {item.profilePicture ? (
          <Image source={{ uri: item.profilePicture }} className="w-12 h-12 rounded-full" />
        ) : (
          <Ionicons name="people" size={24} color="white" />
        )}
      </View>
      
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="font-semibold text-lg text-gray-900">{item.name}</Text>
          <Text className="text-sm text-gray-500">{item?.lastMessageTimestamp ? new Date(item?.lastMessageTimestamp).toLocaleString() : ''}</Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            <Text className="text-gray-600 flex-1" numberOfLines={1}>
              {item.lastMessage}
            </Text>
            <Text className="text-xs text-gray-400 ml-2">
              {item?.members?.length} members
            </Text>
          </View>
          {item?.unreadCount && item?.unreadCount > 0 && (
            <View className="bg-green-500 rounded-full w-6 h-6 items-center justify-center ml-2">
              <Text className="text-white text-xs font-semibold">
                {item?.unreadCount || 0}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    isLoading ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : ( 
    <View className="flex-1 bg-white">
      <FlatList
        data={groups?.groups || []}
        keyExtractor={(item) => item?._id || ''}
        renderItem={renderGroupItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
    )
  );
}
