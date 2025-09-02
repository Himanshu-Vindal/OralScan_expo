import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  gradientColors?: [string, string];
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  gradientColors = ['#3b82f6', '#1d4ed8'],
  className = '',
}) => {
  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-2 min-h-[36px]',
    md: 'px-4 py-3 min-h-[44px]',
    lg: 'px-6 py-4 min-h-[52px]'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const baseClasses = `
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    rounded-xl
    flex-row
    items-center
    justify-center
    ${disabled || loading ? 'opacity-50' : ''}
    ${className}
  `.trim();

  const variantStyles = {
    primary: 'bg-primary-500 active:bg-primary-600',
    secondary: 'bg-slate-200 dark:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600',
    outline: 'border-2 border-primary-500 bg-transparent active:bg-primary-50 dark:active:bg-primary-900/20',
    ghost: 'bg-transparent active:bg-slate-100 dark:active:bg-slate-800',
    gradient: ''
  };

  const textColors = {
    primary: 'text-white',
    secondary: 'text-slate-700 dark:text-slate-200',
    outline: 'text-primary-500',
    ghost: 'text-slate-700 dark:text-slate-200',
    gradient: 'text-white'
  };

  const renderContent = () => (
    <>
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'gradient' ? 'white' : '#3b82f6'} 
          className="mr-2"
        />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <Ionicons 
          name={icon} 
          size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} 
          color={variant === 'primary' || variant === 'gradient' ? 'white' : '#3b82f6'} 
          className="mr-2"
        />
      )}
      <Text className={`font-semibold ${textSizeClasses[size]} ${textColors[variant]}`}>
        {title}
      </Text>
      {icon && iconPosition === 'right' && !loading && (
        <Ionicons 
          name={icon} 
          size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} 
          color={variant === 'primary' || variant === 'gradient' ? 'white' : '#3b82f6'} 
          className="ml-2"
        />
      )}
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={baseClasses}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={`${baseClasses} ${variantStyles[variant]}`}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default Button;
