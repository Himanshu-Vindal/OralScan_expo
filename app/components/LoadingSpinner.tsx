import React from 'react';
import { View, Text, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../context/ThemeContext';

interface LoadingSpinnerProps {
  visible: boolean;
  text?: string;
  overlay?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function LoadingSpinner({ 
  visible, 
  text = 'Loading...', 
  overlay = true,
  size = 'medium' 
}: LoadingSpinnerProps) {
  const { colors } = useTheme();

  const sizeConfig = {
    small: { spinner: 32, container: 60, text: 14 },
    medium: { spinner: 48, container: 80, text: 16 },
    large: { spinner: 64, container: 100, text: 18 }
  };

  const config = sizeConfig[size];

  const spinnerContent = (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={{
          width: config.container,
          height: config.container,
          borderRadius: config.container / 2,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Animatable.View
          animation="rotate"
          iterationCount="infinite"
          duration={1500}
          easing="linear"
        >
          <Ionicons name="sync" size={config.spinner} color="#FFFFFF" />
        </Animatable.View>
      </LinearGradient>
      
      <Text style={{
        fontSize: config.text,
        fontWeight: '600',
        color: overlay ? '#FFFFFF' : colors.text,
        textAlign: 'center',
      }}>
        {text}
      </Text>
    </View>
  );

  if (!visible) return null;

  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Animatable.View
            animation="fadeIn"
            duration={300}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 24,
              alignItems: 'center',
              minWidth: 200,
            }}
          >
            {spinnerContent}
          </Animatable.View>
        </View>
      </Modal>
    );
  }

  return spinnerContent;
}
