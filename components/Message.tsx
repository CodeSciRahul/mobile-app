import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { useUserInfo } from '../hooks/useAuth';

import { Reaction, ServerMessage } from '../types';
import Popover from '../components/ui/popover';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Reply } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    runOnJS
} from 'react-native-reanimated';


interface MessageProps {
    item: ServerMessage;
    setIsReplyTo: (value: boolean) => void;
    selectedMessage: ServerMessage | null;
    setSelectedMessage: (msg: ServerMessage | null) => void;
}

export default function Message({ item, setIsReplyTo, selectedMessage, setSelectedMessage }: MessageProps) {
    const { data: userInfo } = useUserInfo();
    const isMyMsg = userInfo?._id === item.sender._id;
    const isDeleted = item.deleted;
    const translateX = useSharedValue(0); // ye indepenendt swip ke liye required nhi to animation sabhe message show krne lagega.
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
    const [isDoubleTap, setIsDoubleTap] = useState<boolean>(false)

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .maxDelay(300)
        .onEnd(() => {
            runOnJS(setSelectedMessage)((item))
            console.log("double tab detect")
        });


    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (e.translationX > 0) {
                translateX.value = e.translationX;
            }
        })
        .onEnd(() => {
            if (translateX.value > 80) {
                runOnJS(setIsReplyTo)(true)
                runOnJS(setSelectedMessage)((item))
            }
            translateX.value = withSpring(0, { damping: 15 });
        });

    const animatedBubbleStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const animatedReplyIcon = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, 60], [0, 1]),
        transform: [{ scale: interpolate(translateX.value, [0, 80], [0.8, 1]) }],
    }));


    const combinedGesture = Gesture.Simultaneous(doubleTap, panGesture);

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
                    {replyTo?.sender?.name}
                </Text>
                <Text className="text-sm text-gray-700" numberOfLines={2}>
                    {replyTo?.content || 'File message'}
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
                    <Text className={`text-base mt-2 ${isMyMsg ? 'text-white' : 'text-gray-900'}`}>
                        {message.content}
                    </Text>
                )}
            </View>
        );
    };

    return (
        <>
            <GestureHandlerRootView>
                <GestureDetector gesture={combinedGesture}>
                    <View className="relative">
                        <Animated.View style={animatedReplyIcon} className="absolute left-5">
                            <Reply size={24} color="#25D366" />
                        </Animated.View>
                        <Pressable
                            onLongPress={() => {
                                setSelectedMessage(item)
                                setIsPopoverOpen(true)
                            }}
                            delayLongPress={400}
                            className={`mb-3 ${isMyMsg ? 'items-end' : 'items-start'} ${selectedMessage?._id === item._id && `bg-green-100 rounded-lg p-1 ${!isMyMsg ? 'border-l-4 border-green-500' : 'border-r-4 border-green-500'}`}`}
                        >
                            <Animated.View
                                style={animatedBubbleStyle}
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
                            </Animated.View>

                            {/* Timestamp */}
                            <Text className="text-xs text-gray-500 mt-1">
                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </Pressable>
                    </View>
                </GestureDetector>
            </GestureHandlerRootView>


            {/* Popover */}
            {selectedMessage?._id === item._id && isPopoverOpen && <Popover
                visible={isPopoverOpen}
                onClose={() => setIsPopoverOpen(false)}
                onDeselectMessage={() => setSelectedMessage(null)}
                isMyMessage={isMyMsg}
                onForward={() => { }}
                onDelete={() => { }}
                onCopy={() => { }}
            />}
        </>
    );
}