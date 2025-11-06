import { BottomSheetComponent, BottomSheetRef } from "@/components/ui/bottom-sheet";
import { Label } from "@/components/ui/label";
import { useUserInfo } from "@/hooks/useAuth";
import { updateUserProfileMultipart } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { storeUserInfo } from "@/util/store";
import { ActivityIndicator } from "react-native";

export default function ProfileScreen() {
  const { data: userInfo } = useUserInfo()

  const [image, setImage] = useState<undefined | string>(undefined)
  const BottomSheetRef = useRef<BottomSheetRef>(null)
  const queryClient = useQueryClient()

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({
      ios: insets.bottom,
      android: insets.bottom + 24,
    }),
    left: 16,
    right: 16,
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const { control, handleSubmit, reset, formState: { errors, isDirty }, watch } = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobile: ''
    }
  })
  
  useEffect(() => {
    if (userInfo) {
      reset({
        name: userInfo.name || '',
        email: userInfo.email || '',
        mobile: userInfo.mobile || ''
      });
    }
    setImage(userInfo?.profilePic)
  }, [userInfo, reset]);

  const {mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await updateUserProfileMultipart(formData)
      return response?.data
    },
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: "Profile Updated Successfully"
      })
      storeUserInfo(data.user)
      queryClient.invalidateQueries({
        queryKey: ['auth', 'userInfo']
      })
    },
  })

  const onSubmit = (data: {name: string, mobile: string, email: string}) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("mobile", data.mobile)
    console.log("formdata",)

    // Attach image file if changed/selected
    if (image && image !== (userInfo?.profilePic || undefined)) {
      const fileName = image.split('/').pop() || 'photo.jpg'
      const ext = fileName.split('.').pop()?.toLowerCase()
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'png' ? 'image/png' : 'image/*'

      formData.append('profilePic', {
        uri: image,
        name: fileName,
        type: mime,
      } as any)
    }
    // send to server
    updateProfile(formData)
  };

  const pickImage = async() => {
   const result =  await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    mediaTypes: ["images"],
    aspect: [4, 3],
    quality: 1,
   })

   if(result.canceled) {
    BottomSheetRef.current?.dismiss()
    return
   }
   setImage(result.assets[0].uri)
   BottomSheetRef.current?.dismiss()
  }

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Required", "Camera permission is needed to use this feature.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })
    if(!result.canceled) {
      setImage(result.assets[0].uri)
    }
    BottomSheetRef.current?.dismiss()

  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: 19,
          paddingBottom: contentInsets.bottom,
          paddingLeft: contentInsets.left,
          paddingRight: contentInsets.right,
          flexGrow: 1
        }}
        keyboardShouldPersistTaps="handled"
        className="bg-background flex-1"
      >
        {/* Profile Header Section */}
        <View className="items-center mb-8">
          <View className="relative">
            {image ? (
              <Image
                source={{ uri: image }}
                className="w-32 h-32 rounded-full border-4 border-primary/20 dark:border-primary/30"
              />
            ) : (
              <View className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 dark:border-primary/30 shadow-lg">
                <LinearGradient
                  colors={['#3b82f6', '#9333ea']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text className="text-white text-4xl font-bold">
                    {userInfo?.name?.charAt(0)?.toUpperCase() || "?"}
                  </Text>
                </LinearGradient>
              </View>
            )}
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-primary rounded-full p-2 border-2 border-background shadow-md"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                BottomSheetRef.current?.present()
              }}
            >
              <Text className="text-primary-foreground text-xs font-semibold">✏️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1">
          {/* Profile Information Section */}
          <View className="space-y-6">

            <Label className="text-sm font-semibold text-muted-foreground mb-2">
              Display Name
            </Label>
            <Controller
              control={control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field: { value, onChange } }) => {
                return (
                  <>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter your name"
                      className="border-b-2 border-blue-400 bg-blue-50 p-4 rounded-md text-md"
                    />
                    {errors.name && (
                      <Text className="text-red-500 text-xs mt-1">{errors.name.message}</Text>
                    )}
                  </>
                );
              }}
            />
          </View>

          <View className="my-2">
            <Label className="text-sm font-semibold text-muted-foreground mb-2">
              Email
            </Label>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required", pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format"
                }
              }}
              render={({ field: { value, onChange } }) => {
                return (
                  <>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="border-b-2 border-blue-400 bg-blue-50 p-4 rounded-md text-md"
                    />
                    {errors.email && (
                      <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>
                    )}
                  </>
                );
              }}
            />
          </View>

          <View className="my-2">
            <Label className="text-sm font-semibold text-muted-foreground mb-2">
              Mobile Number
            </Label>
            <Controller
              control={control}
              name="mobile"
              rules={{
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Invalid mobile number"
                }
              }}
              render={({ field: { value, onChange } }) => {
                return (
                  <>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter your mobile number"
                      keyboardType="phone-pad"
                      className="border-b-2 border-blue-400 bg-blue-50 p-4 rounded-md text-md"
                    />
                    {errors.mobile && (
                      <Text className="text-red-500 text-xs mt-1">{errors.mobile.message}</Text>
                    )}
                  </>
                );
              }}
            />
          </View>

          {/* Account Info Section */}
          <View className="bg-muted/30 dark:bg-muted/20 rounded-xl p-4 border border-border/50">
            <Text className="text-xs font-medium text-muted-foreground mb-2">
              ACCOUNT INFORMATION
            </Text>
            <View className="flex-row items-center justify-between mt-2">
              <Text className="text-sm text-slate-600 dark:text-slate-400">
                Member since
              </Text>
              <Text className="text-sm font-medium text-foreground">
                {formatDate(userInfo?.createdAt)}
              </Text>
            </View>
          </View>

        </View>
        {/* Edit Profile Button */}
        {(isDirty || image !== (userInfo?.profilePic)) && <View className="flex flex-row gap-3">
          <TouchableOpacity
            className={`bg-slate-200 dark:bg-slate-700 w-1/2 rounded-xl p-4 mt-6 mb-4 shadow-md active:bg-slate-300 dark:active:bg-slate-600 ${isPending && "opacity-50"}`}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              reset()
              setImage(userInfo?.profilePic)
            }}
            disabled={!isPending}
          >
            <Text className="text-slate-700 dark:text-slate-200 text-center font-semibold text-base">
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-indigo-600 dark:bg-indigo-500 w-1/2 rounded-xl p-4 mt-6 mb-4 shadow-md active:bg-indigo-700 dark:active:bg-indigo-600"
            onPress={handleSubmit(onSubmit)}
          >
            {!isPending ? <Text className="text-white text-center font-semibold text-base">
              Update
            </Text> : (
              <ActivityIndicator className="text-white"/>
            )}
          </TouchableOpacity>
        </View>}
      </ScrollView>

      <BottomSheetComponent
        ref={BottomSheetRef}
        snapPoints={["60%"]}
      >
        <View className="px-6 pb-4">
          {/* Header */}
          <View className="items-center mb-6">
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Change Profile Picture
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Choose an option to update your profile photo
            </Text>
          </View>

          {/* Options Container */}
          <View className="flex-row gap-4 justify-center">
            {/* Camera Option */}
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                openCamera()
              }}
              className="flex-1 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-6 items-center justify-center shadow-lg active:opacity-80"
              style={{
                backgroundColor: '#3b82f6',
                shadowColor: '#3b82f6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-3">
                <Text className="text-3xl">📷</Text>
              </View>
              <Text className="text-white font-semibold text-base mt-2">
                Camera
              </Text>
              <Text className="text-white/80 text-xs mt-1 text-center">
                Take a photo
              </Text>
            </TouchableOpacity>

            {/* Gallery Option */}
            <TouchableOpacity
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                await pickImage()
              }}
              className="flex-1 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-2xl p-6 items-center justify-center shadow-lg active:opacity-80"
              style={{
                backgroundColor: '#9333ea',
                shadowColor: '#9333ea',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-3">
                <Text className="text-3xl">🖼️</Text>
              </View>
              <Text className="text-white font-semibold text-base mt-2">
                Gallery
              </Text>
              <Text className="text-white/80 text-xs mt-1 text-center">
                Choose from photos
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetComponent>

    </KeyboardAvoidingView>

  );
}
