import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import {getReceivers} from '../../../services/apiServices';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Receivers, ReceiversResponse, Receiver } from '../../../types';
import { useReceiver } from '../../../zustand/receiver.store';

export default function ChatsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: receivers, isLoading } = useQuery<ReceiversResponse>({
    queryKey: ['receivers'],
    queryFn: async () => {
      const response = await getReceivers();
      return response.data;
    },
  });

  const {setReceiver} = useReceiver()

  const renderChatItem = ({ item }: { item: Receiver }) => (
    <TouchableOpacity 
      className="flex-row items-center p-4 border-b border-gray-200"
      onPress={() => {
        setReceiver({receiver: item, selectionType: "private"})
        router.push(`/chat/${item._id}`);
      }}
    >
      <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center mr-3">
        {item?.profilePicture ? (
          <Image source={{ uri: item.profilePicture }} className="w-12 h-12 rounded-full" />
        ) : (
          <Text className="text-white font-semibold text-lg rounded-full">
            {item?.name?.charAt(0)}
          </Text>
        )}
      </View>
      
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="font-semibold text-lg text-gray-900">{item.name}</Text>
          <Text className="text-sm text-gray-500">{item?.lastMessageTimestamp ? new Date(item?.lastMessageTimestamp).toLocaleString() : ''}</Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600 flex-1" numberOfLines={1}>
            {item?.lastMessage}
          </Text>
          {item?.unreadCount > 0 && (
            <View className="bg-blue-500 rounded-full w-6 h-6 items-center justify-center ml-2">
              <Text className="text-white text-xs font-semibold">
                {item?.unreadCount}
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
        data={receivers?.receivers || []}
        keyExtractor={(item) => item?._id || ''}
        renderItem={renderChatItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
    )
  );
}
