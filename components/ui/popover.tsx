import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View, TouchableWithoutFeedback } from "react-native";

interface PopoverProps {
    visible: boolean;
    onClose: () => void;
    onDeselectMessage: () => void;
    isMyMessage: boolean;
    onForward: () => void;
    onDelete: () => void;
    onCopy: () => void;
}

export default function Popover({ visible, onClose, onDeselectMessage, isMyMessage, onForward, onDelete, onCopy }: PopoverProps) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 8,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleAction = (action: () => void) => {
        action();
        onClose();
        onDeselectMessage()
    };

    if (!visible) return null;

    const menuItems = [
        {
            icon: "arrow-forward-outline" as const,
            label: "Forward",
            action: onForward,
            color: "#34C759",
            bgColor: "#E8F5E8"
        },
        {
            icon: "copy-outline" as const,
            label: "Copy",
            action: onCopy,
            color: "#FF9500",
            bgColor: "#FFF3E0"
        }
    ];

    // if (isMyMessage) {
    //     menuItems.push({
    //         icon: "trash-outline" as const,
    //         label: "Delete",
    //         action: onDelete,
    //         color: "#FF3B30",
    //         bgColor: "#FFEBEE"
    //     });
    // }

    return (
        <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View 
            style={{
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
            }}
            className={`absolute ${!isMyMessage ? 'top-0 right-0' : 'top-0 left-0'} bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50`}
        >
            <View className="py-2">
                {menuItems.map((item, index) => (
                    <Pressable
                        key={index}
                        onPress={() => handleAction(item.action)}
                        className="flex-row items-center px-4 py-3 min-w-[140px]"
                        style={({ pressed }) => [
                            {
                                backgroundColor: pressed ? item.bgColor : 'transparent',
                            }
                        ]}
                    >
                        <View 
                            className="w-8 h-8 rounded-full items-center justify-center mr-3"
                            style={{ backgroundColor: item.bgColor }}
                        >
                            <Ionicons 
                                name={item.icon} 
                                size={18} 
                                color={item.color} 
                            />
                        </View>
                        <Text 
                            className="text-sm font-medium flex-1"
                            style={{ color: '#1F2937' }}
                        >
                            {item.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </Animated.View>
        </TouchableWithoutFeedback>
    )
}   