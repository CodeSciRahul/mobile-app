import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AuthGuard from '../../components/AuthGuard';
import { useUserInfo } from '../../hooks/useAuth';
import { getChats } from '../../services/apiServices';
import { cleanupSocketListeners, setupSocketListeners, socketHandlers } from "../../services/socketService";
import { Reaction, ServerMessage } from '../../types';
import { useReceiver } from '../../zustand/receiver.store';

export default function ChatScreen() {
  const { id: receiverId } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const router = useRouter();
  const { data: userInfo } = useUserInfo();
  const { receiver } = useReceiver();
  console.log("receiver", receiver);
  const selectionType = receiver?.selectionType
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
    console.log("chats", chats);
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

  const isMyMessage = (message: ServerMessage) => {
    return userInfo?._id === message.sender._id;
  };

  const renderReactions = (reactions: Reaction[]) => {
    if (!reactions || reactions.length === 0) return null;

    const reactionCounts = reactions.reduce((acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <View className="flex-row flex-wrap mt-1">
        {Object.entries(reactionCounts).map(([emoji, count]) => (
          <View key={emoji} className="">
            <Text className="text-md">
              {emoji as string}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderReplyTo = (replyTo: ServerMessage | null) => {
    if (!replyTo) return null;

    return (
      <View className="bg-gray-100 rounded-lg p-2 mb-2 border-l-4 border-blue-500">
        <Text className="text-xs text-gray-600 font-medium">
          {replyTo.sender.name}
        </Text>
        <Text className="text-sm text-gray-700" numberOfLines={2}>
          {replyTo.content || 'File message'}
        </Text>
      </View>
    );
  };

  const renderFileMessage = (message: ServerMessage) => {
    const isImage = message.fileType?.startsWith('image/');
    const isVideo = message.fileType?.startsWith('video/');
    const isAudio = message.fileType?.startsWith('audio/');

    return (
      <View>
        {isImage && (
          <Image
            source={{ uri: message.fileUrl }}
            className="w-48 h-48 rounded-lg"
            resizeMode="cover"
          />
        )}
        {isVideo && (
          <View className="w-48 h-32 bg-gray-800 rounded-lg items-center justify-center">
            <Ionicons name="play-circle" size={40} color="white" />
            <Text className="text-white text-sm mt-1">Video</Text>
          </View>
        )}
        {isAudio && (
          <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
            <Ionicons name="musical-notes" size={24} color="#666" />
            <Text className="text-gray-700 ml-2">Audio Message</Text>
          </View>
        )}
        {!isImage && !isVideo && !isAudio && (
          <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
            <Ionicons name="document" size={24} color="#666" />
            <Text className="text-gray-700 ml-2">File</Text>
          </View>
        )}
        {message.content && (
          <Text className={`text-base mt-2 ${isMyMessage(message) ? 'text-white' : 'text-gray-900'}`}>
            {message.content}
          </Text>
        )}
      </View>
    );
  };

  const renderMessage = ({ item }: { item: ServerMessage }) => {
    const isMyMsg = isMyMessage(item);
    const isDeleted = item.deleted;

    return (
      <View className={`mb-3 ${isMyMsg ? 'items-end' : 'items-start'}`}>
        <View
          className={`relative max-w-xs px-4 py-3 rounded-2xl ${isMyMsg
              ? 'bg-blue-500 rounded-br-md'
              : 'bg-gray-200 rounded-bl-md'
            }`}
        >
          {/* Reply to message */}
          {renderReplyTo(item?.replyTo || null)}

          {/* Message content */}
          {isDeleted ? (
            <View className="flex-row items-center">
              <Ionicons
                name="trash"
                size={16}
                color={isMyMsg ? '#ccc' : '#666'}
              />
              <Text className={`text-sm ml-2 ${isMyMsg ? 'text-gray-300' : 'text-gray-500'}`}>
                This message was deleted
              </Text>
            </View>
          ) : item.fileUrl ? (
            renderFileMessage(item)
          ) : (
            <Text
              className={`text-base ${isMyMsg ? 'text-white' : 'text-gray-900'
                }`}
            >
              {item.content}
            </Text>
          )}

          {/* Reactions */}
          <View className="absolute bottom-[-7px] left-1">
            {renderReactions(item?.reactions || [])}
          </View>
        </View>

        {/* Timestamp */}
        <Text className="text-xs text-gray-500 mt-1">
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  const sendMessage = () => {
    if (!message.trim() || !userInfo?._id || !receiverId) return;

    if (selectionType === 'group') {
      socketHandlers.sendMessage({
        senderId: userInfo._id,
        groupId: receiverId as string,
        content: message.trim(),
        messageType: 'group',
      });
    } else {
      socketHandlers.sendMessage({
        senderId: userInfo._id,
        receiverId: receiverId as string,
        content: message.trim(),
        messageType: 'private',
      });
    }
    setMessage('');
  }

  return (
    <AuthGuard>
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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

        {/* Messages */}
        {!isLoading ? (
          <FlatList
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={renderMessage}
            className="flex-1 px-4 py-2"
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}

        {/* Message Input */}
        <View className="flex-row items-center p-4 border-t border-gray-200 bg-white">
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
      </KeyboardAvoidingView>
    </AuthGuard>
  );
}
