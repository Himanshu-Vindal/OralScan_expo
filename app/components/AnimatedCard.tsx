import React, { useRef } from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  gradient?: boolean;
  gradientColors?: string[];
  shadow?: boolean;
  hapticFeedback?: boolean;
  animationType?: 'scale' | 'lift' | 'none';
}

export default function AnimatedCard({
  children,
  onPress,
  style,
  gradient = false,
  gradientColors = ['#F8FAFC', '#F1F5F9'],
  shadow = true,
  hapticFeedback = true,
  animationType = 'scale',
}: AnimatedCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const shadowOpacityAnim = useRef(new Animated.Value(shadow ? 0.1 : 0)).current;

  const handlePressIn = () => {
    if (!onPress || animationType === 'none') return;

    if (animationType === 'scale') {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    } else if (animationType === 'lift') {
      Animated.parallel([
        Animated.spring(translateYAnim, {
          toValue: -2,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.timing(shadowOpacityAnim, {
          toValue: shadow ? 0.2 : 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (!onPress || animationType === 'none') return;

    if (animationType === 'scale') {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    } else if (animationType === 'lift') {
      Animated.parallel([
        Animated.spring(translateYAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.timing(shadowOpacityAnim, {
          toValue: shadow ? 0.1 : 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handlePress = () => {
    if (!onPress) return;
    
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const baseStyle: ViewStyle = {
    borderRadius: 16,
    padding: 16,
    backgroundColor: gradient ? 'transparent' : '#FFFFFF',
    ...(shadow && {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 4,
    }),
  };

  const animatedStyle = {
    transform: [
      { scale: scaleAnim },
      { translateY: translateYAnim },
    ],
    ...(shadow && {
      shadowOpacity: shadowOpacityAnim,
    }),
  };

  const cardContent = (
    <Animated.View style={[baseStyle, animatedStyle, style]}>
      {children}
    </Animated.View>
  );

  if (gradient) {
    const content = (
      <Animated.View style={[animatedStyle]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[baseStyle, style]}
        >
          {children}
        </LinearGradient>
      </Animated.View>
    );

    if (onPress) {
      return (
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          activeOpacity={1}
        >
          {content}
        </TouchableOpacity>
      );
    }

    return content;
  }

  if (onPress) {
    return (
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={1}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
}
