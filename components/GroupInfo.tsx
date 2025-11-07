import { useUserInfo } from '@/hooks/useAuth';
import { Group, GroupMember } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, View } from 'react-native';
import { Text } from './ui/text';

interface GroupInfoProps {
  group: Group;
}

export default function GroupInfo({ group }: GroupInfoProps) {
  const { data: userInfo } = useUserInfo();
  const members = group.members || [];
  const admins = members.filter((m) => m.role === 'admin');
  const isOwner = group.createdBy._id === userInfo?._id
  const participants = members.filter((m) => m.role === 'participant');
  const currentUserMember = members.find((m) => m.user._id === userInfo?._id);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView 
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View className="items-center px-6 pt-4 pb-6 border-b border-gray-100">
        {/* Profile Picture */}
        <View className="mb-4">
          {group.profilePicture ? (
            <Image
              source={{ uri: group.profilePicture }}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center">
              <Text className="text-white text-4xl font-bold">
                {group.name?.charAt(0)?.toUpperCase() || 'G'}
              </Text>
            </View>
          )}
        </View>

        {/* Group Name */}
        <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {group.name}
        </Text>

        {/* Description */}
        {group.description && (
          <Text className="text-sm text-gray-600 text-center px-4">
            {group.description}
          </Text>
        )}

        {/* Member Count */}
        <View className="flex-row items-center mt-4 bg-blue-50 px-4 py-2 rounded-full">
          <Ionicons name="people" size={16} color="#007AFF" />
          <Text className="text-sm font-semibold text-blue-600 ml-2">
            {members.length} {members.length === 1 ? 'Member' : 'Members'}
          </Text>
        </View>
      </View>

      {/* Settings Section */}
      <View className="px-6 py-5 border-b border-gray-100">
        <Text className="text-lg font-bold text-gray-900 mb-4">Group Settings</Text>
        
        <View>
          {/* Privacy Setting */}
          <View className="flex-row items-center justify-between py-2 mb-3">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3">
                <Ionicons 
                  name={group.settings?.isPrivate ? 'lock-closed' : 'lock-open'} 
                  size={20} 
                  color={group.settings?.isPrivate ? '#8B5CF6' : '#10B981'} 
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">Privacy</Text>
                <Text className="text-sm text-gray-500">
                  {group.settings?.isPrivate ? 'Only admin can edit group details' : 'Member can edit group details'}
                </Text>
              </View>
            </View>
          </View>

          {/* Member Invite Setting */}
          <View className="flex-row items-center justify-between py-2 mb-3">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                <Ionicons 
                  name={group.settings?.allowMemberInvite ? 'person-add' : 'person-remove'} 
                  size={20} 
                  color={group.settings?.allowMemberInvite ? '#10B981' : '#EF4444'} 
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">Member Invites</Text>
                <Text className="text-sm text-gray-500">
                  {group.settings?.allowMemberInvite ? 'Members can invite' : 'Only admins can invite'}
                </Text>
              </View>
            </View>
          </View>

          {/* Message Permissions */}
          <View className="flex-row items-center justify-between py-2 mb-3">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                <Ionicons 
                  name={group.settings?.adminOnlyMessages ? 'chatbubble-ellipses' : 'chatbubbles'} 
                  size={20} 
                  color={group.settings?.adminOnlyMessages ? '#F97316' : '#10B981'} 
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">Messages</Text>
                <Text className="text-sm text-gray-500">
                  {group.settings?.adminOnlyMessages ? 'Only admins can send' : 'All members can send'}
                </Text>
              </View>
            </View>
          </View>

          {/* Created Date */}
          {group.createdAt && (
            <View className="flex-row items-center py-2">
              <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                <Ionicons name="calendar" size={20} color="#6B7280" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">Created</Text>
                <Text className="text-sm text-gray-500">{formatDate(group.createdAt)}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Members Section */}
      <View className="px-6 py-5">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900">Members</Text>
          <Text className="text-sm text-gray-500">{members.length} total</Text>
        </View>

        {/* Admins */}
        {admins.length > 0 && (
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Administrators ({admins.length})
            </Text>
            {admins.map((member) => (
              <MemberItem 
                key={member._id} 
                member={member} 
                isCurrentUser={member.user._id === userInfo?._id}
                isOwner={member.user._id === group.createdBy._id}
              />
            ))}
          </View>
        )}

        {/* Participants */}
        {participants.length > 0 && (
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Participants ({participants.length})
            </Text>
            {participants.map((member) => (
              <MemberItem 
                key={member._id} 
                member={member} 
                isCurrentUser={member.user._id === userInfo?._id}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

interface MemberItemProps {
  member: GroupMember;
  isCurrentUser?: boolean;
  isOwner?: boolean;
}

function MemberItem({ member, isCurrentUser, isOwner }: MemberItemProps) {
  return (
    <View className="flex-row items-center py-3 border-b border-gray-50">
      {/* Avatar */}
      <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center mr-3 overflow-hidden">
        {member.user?.profilePicture ? (
          <Image
            source={{ uri: member.user?.profilePicture }}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <Text className="text-white font-semibold text-lg">
            {member.user.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        )}
      </View>

      {/* Name and Info */}
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="text-base font-semibold text-gray-900">
            {member.user.name || 'Unknown User'}
          </Text>
          {isCurrentUser && (
            <View className="ml-2 bg-blue-100 px-2 py-0.5 rounded">
              <Text className="text-xs font-semibold text-blue-600">You</Text>
            </View>
          )}
        </View>
        <Text className="text-sm text-gray-500">{member.user.email}</Text>
      </View>

      {/* Role Badge */}
      <View className="flex-row items-center gap-2">
        {isOwner && (
          <View className="bg-amber-100 px-3 py-1 rounded-full">
            <View className="flex-row items-center">
              <Ionicons name="star" size={14} color="#D97706" />
              <Text className="text-xs font-semibold text-amber-700 ml-1">Owner</Text>
            </View>
          </View>
        )}
        {member.role === 'admin' && (
          <View className="bg-purple-100 px-3 py-1 rounded-full">
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark" size={14} color="#8B5CF6" />
              <Text className="text-xs font-semibold text-purple-600 ml-1">Admin</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

