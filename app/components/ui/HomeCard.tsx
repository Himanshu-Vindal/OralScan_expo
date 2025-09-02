import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface HomeCardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'default' | 'gradient' | 'metric' | 'action';
  onPress?: () => void;
  className?: string;
}

export default function HomeCard({
  title,
  subtitle,
  value,
  icon,
  variant = 'default',
  onPress,
  className = '',
}: HomeCardProps) {
  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  // Base Tailwind classes for all variants
  const baseClasses = `
    rounded-xl p-4 mb-4
    ${onPress ? 'active:scale-95' : ''}
    transition-all duration-200
    ${className}
  `;

  // Variant-specific classes (NativeWind compatible)
  const variantClasses = {
    default: `
      bg-white dark:bg-medical-800 
      border border-medical-200 dark:border-medical-700
      shadow-sm
    `,
    gradient: `
      bg-gradient-to-r from-primary-500 to-accent-cyan
      shadow-medical
    `,
    metric: `
      bg-white dark:bg-medical-800
      border border-medical-200 dark:border-medical-700
      shadow-md
    `,
    action: `
      bg-gradient-to-r from-primary-500 to-primary-600
      shadow-lg active:shadow-md
    `,
  };

  const textClasses = {
    default: 'text-medical-900 dark:text-medical-100',
    gradient: 'text-white',
    metric: 'text-medical-900 dark:text-medical-100',
    action: 'text-white',
  };

  const subtitleClasses = {
    default: 'text-medical-600 dark:text-medical-400',
    gradient: 'text-white/80',
    metric: 'text-medical-500 dark:text-medical-400',
    action: 'text-white/90',
  };

  if (variant === 'gradient' || variant === 'action') {
    return (
      <LinearGradient
        colors={variant === 'gradient' 
          ? ['#3b82f6', '#06b6d4'] 
          : ['#3b82f6', '#2563eb']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        <TouchableOpacity
          onPress={handlePress}
          disabled={!onPress}
          activeOpacity={0.8}
          className="flex-1"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className={`text-lg font-semibold ${textClasses[variant]}`}>
                {title}
              </Text>
              {subtitle && (
                <Text className={`text-sm mt-1 ${subtitleClasses[variant]}`}>
                  {subtitle}
                </Text>
              )}
              {value && (
                <Text className={`text-2xl font-bold mt-2 ${textClasses[variant]}`}>
                  {value}
                </Text>
              )}
            </View>
            {icon && (
              <View className="ml-4">
                <View className="bg-white/20 rounded-full p-3">
                  <Ionicons 
                    name={icon} 
                    size={24} 
                    color="white" 
                  />
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!onPress}
      activeOpacity={0.8}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className={`text-lg font-semibold ${textClasses[variant]}`}>
            {title}
          </Text>
          {subtitle && (
            <Text className={`text-sm mt-1 ${subtitleClasses[variant]}`}>
              {subtitle}
            </Text>
          )}
          {value && (
            <Text className={`text-2xl font-bold mt-2 ${textClasses[variant]}`}>
              {value}
            </Text>
          )}
        </View>
        {icon && (
          <View className="ml-4">
            <View className={`
              ${variant === 'metric' ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-medical-100 dark:bg-medical-700'} 
              rounded-full p-3
            `}>
              <Ionicons 
                name={icon} 
                size={24} 
                color={variant === 'metric' ? '#3b82f6' : '#64748b'} 
              />
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// Usage Examples:
/*
// Metric Card
<HomeCard
  title="AI Accuracy"
  value="94.2%"
  icon="analytics"
  variant="metric"
  className="mx-4"
/>

// Action Card
<HomeCard
  title="Quick Scan"
  subtitle="Start your oral health check"
  icon="camera"
  variant="action"
  onPress={() => router.push('/scan')}
/>

// Gradient Card
<HomeCard
  title="Daily Tip"
  subtitle="Brush for 2 minutes twice daily"
  icon="bulb"
  variant="gradient"
/>
*/
