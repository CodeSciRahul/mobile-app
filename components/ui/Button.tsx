import { useRef, useState } from 'react';
import { Animated, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  className = ''
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    };

    const sizeStyles: Record<string, ViewStyle> = {
      small: { paddingHorizontal: 16, paddingVertical: 10, minHeight: 40 },
      medium: { paddingHorizontal: 20, paddingVertical: 14, minHeight: 48 },
      large: { paddingHorizontal: 24, paddingVertical: 18, minHeight: 56 },
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: { 
        backgroundColor: disabled ? '#D1D5DB' : '#3B82F6',
        shadowColor: disabled ? '#D1D5DB' : '#3B82F6',
      },
      secondary: { 
        backgroundColor: disabled ? '#D1D5DB' : '#6B7280',
        shadowColor: disabled ? '#D1D5DB' : '#6B7280',
      },
      outline: { 
        backgroundColor: 'transparent', 
        borderWidth: 2, 
        borderColor: disabled ? '#D1D5DB' : '#3B82F6',
        shadowOpacity: 0,
        elevation: 0,
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyles = (): TextStyle => {
    const baseStyles: TextStyle = {
      fontWeight: '600',
      letterSpacing: 0.5,
    };

    const sizeStyles: Record<string, TextStyle> = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    const variantStyles: Record<string, TextStyle> = {
      primary: { color: disabled ? '#9CA3AF' : 'white' },
      secondary: { color: disabled ? '#9CA3AF' : 'white' },
      outline: { color: disabled ? '#9CA3AF' : '#3B82F6' },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={getButtonStyles()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        className={className}
        activeOpacity={0.8}
      >
        <Text style={getTextStyles()}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
