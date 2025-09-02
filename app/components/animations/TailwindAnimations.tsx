import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Easing } from 'react-native';

/**
 * Tailwind Animation Utilities & Transition Guide
 * 
 * This file provides reusable animation components and utilities
 * that work seamlessly with Tailwind CSS classes and NativeWind.
 */

// Fade In Animation Component
interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, duration = 300, delay = 0, className = '' }: FadeInProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [fadeAnim, duration, delay]);

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className={className}
    >
      {children}
    </Animated.View>
  );
}

// Slide In Animation Component
interface SlideInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  distance?: number;
  className?: string;
}

export function SlideIn({ 
  children, 
  direction = 'up', 
  duration = 400, 
  delay = 0, 
  distance = 50,
  className = '' 
}: SlideInProps) {
  const slideAnim = useRef(new Animated.Value(distance)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [slideAnim, opacityAnim, duration, delay]);

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return [{ translateY: slideAnim }];
      case 'down':
        return [{ translateY: slideAnim.interpolate({
          inputRange: [0, distance],
          outputRange: [0, -distance],
        }) }];
      case 'left':
        return [{ translateX: slideAnim.interpolate({
          inputRange: [0, distance],
          outputRange: [0, -distance],
        }) }];
      case 'right':
        return [{ translateX: slideAnim }];
      default:
        return [{ translateY: slideAnim }];
    }
  };

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: getTransform(),
      }}
      className={className}
    >
      {children}
    </Animated.View>
  );
}

// Scale In Animation Component
interface ScaleInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  initialScale?: number;
  className?: string;
}

export function ScaleIn({ 
  children, 
  duration = 300, 
  delay = 0, 
  initialScale = 0.8,
  className = '' 
}: ScaleInProps) {
  const scaleAnim = useRef(new Animated.Value(initialScale)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: duration * 0.6,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [scaleAnim, opacityAnim, duration, delay]);

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
      }}
      className={className}
    >
      {children}
    </Animated.View>
  );
}

// Staggered Animation Container
interface StaggeredAnimationProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  animationType?: 'fadeIn' | 'slideIn' | 'scaleIn';
  className?: string;
}

export function StaggeredAnimation({ 
  children, 
  staggerDelay = 100, 
  animationType = 'fadeIn',
  className = '' 
}: StaggeredAnimationProps) {
  const AnimationComponent = {
    fadeIn: FadeIn,
    slideIn: SlideIn,
    scaleIn: ScaleIn,
  }[animationType];

  return (
    <View className={className}>
      {children.map((child, index) => (
        <AnimationComponent key={index} delay={index * staggerDelay}>
          {child}
        </AnimationComponent>
      ))}
    </View>
  );
}

// Pulse Animation Component
interface PulseProps {
  children: React.ReactNode;
  duration?: number;
  minScale?: number;
  maxScale?: number;
  className?: string;
}

export function Pulse({ 
  children, 
  duration = 1000, 
  minScale = 1, 
  maxScale = 1.05,
  className = '' 
}: PulseProps) {
  const pulseAnim = useRef(new Animated.Value(minScale)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: maxScale,
          duration: duration / 2,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: minScale,
          duration: duration / 2,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim, duration, minScale, maxScale]);

  return (
    <Animated.View
      style={{ transform: [{ scale: pulseAnim }] }}
      className={className}
    >
      {children}
    </Animated.View>
  );
}

// Bounce Animation Component
interface BounceProps {
  children: React.ReactNode;
  trigger?: boolean;
  className?: string;
}

export function Bounce({ children, trigger = false, className = '' }: BounceProps) {
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (trigger) {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.2,
          duration: 150,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [trigger, bounceAnim]);

  return (
    <Animated.View
      style={{ transform: [{ scale: bounceAnim }] }}
      className={className}
    >
      {children}
    </Animated.View>
  );
}

// Rotation Animation Component
interface RotateProps {
  children: React.ReactNode;
  duration?: number;
  continuous?: boolean;
  className?: string;
}

export function Rotate({ 
  children, 
  duration = 2000, 
  continuous = true,
  className = '' 
}: RotateProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotation = continuous
      ? Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        )
      : Animated.timing(rotateAnim, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        });

    rotation.start();

    return () => rotation.stop();
  }, [rotateAnim, duration, continuous]);

  return (
    <Animated.View
      style={{
        transform: [{
          rotate: rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          }),
        }],
      }}
      className={className}
    >
      {children}
    </Animated.View>
  );
}

/**
 * Tailwind Animation Classes Reference
 * 
 * These classes work with NativeWind and can be used directly in className props:
 */

export const TailwindAnimationClasses = {
  // Basic Animations
  'animate-pulse': 'Gentle pulsing effect',
  'animate-bounce': 'Bouncing animation',
  'animate-spin': 'Continuous rotation',
  'animate-ping': 'Scaling ping effect',
  
  // Transitions
  'transition-all': 'Smooth transition for all properties',
  'transition-colors': 'Color transition only',
  'transition-transform': 'Transform transition only',
  'transition-opacity': 'Opacity transition only',
  
  // Duration
  'duration-75': '75ms transition',
  'duration-100': '100ms transition',
  'duration-150': '150ms transition',
  'duration-200': '200ms transition',
  'duration-300': '300ms transition',
  'duration-500': '500ms transition',
  'duration-700': '700ms transition',
  'duration-1000': '1000ms transition',
  
  // Easing
  'ease-linear': 'Linear easing',
  'ease-in': 'Ease in',
  'ease-out': 'Ease out',
  'ease-in-out': 'Ease in-out',
  
  // Transform
  'scale-0': 'Scale to 0%',
  'scale-50': 'Scale to 50%',
  'scale-75': 'Scale to 75%',
  'scale-90': 'Scale to 90%',
  'scale-95': 'Scale to 95%',
  'scale-100': 'Scale to 100% (normal)',
  'scale-105': 'Scale to 105%',
  'scale-110': 'Scale to 110%',
  'scale-125': 'Scale to 125%',
  
  // Opacity
  'opacity-0': 'Fully transparent',
  'opacity-25': '25% opacity',
  'opacity-50': '50% opacity',
  'opacity-75': '75% opacity',
  'opacity-100': 'Fully opaque',
  
  // Translate
  'translate-x-0': 'No horizontal translation',
  'translate-y-0': 'No vertical translation',
  '-translate-y-1': 'Move up 4px',
  '-translate-y-2': 'Move up 8px',
  'translate-y-1': 'Move down 4px',
  'translate-y-2': 'Move down 8px',
};

/**
 * Animation Best Practices for OralScan:
 * 
 * 1. Use native driver for better performance
 * 2. Keep animations under 300ms for micro-interactions
 * 3. Use spring animations for natural feel
 * 4. Stagger animations for list items
 * 5. Respect user's motion preferences
 * 6. Test on lower-end devices
 */

export const AnimationPresets = {
  // Button Press
  buttonPress: {
    scale: 0.95,
    duration: 150,
    easing: Easing.out(Easing.quad),
  },
  
  // Card Hover
  cardHover: {
    scale: 1.02,
    duration: 200,
    easing: Easing.out(Easing.cubic),
  },
  
  // Modal Enter
  modalEnter: {
    scale: { from: 0.9, to: 1 },
    opacity: { from: 0, to: 1 },
    duration: 300,
    easing: Easing.out(Easing.cubic),
  },
  
  // Toast Notification
  toastEnter: {
    translateY: { from: -50, to: 0 },
    opacity: { from: 0, to: 1 },
    duration: 250,
    easing: Easing.out(Easing.back(1.2)),
  },
  
  // Loading Spinner
  loadingSpinner: {
    rotation: '360deg',
    duration: 1000,
    easing: Easing.linear,
    loop: true,
  },
  
  // Success Checkmark
  successCheck: {
    scale: { from: 0, to: 1 },
    duration: 400,
    easing: Easing.out(Easing.back(2)),
  },
};

// Usage Examples Component
export function AnimationExamples() {
  return (
    <View className="p-6 space-y-6">
      <Text className="text-2xl font-bold text-medical-900 dark:text-medical-100">
        Animation Examples
      </Text>
      
      {/* Fade In */}
      <FadeIn delay={100}>
        <View className="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-xl">
          <Text className="text-primary-700 dark:text-primary-300 font-medium">
            Fade In Animation
          </Text>
        </View>
      </FadeIn>
      
      {/* Slide In */}
      <SlideIn direction="left" delay={200}>
        <View className="bg-health-excellent/10 p-4 rounded-xl border border-health-excellent/20">
          <Text className="text-health-excellent font-medium">
            Slide In from Left
          </Text>
        </View>
      </SlideIn>
      
      {/* Scale In */}
      <ScaleIn delay={300}>
        <View className="bg-accent-cyan/10 p-4 rounded-xl border border-accent-cyan/20">
          <Text className="text-accent-cyan font-medium">
            Scale In Animation
          </Text>
        </View>
      </ScaleIn>
      
      {/* Pulse */}
      <Pulse>
        <View className="bg-health-warning/10 p-4 rounded-xl border border-health-warning/20">
          <Text className="text-health-warning font-medium">
            Pulsing Element
          </Text>
        </View>
      </Pulse>
      
      {/* Staggered Animation */}
      <StaggeredAnimation staggerDelay={100} animationType="slideIn">
        {[1, 2, 3].map((item) => (
          <View 
            key={item}
            className="bg-medical-100 dark:bg-medical-800 p-3 rounded-lg mb-2"
          >
            <Text className="text-medical-700 dark:text-medical-300">
              Staggered Item {item}
            </Text>
          </View>
        ))}
      </StaggeredAnimation>
    </View>
  );
}
