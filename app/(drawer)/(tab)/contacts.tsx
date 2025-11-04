import { BottomSheetComponent, BottomSheetRef } from '@/components/ui/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button } from '../../../components/ui/Button';
import { addUser, getReceivers } from '../../../services/apiServices';
import { Receiver, ReceiversResponse } from '../../../types';
import { useReceiver } from '../../../zustand/receiver.store';
import {  Input} from '../../../components/ui/input';

export default function ChatsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const [contact, setContact] = useState<string>('')
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)

  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const { data: receivers, isLoading, refetch } = useQuery<ReceiversResponse>({
    queryKey: ['receivers'],
    queryFn: async () => {
      const response = await getReceivers();
      return response.data as ReceiversResponse;
    },
  });
  const {mutate: addUserMutation, isPending: isAddingUser} = useMutation({
    mutationFn: async (payload: { email?: string; mobile?: string }) => {
      const response = await addUser(payload);
      return response.data;
    },
    onSuccess: () => {
        Toast.show({
          text1: 'Contact added successfully',
          type: 'success',
        });
        refetch();
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        Toast.show({
          text1: `${error.response?.data?.message}`,
          type: 'error',
        });
      } else {
        Toast.show({
          text1: "An unexpected error occurred",
          type: 'error',
        });
      }
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
      <View className='flex-1'>
    <View className="flex-1 bg-white">
      <FlatList
        data={receivers?.receivers || []}
        keyExtractor={(item) => item?._id || ''}
        renderItem={renderChatItem}
        showsVerticalScrollIndicator={false}
      />
          <TouchableOpacity onPress={() => { setBottomSheetOpen(true); requestAnimationFrame(() => bottomSheetRef.current?.present()); }} className='absolute bottom-10 right-10 p-4 bg-gray-200 rounded-xl'>
            <Ionicons name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
    </View>
      <BottomSheetComponent 
        snapPoints={['80%']}
        initialSnapIndex={0}
        ref={bottomSheetRef}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="px-6 pb-6">
          <View className="items-center mb-6">
            <View className="w-16 h-16 rounded-full bg-blue-500 items-center justify-center mb-4"
              style={{
                shadowColor: '#3b82f6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Ionicons name="person-add" size={32} color="#ffffff" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">Add New Contact</Text>
            <Text className="text-sm text-gray-500 text-center px-4">
              Enter an email address or phone number to add a contact
            </Text>
          </View>

          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <View className="mr-2">
                <Ionicons name="mail-outline" size={20} color="#6b7280" />
              </View>
              <Text className="text-sm font-semibold text-gray-700">Email or Phone Number</Text>
            </View>
            <Input
              placeholder="contact@example.com or +1234567890" 
              value={contact} 
              onChangeText={setContact} 
              className="mb-4 bg-gray-50 border-gray-200 focus:border-blue-500"
            />
          </View>

          <Button 
            onPress={() => {
              if (contact.trim()) {
                addUserMutation({ email: contact });
                setContact('');
                setBottomSheetOpen(false);
              }
            }} 
            disabled={isAddingUser || !contact.trim()}
            className="bg-blue-500 py-4 rounded-xl shadow-lg"
            style={{
              shadowColor: '#3b82f6',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            {isAddingUser ? (
              <View className="flex-row items-center justify-center">
                <View className="mr-2">
                  <ActivityIndicator size="small" color="#ffffff" />
                </View>
                <Text className="text-white font-semibold text-base">Adding...</Text>
              </View>
            ) : (
              <View className="flex-row items-center justify-center">
                <View className="mr-2">
                  <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                </View>
                <Text className="text-white font-semibold text-base">Add Contact</Text>
              </View>
            )}
          </Button>
        </View>
        </KeyboardAvoidingView>
      </BottomSheetComponent>

    

    {/* <BottomSheetModalProvider>
      <BottomSheetModal 
      ref={bottomSheetModalRef} 
      index={0} 
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      backdropComponent={(props) => (
        <BlurView intensity={50} tint="light" className="absolute inset-0" />
      )}
      containerStyle={{
        backgroundColor: "transparent"
      }}
      animateOnMount={true}
      enableHandlePanningGesture={true}
      handleStyle={{
        backgroundColor: 'grey',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
      handleIndicatorStyle={{
        backgroundColor: 'blue',
      }}
      >
        <BottomSheetView 
        className="bg-white/70 rounded-t-xl p-5"
        >
          <Text className="text-lg text-center font-bold mb-4">Add Contact</Text>
          <Input placeholder="Email or Phone Number" value={contact} onChangeText={setContact} className="mb-4" />
          <Button 
          onPress={() => {
            addUserMutation({ email: contact });
          }} 
          disabled={isAddingUser}
          >
            <Text>Add Contact</Text>
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider> */}
    </View>
    )
  );
}
