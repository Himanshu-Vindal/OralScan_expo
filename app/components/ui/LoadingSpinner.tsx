import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
  gradient?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#3b82f6',
  text,
  overlay = false,
  gradient = false,
  className = '',
}) => {
  const content = (
    <View className={`items-center justify-center ${className}`}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text className="text-slate-600 dark:text-slate-400 text-sm mt-3 text-center">
          {text}
        </Text>
      )}
    </View>
  );

  if (overlay) {
    return (
      <View className="absolute inset-0 bg-black/50 items-center justify-center z-50">
        <View className="bg-white dark:bg-slate-800 rounded-xl p-6 mx-8">
          {content}
        </View>
      </View>
    );
  }

  if (gradient) {
    return (
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-xl p-6"
      >
        <View className="items-center justify-center">
          <ActivityIndicator size={size} color="white" />
          {text && (
            <Text className="text-white text-sm mt-3 text-center">
              {text}
            </Text>
          )}
        </View>
      </LinearGradient>
    );
  }

  return content;
};

export default LoadingSpinner;
