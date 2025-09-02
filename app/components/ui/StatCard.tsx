import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onPress?: () => void;
  variant?: 'default' | 'gradient' | 'outlined';
  gradientColors?: [string, string];
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  trend,
  trendValue,
  onPress,
  variant = 'default',
  gradientColors = ['#3b82f6', '#1d4ed8'],
  className = '',
}) => {
  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'remove';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const content = (
    <View className="p-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className={`w-12 h-12 rounded-full items-center justify-center ${
          variant === 'gradient' ? 'bg-white/20' : 'bg-primary-100 dark:bg-primary-900/30'
        }`}>
          <Ionicons 
            name={icon} 
            size={24} 
            color={variant === 'gradient' ? 'white' : '#3b82f6'} 
          />
        </View>
        
        {trend && trendValue && (
          <View className="flex-row items-center">
            <Ionicons 
              name={getTrendIcon() as any} 
              size={16} 
              color={trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#64748b'} 
            />
            <Text className={`text-xs font-medium ml-1 ${getTrendColor()}`}>
              {trendValue}
            </Text>
          </View>
        )}
      </View>
      
      <Text className={`text-2xl font-bold mb-1 ${
        variant === 'gradient' ? 'text-white' : 'text-slate-900 dark:text-white'
      }`}>
        {value}
      </Text>
      
      <Text className={`text-sm ${
        variant === 'gradient' ? 'text-white/80' : 'text-slate-600 dark:text-slate-400'
      }`}>
        {label}
      </Text>
    </View>
  );

  const baseClasses = `rounded-xl ${className}`;

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={!onPress}
        activeOpacity={onPress ? 0.8 : 1}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={`${baseClasses} shadow-lg`}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantClasses = {
    default: 'bg-white dark:bg-slate-800 shadow-sm',
    outlined: 'border-2 border-primary-500 bg-transparent'
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.8 : 1}
      className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]}`}
    >
      {content}
    </TouchableOpacity>
  );
};

export default StatCard;
