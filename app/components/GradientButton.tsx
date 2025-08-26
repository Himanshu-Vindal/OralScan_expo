import React from 'react';
import { TouchableOpacity, Text, View, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from './LoadingSpinner';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  style?: ViewStyle;
  textStyle?: TextStyle;
  animation?: string;
  delay?: number;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  size = 'medium',
  variant = 'primary',
  style,
  textStyle,
  animation = 'fadeInUp',
  delay = 0,
}) => {
  const { colors } = useTheme();

  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return [colors.primary, colors.secondary];
      case 'secondary':
        return [colors.secondary, colors.primary];
      case 'success':
        return [colors.success, '#059669'];
      case 'warning':
        return [colors.warning, '#d97706'];
      case 'error':
        return [colors.error, '#dc2626'];
      default:
        return [colors.primary, colors.secondary];
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
          fontSize: 14,
          iconSize: 16,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 12,
          fontSize: 16,
          iconSize: 20,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 16,
          fontSize: 18,
          iconSize: 24,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 12,
          fontSize: 16,
          iconSize: 20,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const gradientColors = getGradientColors();

  const buttonContent = () => {
    if (loading) {
      return <LoadingSpinner size="small" color="white" />;
    }

    const iconElement = icon && (
      <Ionicons 
        name={icon as any} 
        size={sizeStyles.iconSize} 
        color="white" 
      />
    );

    const textElement = (
      <Text 
        style={[{ fontSize: sizeStyles.fontSize }, textStyle]}
      >
        {title}
      </Text>
    );

    if (icon) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {iconPosition === 'left' && iconElement}
          {textElement}
          {iconPosition === 'right' && iconElement}
        </View>
      );
    }

    return textElement;
  };

  return (
    <Animatable.View animation={animation} delay={delay}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          {
            borderRadius: sizeStyles.borderRadius,
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            borderRadius: sizeStyles.borderRadius,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {buttonContent()}
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default GradientButton;
