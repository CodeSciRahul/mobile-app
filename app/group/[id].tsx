import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUserInfo } from "@/hooks/useAuth";
import { getGroupDetails, updateGroup } from "@/services/apiServices";
import { GroupDetailsResponse, UpdateGroupData } from "@/types";
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function UpdateGroupScreen() {
  const { id: groupId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfo();

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupSettings, setGroupSettings] = useState<{
    isPrivateGroup: boolean;
    allowMemberInvite: boolean;
    adminOnlyMessages: boolean;
  }>({
    isPrivateGroup: false,
    allowMemberInvite: false,
    adminOnlyMessages: false
  });

  const { data: groupDetails, isLoading: isLoadingGroup } = useQuery<GroupDetailsResponse>({
    queryKey: ['groupDetails', groupId],
    queryFn: async () => {
      const response = await getGroupDetails(groupId!);
      return response.data as GroupDetailsResponse;
    },
    enabled: !!groupId,
  });

  useEffect(() => {
    if (groupDetails?.group) {
      const group = groupDetails.group;
      setGroupName(group.name || "");
      setGroupDescription(group.description || "");
      setGroupSettings({
        isPrivateGroup: group.settings?.isPrivate || false,
        allowMemberInvite: group.settings?.allowMemberInvite || false,
        adminOnlyMessages: group.settings?.adminOnlyMessages || false,
      });
    }
  }, [groupDetails]);

  const isAdmin = groupDetails?.group?.members?.some(
    (member) => member.user._id === userInfo?._id && member.role === 'admin'
  );

  const { mutate: updateGroupMutation, isPending: isUpdatingGroup } = useMutation({
    mutationFn: async (payload: UpdateGroupData) => {
      const response = await updateGroup(groupId!, payload);
      return response.data;
    },
    onSuccess: () => {
      Toast.show({ type: 'success', text1: 'Group updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['groupDetails', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: (error as AxiosError<{ message: string }>)?.response?.data?.message || 'Failed to update group'
      });
    },
  });

  function onSettingsPress(key: keyof typeof groupSettings) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setGroupSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function handleUpdate() {
    if (!groupName.trim()) {
      Toast.show({ type: 'error', text1: 'Group name is required' });
      return;
    }

    const updateData: UpdateGroupData = {
      name: groupName.trim(),
      description: groupDescription.trim() || undefined,
      settings: {
        isPrivate: groupSettings.isPrivateGroup,
        allowMemberInvite: groupSettings.allowMemberInvite,
        adminOnlyMessages: groupSettings.adminOnlyMessages,
      },
    };

    updateGroupMutation(updateData);
  }

  if (isLoadingGroup) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text className="mt-4 text-gray-600">Loading group details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!groupDetails?.group) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="mt-4 text-xl font-bold text-gray-900">Group not found</Text>
          <Text className="mt-2 text-center text-gray-600">The group you're looking for doesn't exist or you don't have access to it.</Text>
          <Button
            className="mt-6 bg-blue-500 px-6 py-3 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="py-4">
            {/* agar group private h to group detalis name, description, profile sirf admin hi change kr skta h otherwise koi bhi kr skta h  */}
            <View>
              <View className="items-center mb-6">
                {groupDetails.group.profilePicture ? (
                  <Image
                    source={{ uri: groupDetails.group.profilePicture }}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                ) : (
                  <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center mb-4">
                    <Text className="text-white text-4xl font-bold">
                      {groupDetails.group.name?.charAt(0)?.toUpperCase() || 'G'}
                    </Text>
                  </View>
                )}
                <Text className="text-sm text-gray-500 mb-6">Group Profile Picture</Text>
              </View>

              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Group Name</Text>
                <Input
                  placeholder="Enter group name"
                  value={groupName}
                  onChangeText={setGroupName}
                  className="bg-gray-50 border-gray-200"
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Description</Text>
                <Input
                  placeholder="Enter group description (optional)"
                  value={groupDescription}
                  onChangeText={setGroupDescription}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="bg-gray-50 border-gray-200 min-h-[80px]"
                />
              </View>
            </View>

            {/* group setting sirf admin hi change kr skta h  */}
            <View className="mt-6">
              <View className="mb-4">
              <Text className="text-lg font-bold text-gray-900">Group Settings</Text>
              <Text className="text-xs text-gray-500">Only Admin can change the group settings</Text>
              </View>

              <View className="bg-gray-50 rounded-lg p-4">
                <View className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3">
                      <Ionicons
                        name={groupSettings.isPrivateGroup ? 'lock-closed' : 'lock-open'}
                        size={20}
                        color={groupSettings.isPrivateGroup ? '#8B5CF6' : '#10B981'}
                      />
                    </View>
                    <View className="flex-1">
                      <Label
                        nativeID="private-group"
                        htmlFor="private-group"
                        onPress={() => onSettingsPress('isPrivateGroup')}
                        className="text-base font-semibold text-gray-900"
                      >
                        Private Group
                      </Label>
                      <Text className="text-sm text-gray-500">
                        Only admins can change group details
                      </Text>
                    </View>
                  </View>
                  <Switch
                    checked={groupSettings.isPrivateGroup}
                    onCheckedChange={() => onSettingsPress('isPrivateGroup')}
                    id="private-group"
                    nativeID="private-group"
                    className="bg-blue-500"
                    disabled={!isAdmin}
                  />
                </View>

                <View className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                      <Ionicons
                        name={groupSettings.allowMemberInvite ? 'person-add' : 'person-remove'}
                        size={20}
                        color={groupSettings.allowMemberInvite ? '#10B981' : '#EF4444'}
                      />
                    </View>
                    <View className="flex-1">
                      <Label
                        nativeID="allow-member-invite"
                        htmlFor="allow-member-invite"
                        onPress={() => onSettingsPress('allowMemberInvite')}
                        className="text-base font-semibold text-gray-900"
                      >
                        Allow Member Invite
                      </Label>
                      <Text className="text-sm text-gray-500">
                        Members can invite others
                      </Text>
                    </View>
                  </View>
                  <Switch
                    checked={groupSettings.allowMemberInvite}
                    onCheckedChange={() => onSettingsPress('allowMemberInvite')}
                    id="allow-member-invite"
                    nativeID="allow-member-invite"
                    className="bg-blue-500"
                    disabled={!isAdmin}
                  />
                </View>

                <View className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                      <Ionicons
                        name={groupSettings.adminOnlyMessages ? 'chatbubble-ellipses' : 'chatbubbles'}
                        size={20}
                        color={groupSettings.adminOnlyMessages ? '#F97316' : '#10B981'}
                      />
                    </View>
                    <View className="flex-1">
                      <Label
                        nativeID="admin-only-messages"
                        htmlFor="admin-only-messages"
                        onPress={() => onSettingsPress('adminOnlyMessages')}
                        className="text-base font-semibold text-gray-900"
                      >
                        Admin Only Messages
                      </Label>
                      <Text className="text-sm text-gray-500">
                        Only admins can send messages
                      </Text>
                    </View>
                  </View>
                  <Switch
                    checked={groupSettings.adminOnlyMessages}
                    onCheckedChange={() => onSettingsPress('adminOnlyMessages')}
                    id="admin-only-messages"
                    nativeID="admin-only-messages"
                    className="bg-blue-500"
                    disabled={!isAdmin}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="px-4 py-4 bg-white border-t border-gray-200">
          <View className="flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 py-3 rounded-lg border-gray-300"
              onPress={() => router.back()}
              disabled={isUpdatingGroup}
            >
              <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
            </Button>

            {isUpdatingGroup ? (
              <View className="flex-1 bg-blue-500 py-3 rounded-lg items-center justify-center">
                <ActivityIndicator size="small" color="white" />
              </View>
            ) : (
              <Button
                className="flex-1 bg-blue-500 py-3 rounded-lg"
                onPress={handleUpdate}
                disabled={isUpdatingGroup || !groupName.trim()}
              >
                <Text className="text-center text-white font-bold">Update Group</Text>
              </Button>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}