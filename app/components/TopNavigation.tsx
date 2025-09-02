import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

interface TopNavigationProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  gradient?: boolean;
  transparent?: boolean;
}

export default function TopNavigation({
  title,
  subtitle,
  showBackButton = true,
  rightIcon,
  onRightPress,
  backgroundColor,
  textColor,
  gradient = false,
  transparent = false,
}: TopNavigationProps) {
  const { colors, isDark } = useTheme();

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)');
  };

  const handleRightPress = () => {
    if (onRightPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onRightPress();
    }
  };

  const containerStyle = {
    backgroundColor: transparent 
      ? 'transparent' 
      : backgroundColor || colors.surface,
    borderBottomWidth: transparent ? 0 : 1,
    borderBottomColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: transparent ? 0 : 0.1,
    shadowRadius: 4,
    elevation: transparent ? 0 : 4,
  };

  const content = (
    <View style={containerStyle}>
      <StatusBar 
        barStyle={transparent ? "light-content" : isDark ? "light-content" : "dark-content"} 
        backgroundColor={transparent ? "transparent" : backgroundColor || colors.surface}
        translucent={transparent}
      />
      <SafeAreaView edges={['top']}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          minHeight: 56,
        }}>
          {/* Left Side - Back Button */}
          <View style={{ width: 40 }}>
            {showBackButton && (
              <TouchableOpacity
                onPress={handleBackPress}
                style={{
                  backgroundColor: transparent 
                    ? 'rgba(255,255,255,0.2)' 
                    : colors.background,
                  borderRadius: 12,
                  padding: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="arrow-back" 
                  size={20} 
                  color={transparent ? '#FFFFFF' : textColor || colors.text} 
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Center - Title and Subtitle */}
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 16 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: transparent ? '#FFFFFF' : textColor || colors.text,
              textAlign: 'center',
            }}>
              {title}
            </Text>
            {subtitle && (
              <Text style={{
                fontSize: 14,
                color: transparent 
                  ? 'rgba(255,255,255,0.8)' 
                  : textColor ? `${textColor}80` : colors.textSecondary,
                textAlign: 'center',
                marginTop: 2,
              }}>
                {subtitle}
              </Text>
            )}
          </View>

          {/* Right Side - Action Button */}
          <View style={{ width: 40, alignItems: 'flex-end' }}>
            {rightIcon && (
              <TouchableOpacity
                onPress={handleRightPress}
                style={{
                  backgroundColor: transparent 
                    ? 'rgba(255,255,255,0.2)' 
                    : colors.background,
                  borderRadius: 12,
                  padding: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={rightIcon} 
                  size={20} 
                  color={transparent ? '#FFFFFF' : textColor || colors.text} 
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {content}
      </LinearGradient>
    );
  }

  return content;
}
