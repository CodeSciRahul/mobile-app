import { useState } from 'react';
import { Animated, Text, TextInput, View } from 'react-native';

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  className?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  label,
  error,
  multiline = false,
  secureTextEntry = false,
  className = '',
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className="text-sm font-semibold text-gray-800 mb-2">
          {label}
        </Text>
      )}
      <View className="relative">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`border-2 rounded-xl px-4 py-4 text-base bg-white shadow-sm ${
            isFocused 
              ? 'border-blue-500 shadow-blue-100' 
              : error 
              ? 'border-red-400 shadow-red-100' 
              : 'border-gray-200'
          } ${multiline ? 'min-h-20' : 'h-14'}`}
          style={{
            textAlignVertical: multiline ? 'top' : 'center',
            fontSize: 16,
            color: '#1F2937',
          }}
        />
        {isFocused && (
          <Animated.View 
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500"
            style={{
              opacity: fadeAnim,
              transform: [{
                scaleX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                })
              }]
            }}
          />
        )}
      </View>
      {error && (
        <Text className="text-red-500 text-sm mt-1 font-medium">{error}</Text>
      )}
    </View>
  );
}
