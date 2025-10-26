import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AuthGuard from '../../components/AuthGuard';
import { useQuery } from '@tanstack/react-query';
import { ServerMessage } from '../../types';
import { socket } from '../../services/socketService';
import { getChats } from '../../services/apiServices';

// Mock messages data
const mockMessages = [
  {
    id: '1',
    text: 'Hey, how are you doing?',
    sender: 'other',
    timestamp: '2:30 PM',
  },
  {
    id: '2',
    text: 'I\'m doing great! Thanks for asking. How about you?',
    sender: 'me',
    timestamp: '2:32 PM',
  },
  {
    id: '3',
    text: 'Pretty good! Just working on some new projects.',
    sender: 'other',
    timestamp: '2:33 PM',
  },
  {
    id: '4',
    text: 'That sounds exciting! What kind of projects?',
    sender: 'me',
    timestamp: '2:35 PM',
  },
];

export default function ChatScreen() {
  const { id: receiverId } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const router = useRouter();
  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View className={`mb-3 ${item.sender === 'me' ? 'items-end' : 'items-start'}`}>
      <View
        className={`max-w-xs px-4 py-3 rounded-2xl ${
          item.sender === 'me'
            ? 'bg-blue-500 rounded-br-md'
            : 'bg-gray-200 rounded-bl-md'
        }`}
      >
        <Text
          className={`text-base ${
            item.sender === 'me' ? 'text-white' : 'text-gray-900'
          }`}
        >
          {item.text}
        </Text>
      </View>
      <Text className="text-xs text-gray-500 mt-1">
        {item.timestamp}
      </Text>
    </View>
  );

  return (
    <AuthGuard>
      <KeyboardAvoidingView 
        className="flex-1 bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
          <TouchableOpacity className="mr-3">
            <Ionicons name="arrow-back" onPress={() => router.back()} size={24} color="#007AFF" />
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center mr-3">
            <Text className="text-white font-semibold text-lg">J</Text>
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-lg text-gray-900">John Doe</Text>
            <Text className="text-sm text-green-500">Online</Text>
          </View>
          <TouchableOpacity className="mr-2">
            <Ionicons name="videocam" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          className="flex-1 px-4 py-2"
          showsVerticalScrollIndicator={false}
        />

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
