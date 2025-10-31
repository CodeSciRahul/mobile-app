import { Receiver } from "@/types";
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { Checkbox } from "./ui/checkbox";
import { Text } from "./ui/text";

interface MemberProps {
    receiver: Receiver,
    handleSelectedReceiver: (email: string, isSelected: boolean) => void;
}



export default function Member({receiver, handleSelectedReceiver}: MemberProps) {
    const [checked, setChecked] = useState<boolean>(false);
    
    // Animation values
    const scale = useSharedValue(1);
    const backgroundColor = useSharedValue(0);
    const borderColor = useSharedValue(0);
    const opacity = useSharedValue(1);

    const toggleChecked = async () => {
        const newCheckedState = !checked;
        
        // Enhanced haptic feedback - different patterns for select/deselect
        if (newCheckedState) {
            // Selection: stronger haptic feedback
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            // Add a notification haptic for selection
            setTimeout(() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }, 50);
        } else {
            // Deselection: lighter feedback
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        
        // Update state
        setChecked(newCheckedState);
        handleSelectedReceiver(receiver.email, newCheckedState);
    };

    return (
        <TouchableOpacity 
            activeOpacity={0.9}
            onPress={toggleChecked}
            className={` border border-gray-200 p-2 rounded-md flex flex-row gap-2 items-center ${checked ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'}`}
        >
                <Checkbox 
                    id={`checkbox-${receiver._id}`}
                    checked={checked}
                    onCheckedChange={toggleChecked}
                    checkedClassName="bg-blue-500 border-blue-500"
                    className="border-gray-300"
                />
                <Text className="text-lg">{receiver.name}</Text>
        </TouchableOpacity>
    );
}