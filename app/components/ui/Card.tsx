import React from 'react';
import { View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps extends ViewProps {
  variant?: 'default' | 'gradient' | 'elevated' | 'outlined';
  gradientColors?: [string, string];
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  gradientColors,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-xl p-4';
  
  const variantClasses = {
    default: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
    gradient: '',
    elevated: 'bg-white dark:bg-slate-800 shadow-lg',
    outlined: 'border-2 border-primary-500 bg-transparent'
  };

  if (variant === 'gradient' && gradientColors) {
    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`${baseClasses} ${className}`}
        {...props}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};

export default Card;
