import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TriggerRef } from "@rn-primitives/select";
import * as React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Switch } from "@/components/ui/switch"
import * as Haptics from 'expo-haptics';
import { useState } from "react";


const mockProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  address: "123 Main St, Anytown, USA",
  city: "Anytown",
  state: "CA",
  zip: "12345",
  country: "USA",
  profilePicture: null,
  bio: "I am a software engineer and a technology enthusiast.",
};

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
  { label: "Cherry", value: "cherry" },
  { label: "Strawberry", value: "strawberry" },
  { label: "Orange", value: "orange" },
  { label: "Lemon", value: "lemon" },
  { label: "Kiwi", value: "kiwi" },
  { label: "Mango", value: "mango" },
  { label: "Pomegranate", value: "pomegranate" },
  { label: "Watermelon", value: "watermelon" },
  { label: "Peach", value: "peach" },
  { label: "Pear", value: "pear" },
  { label: "Plum", value: "plum" },
  { label: "Raspberry", value: "raspberry" },
  { label: "Tangerine", value: "tangerine" },
];

export default function ProfileScreen() {
  const ref = React.useRef<TriggerRef>(null);
  const [checked, setChecked] = useState(false)


  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({
      ios: insets.bottom,
      android: insets.bottom + 24,
    }),
    left: 12,
    right: 12,
  };

  // Workaround for rn-primitives/select not opening on mobile
  function onTouchStart() {
    ref.current?.open();
  }

  function onPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setChecked((prev) => !prev);
  }
 
  function onCheckedChange(checked: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setChecked(checked);
  }
 


  return (
    <View className="flex-1 item-center justify-center">
      <View>
        {mockProfile?.profilePicture ? (
          <Image
            source={{ uri: mockProfile.profilePicture }}
            className="w-20 h-20 rounded-full"
          />
        ) : (
          <Ionicons name="person-outline" color="black" size={24} />
        )}
      </View>

      <View>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        id="airplane-mode"
        nativeID="airplane-mode"
      />
      </View>

      <Select>
        <SelectTrigger
          ref={ref}
          className="w-[180px]"
        //   onTouchStart={onTouchStart}
          onPress={onTouchStart}
        >
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent insets={contentInsets} className="w-[180px]">
          <NativeSelectScrollView>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              {fruits.map((fruit) => (
                <SelectItem
                  key={fruit.value}
                  label={fruit.label}
                  value={fruit.value}
                >
                  {fruit.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </NativeSelectScrollView>
        </SelectContent>
      </Select>
    </View>
  );
}
