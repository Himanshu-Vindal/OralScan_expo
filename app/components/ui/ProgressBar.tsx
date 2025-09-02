import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  gradient?: boolean;
  gradientColors?: [string, string];
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showPercentage = false,
  color = '#3b82f6',
  backgroundColor = '#e2e8f0',
  gradient = false,
  gradientColors = ['#3b82f6', '#1d4ed8'],
  label,
  className = '',
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View className={className}>
      {(label || showPercentage) && (
        <View className="flex-row justify-between items-center mb-2">
          {label && (
            <Text className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {label}
            </Text>
          )}
          {showPercentage && (
            <Text className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {Math.round(clampedProgress)}%
            </Text>
          )}
        </View>
      )}
      
      <View 
        className="rounded-full overflow-hidden"
        style={{ 
          height, 
          backgroundColor: backgroundColor 
        }}
      >
        {gradient ? (
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: `${clampedProgress}%`,
              height: '100%',
            }}
          />
        ) : (
          <View
            style={{
              width: `${clampedProgress}%`,
              height: '100%',
              backgroundColor: color,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default ProgressBar;
