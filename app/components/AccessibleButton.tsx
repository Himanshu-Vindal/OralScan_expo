import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ViewStyle,
  TextStyle,
  AccessibilityRole,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface AccessibleButtonProps {
  title: string;
  onPress: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: boolean;
  testID?: string;
}

export default function AccessibleButton({
  title,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  icon,
  disabled = false,
  style,
  textStyle,
  hapticFeedback = true,
  testID,
}: AccessibleButtonProps) {
  const handlePress = () => {
    if (disabled) return;
    
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      accessible={true}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      testID={testID}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 12,
          backgroundColor: disabled ? '#E5E7EB' : '#3B82F6',
          minHeight: 48, // Minimum touch target size for accessibility
          minWidth: 48,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={disabled ? '#9CA3AF' : '#FFFFFF'}
          style={{ marginRight: title ? 8 : 0 }}
        />
      )}
      
      {title && (
        <Text
          style={[
            {
              fontSize: 16,
              fontWeight: '600',
              color: disabled ? '#9CA3AF' : '#FFFFFF',
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
