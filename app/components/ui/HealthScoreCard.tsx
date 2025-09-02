import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CircularProgress } from 'react-native-circular-progress';

interface HealthScoreCardProps {
  score: number; // 0-100
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({
  score,
  title,
  subtitle,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return { color: '#10b981', gradient: ['#10b981', '#059669'], status: 'excellent' };
    if (score >= 70) return { color: '#3b82f6', gradient: ['#3b82f6', '#1d4ed8'], status: 'good' };
    if (score >= 50) return { color: '#f59e0b', gradient: ['#f59e0b', '#d97706'], status: 'warning' };
    return { color: '#ef4444', gradient: ['#ef4444', '#dc2626'], status: 'critical' };
  };

  const getScoreIcon = (status: string) => {
    switch (status) {
      case 'excellent': return 'checkmark-circle';
      case 'good': return 'thumbs-up';
      case 'warning': return 'warning';
      case 'critical': return 'alert-circle';
      default: return 'help-circle';
    }
  };

  const scoreData = getScoreColor(score);
  
  const sizes = {
    sm: { circle: 60, text: 'text-lg', subtitle: 'text-xs' },
    md: { circle: 80, text: 'text-xl', subtitle: 'text-sm' },
    lg: { circle: 100, text: 'text-2xl', subtitle: 'text-base' }
  };

  return (
    <View className={`bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm ${className}`}>
      <View className="items-center">
        <View className="relative mb-3">
          <CircularProgress
            size={sizes[size].circle}
            width={6}
            fill={score}
            tintColor={scoreData.color}
            backgroundColor="#e2e8f0"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View className="items-center justify-center">
                <Text className={`font-bold text-slate-900 dark:text-white ${sizes[size].text}`}>
                  {Math.round(score)}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  Score
                </Text>
              </View>
            )}
          </CircularProgress>
          
          {showIcon && (
            <View className="absolute -top-1 -right-1">
              <LinearGradient
                colors={scoreData.gradient as [string, string]}
                className="w-6 h-6 rounded-full items-center justify-center"
              >
                <Ionicons 
                  name={getScoreIcon(scoreData.status) as any} 
                  size={14} 
                  color="white" 
                />
              </LinearGradient>
            </View>
          )}
        </View>
        
        <Text className="text-base font-semibold text-slate-900 dark:text-white text-center mb-1">
          {title}
        </Text>
        
        {subtitle && (
          <Text className={`text-slate-600 dark:text-slate-400 text-center ${sizes[size].subtitle}`}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

export default HealthScoreCard;
