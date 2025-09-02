import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  ViewStyle,
} from 'react-native';

interface PulseAnimationProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  pulseColor?: string;
  pulseOpacity?: number;
  duration?: number;
  size?: number;
  repeat?: boolean;
  delay?: number;
}

export default function PulseAnimation({
  children,
  style,
  pulseColor = '#3B82F6',
  pulseOpacity = 0.3,
  duration = 1500,
  size = 100,
  repeat = true,
  delay = 0,
}: PulseAnimationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animationRef: Animated.CompositeAnimation | null = null;
    
    const createPulseAnimation = () => {
      return Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ]);
    };

    const resetAnimation = () => {
      scaleAnim.setValue(0);
      opacityAnim.setValue(pulseOpacity);
    };

    const startAnimation = () => {
      resetAnimation();
      
      if (repeat) {
        animationRef = Animated.loop(
          Animated.sequence([
            createPulseAnimation(),
            Animated.delay(100),
          ])
        );
        animationRef.start();
      } else {
        animationRef = createPulseAnimation();
        animationRef.start();
      }
    };

    const timer = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timer);
      if (animationRef) {
        animationRef.stop();
      }
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, [duration, repeat, delay, pulseOpacity, scaleAnim, opacityAnim]);

  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center' }, style]}>
      {/* Pulse circles */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: pulseColor,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        }}
      />
      
      <Animated.View
        style={{
          position: 'absolute',
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: (size * 0.7) / 2,
          backgroundColor: pulseColor,
          opacity: opacityAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, pulseOpacity * 0.5],
          }),
          transform: [
            {
              scale: scaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.8],
              }),
            },
          ],
        }}
      />

      {/* Content */}
      {children && (
        <View style={{ zIndex: 1 }}>
          {children}
        </View>
      )}
    </View>
  );
}
