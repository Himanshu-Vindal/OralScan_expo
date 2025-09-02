import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  gradient?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: 'light' | 'medium' | 'heavy';
}

export default function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  gradient = false,
  style,
  textStyle,
  hapticFeedback = 'light',
}: AnimatedButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;
    
    const hapticType = hapticFeedback === 'light' 
      ? Haptics.ImpactFeedbackStyle.Light
      : hapticFeedback === 'medium'
      ? Haptics.ImpactFeedbackStyle.Medium
      : Haptics.ImpactFeedbackStyle.Heavy;
    
    Haptics.impactAsync(hapticType);
    onPress();
  };

  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: size === 'small' ? 12 : size === 'medium' ? 16 : 20,
      paddingHorizontal: size === 'small' ? 16 : size === 'medium' ? 24 : 32,
      paddingVertical: size === 'small' ? 10 : size === 'medium' ? 14 : 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: size === 'small' ? 40 : size === 'medium' ? 48 : 56,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: gradient ? 'transparent' : '#3B82F6',
          shadowColor: '#3B82F6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: '#F1F5F9',
          borderWidth: 1,
          borderColor: '#E2E8F0',
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: '#3B82F6',
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseTextStyle: TextStyle = {
      fontSize: size === 'small' ? 14 : size === 'medium' ? 16 : 18,
      fontWeight: '600',
    };

    switch (variant) {
      case 'primary':
        return { ...baseTextStyle, color: '#FFFFFF' };
      case 'secondary':
        return { ...baseTextStyle, color: '#334155' };
      case 'outline':
        return { ...baseTextStyle, color: '#3B82F6' };
      case 'ghost':
        return { ...baseTextStyle, color: '#3B82F6' };
      default:
        return baseTextStyle;
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
    const iconColor = variant === 'primary' ? '#FFFFFF' : '#3B82F6';
    
    return (
      <Ionicons 
        name={icon} 
        size={iconSize} 
        color={disabled ? '#94A3B8' : iconColor}
        style={{
          marginRight: iconPosition === 'left' ? 8 : 0,
          marginLeft: iconPosition === 'right' ? 8 : 0,
        }}
      />
    );
  };

  const buttonContent = (
    <Animated.View
      style={[
        getButtonStyle(),
        {
          transform: [{ scale: scaleAnim }],
          opacity: disabled ? 0.5 : opacityAnim,
        },
        style,
      ]}
    >
      {iconPosition === 'left' && renderIcon()}
      
      {loading ? (
        <Animated.View
          style={{
            transform: [{ rotate: '360deg' }],
          }}
        >
          <Ionicons 
            name="sync" 
            size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} 
            color={variant === 'primary' ? '#FFFFFF' : '#3B82F6'} 
          />
        </Animated.View>
      ) : (
        <Text style={[getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
      
      {iconPosition === 'right' && renderIcon()}
    </Animated.View>
  );

  if (gradient && variant === 'primary') {
    return (
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            getButtonStyle(),
            {
              transform: [{ scale: scaleAnim }],
              opacity: disabled ? 0.5 : opacityAnim,
            },
            style,
          ]}
        >
          {iconPosition === 'left' && renderIcon()}
          
          {loading ? (
            <Animated.View
              style={{
                transform: [{ rotate: '360deg' }],
              }}
            >
              <Ionicons 
                name="sync" 
                size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} 
                color="#FFFFFF"
              />
            </Animated.View>
          ) : (
            <Text style={[getTextStyle(), textStyle]}>
              {title}
            </Text>
          )}
          
          {iconPosition === 'right' && renderIcon()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      {buttonContent}
    </TouchableOpacity>
  );
}
