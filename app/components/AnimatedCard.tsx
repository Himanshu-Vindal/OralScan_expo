import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  animation?: string;
  delay?: number;
  disabled?: boolean;
  elevation?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  onPress,
  style,
  animation = 'fadeInUp',
  delay = 0,
  disabled = false,
  elevation = true,
}) => {
  const { colors } = useTheme();

  const handlePress = () => {
    if (onPress && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const cardStyle = {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    ...(elevation && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }),
    ...style,
  };

  if (onPress) {
    return (
      <Animatable.View animation={animation} delay={delay}>
        <TouchableOpacity
          style={[cardStyle, { opacity: disabled ? 0.6 : 1 }]}
          onPress={handlePress}
          disabled={disabled}
          activeOpacity={0.8}
        >
          {children}
        </TouchableOpacity>
      </Animatable.View>
    );
  }

  return (
    <Animatable.View animation={animation} delay={delay} style={cardStyle}>
      {children}
    </Animatable.View>
  );
};

export default AnimatedCard;
