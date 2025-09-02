import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  variant?: 'default' | 'gradient';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  variant = 'default',
  className = '',
}) => {
  const handleAction = () => {
    if (onAction) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onAction();
    }
  };

  return (
    <View className={`items-center justify-center p-8 ${className}`}>
      {variant === 'gradient' ? (
        <LinearGradient
          colors={['#3b82f6', '#1d4ed8']}
          className="w-20 h-20 rounded-full items-center justify-center mb-6"
        >
          <Ionicons name={icon} size={40} color="white" />
        </LinearGradient>
      ) : (
        <View className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center mb-6">
          <Ionicons name={icon} size={40} color="#64748b" />
        </View>
      )}
      
      <Text className="text-xl font-bold text-slate-900 dark:text-white text-center mb-3">
        {title}
      </Text>
      
      <Text className="text-base text-slate-600 dark:text-slate-400 text-center leading-6 mb-8 max-w-sm">
        {description}
      </Text>
      
      {actionText && onAction && (
        <TouchableOpacity
          onPress={handleAction}
          className="bg-primary-500 px-6 py-3 rounded-xl shadow-sm active:bg-primary-600"
        >
          <Text className="text-white text-base font-semibold">
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;
