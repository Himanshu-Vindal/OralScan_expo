import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  variant?: 'default' | 'gradient';
}

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  variant = 'default',
}: EmptyStateProps) {
  const { colors } = useTheme();

  const handleAction = () => {
    if (onAction) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onAction();
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    }}>
      <Animatable.View
        animation="fadeInUp"
        duration={800}
        style={{ alignItems: 'center' }}
      >
        {variant === 'gradient' ? (
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={{
              borderRadius: 32,
              padding: 20,
              marginBottom: 24,
            }}
          >
            <Ionicons name={icon} size={48} color="#FFFFFF" />
          </LinearGradient>
        ) : (
          <View style={{
            backgroundColor: colors.primary + '20',
            borderRadius: 32,
            padding: 20,
            marginBottom: 24,
          }}>
            <Ionicons name={icon} size={48} color={colors.primary} />
          </View>
        )}

        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.text,
          textAlign: 'center',
          marginBottom: 12,
        }}>
          {title}
        </Text>

        <Text style={{
          fontSize: 16,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: actionText ? 32 : 0,
          maxWidth: 280,
        }}>
          {description}
        </Text>

        {actionText && onAction && (
          <TouchableOpacity
            onPress={handleAction}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 24,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '600',
            }}>
              {actionText}
            </Text>
          </TouchableOpacity>
        )}
      </Animatable.View>
    </View>
  );
}
