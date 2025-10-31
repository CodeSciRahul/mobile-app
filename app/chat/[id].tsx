import Message from '@/components/Message';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthGuard from '../../components/AuthGuard';
import { useUserInfo } from '../../hooks/useAuth';
import { getChats } from '../../services/apiServices';
import { cleanupSocketListeners, setupSocketListeners, socketHandlers } from "../../services/socketService";
import { ServerMessage } from '../../types';
import { useReceiver } from '../../zustand/receiver.store';


export default function ChatScreen() {
  const { id: receiverId } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const [isReplyTo, setIsReplyTo] = useState<boolean>(false)
  const [selectedMessage, setSelectedMessage] = useState<ServerMessage | null>(null)
  const router = useRouter();
  const { data: userInfo } = useUserInfo();
  const { receiver } = useReceiver();
  const selectionType = receiver?.selectionType
  const insets = useSafeAreaInsets();
  const { data: chats, isLoading } = useQuery<ServerMessage[]>({
    queryKey: ['chats', receiverId, selectionType],
    queryFn: () => {
      if (selectionType === 'group') {
        return getChats(receiverId as string);
      } else {
        return getChats(userInfo?._id, receiverId as string);
      }
    },
    enabled: !!userInfo?._id && !!receiverId,
  });

  //join room
  useEffect(() => {
    if (receiverId && userInfo?._id) {
      if (selectionType === 'group') {
        socketHandlers.joinGroup(receiverId as string, userInfo?._id);
      } else {
        socketHandlers.joinRoom(userInfo?._id, receiverId as string);
      }
    }

    // Cleanup function to leave group when component unmounts or selection changes
    return () => {
      if (receiverId && userInfo?._id && selectionType === 'group') {
        socketHandlers.leaveGroup(receiverId as string, userInfo?._id);
      }
      if (receiverId && userInfo?._id && selectionType === 'private') {
        socketHandlers.leaveRoom(userInfo?._id, receiverId as string);
      }
    };
  }, [receiverId, userInfo?._id, selectionType]);

  // set messages
  useEffect(() => {
    if (chats && !isLoading) {
      setMessages(chats);
    }
  }, [chats, isLoading]);

  // listen for new events or messages
  useEffect(() => {
    setupSocketListeners(setMessages);

    return () => {
      cleanupSocketListeners();
    };
  }, []);


  const sendMessage = () => {
    if (!message.trim() || !userInfo?._id || !receiverId) return;

    if (selectionType === 'group') {
      socketHandlers.sendMessage({
        senderId: userInfo._id,
        groupId: receiverId as string,
        content: message.trim(),
        messageType: 'group',
        replyTo: selectedMessage?._id
      });
    } else {
      socketHandlers.sendMessage({
        senderId: userInfo._id,
        receiverId: receiverId as string,
        content: message.trim(),
        messageType: 'private',
        replyTo: selectedMessage?._id
      });
    }
    setMessage('');
    setSelectedMessage(null)
    setIsReplyTo(false)
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <AuthGuard>
        {/* Header */}
        <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
          <TouchableOpacity className="mr-3" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center mr-3">
            {receiver?.receiver?.profilePicture ? (
              <Image source={{ uri: receiver.receiver.profilePicture }} className="w-10 h-10 rounded-full" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                {receiver?.receiver?.name?.charAt(0) || 'U'}
              </Text>
            )}
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-lg text-gray-900">
              {receiver?.receiver?.name || 'Unknown User'}
            </Text>
            <Text className="text-sm text-green-500">Online</Text>
          </View>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          {/* Messages */}
          {!isLoading ? (
            <FlatList
              data={messages}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <Message
                  item={item}
                  key={item._id}
                  setIsReplyTo={setIsReplyTo}
                  selectedMessage={selectedMessage}
                  setSelectedMessage={setSelectedMessage}
                />
              )}
              className="flex-1 px-4 py-2"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}

          {/* Message Input */}
          <View className="border-t border-gray-200 bg-white">
            {/* --- Reply Preview (if any) --- */}
            {selectedMessage && isReplyTo && (
              <View className="flex-row items-start px-4 py-2 bg-gray-100 border-l-4 border-blue-500">
                <View className="flex-1">
                  <Text className="text-xs text-gray-600 font-medium">
                    Replying to {selectedMessage.sender.name}
                  </Text>

                  {/* If it's an image/file message */}
                  {selectedMessage.fileUrl ? (
                    <View className="flex-row items-center mt-1">
                      {selectedMessage.fileType?.startsWith("image/") && (
                        <Image
                          source={{ uri: selectedMessage.fileUrl }}
                          className="w-10 h-10 rounded mr-2"
                        />
                      )}
                      <Text
                        numberOfLines={2}
                        className="text-sm text-gray-700 flex-shrink"
                      >
                        {selectedMessage.content || "File message"}
                      </Text>
                    </View>
                  ) : (
                    <Text numberOfLines={2} className="text-sm text-gray-700 mt-1">
                      {selectedMessage.content}
                    </Text>
                  )}
                </View>

                {/* Close (Cancel reply) */}
                <TouchableOpacity
                  onPress={() => {
                    setIsReplyTo(false)
                    setSelectedMessage(null)
                  }}
                  className="ml-2 p-1"
                >
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            )}

            {/* --- Message Input Bar --- */}
            <View className="flex-row items-center p-4 bg-white" style={{ paddingBottom: insets.bottom + 16 }}>
              <TouchableOpacity className="mr-3">
                <Ionicons name="add" size={24} color="#007AFF" />
              </TouchableOpacity>

              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-3 mr-3"
                multiline
              />

              <TouchableOpacity
                onPress={sendMessage}
                className="bg-blue-500 w-10 h-10 rounded-full items-center justify-center"
              >
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </AuthGuard>
    </SafeAreaView>
  );
}
