import React from 'react';
import { View, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  text,
  color,
}) => {
  const { colors } = useTheme();

  const sizeMap = {
    small: 20,
    medium: 32,
    large: 48,
  };

  const iconSize = sizeMap[size];
  const spinnerColor = color || colors.primary;

  return (
    <View className="items-center justify-center">
      <Animatable.View
        animation="rotate"
        iterationCount="infinite"
        duration={1000}
        easing="linear"
      >
        <Ionicons name="refresh" size={iconSize} color={spinnerColor} />
      </Animatable.View>
      
      {text && (
        <Animatable.Text
          animation="pulse"
          iterationCount="infinite"
          className="mt-2 text-sm"
          style={{ color: colors.onSurface }}
        >
          {text}
        </Animatable.Text>
      )}
    </View>
  );
};

export default LoadingSpinner;
