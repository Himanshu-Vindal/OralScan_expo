import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  FlatList,
  ScrollView,
  ViewStyle,
} from 'react-native';

interface AnimatedListProps {
  data?: any[];
  renderItem?: ({ item, index }: { item: any; index: number }) => React.ReactElement;
  children?: React.ReactNode;
  style?: ViewStyle;
  staggerDelay?: number;
  animationType?: 'fadeInUp' | 'slideInLeft' | 'slideInRight' | 'scale';
  useScrollView?: boolean;
  showsVerticalScrollIndicator?: boolean;
}

export default function AnimatedList({
  data,
  renderItem,
  children,
  style,
  staggerDelay = 100,
  animationType = 'fadeInUp',
  useScrollView = false,
  showsVerticalScrollIndicator = false,
}: AnimatedListProps) {
  const animatedValues = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    if (data) {
      // Initialize animated values for each item
      animatedValues.length = data.length;
      for (let i = 0; i < data.length; i++) {
        if (!animatedValues[i]) {
          animatedValues[i] = new Animated.Value(0);
        }
      }

      // Start staggered animations
      const animations = animatedValues.map((animValue, index) =>
        Animated.timing(animValue, {
          toValue: 1,
          duration: 500,
          delay: index * staggerDelay,
          useNativeDriver: true,
        })
      );

      const staggerAnimation = Animated.stagger(staggerDelay, animations);
      staggerAnimation.start();

      // Cleanup function
      return () => {
        staggerAnimation.stop();
        animatedValues.forEach(animValue => {
          animValue.stopAnimation();
        });
      };
    }
  }, [data, staggerDelay, animatedValues]);

  const getAnimatedStyle = (index: number) => {
    if (!animatedValues[index]) return {};

    const animValue = animatedValues[index];

    switch (animationType) {
      case 'fadeInUp':
        return {
          opacity: animValue,
          transform: [
            {
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        };
      case 'slideInLeft':
        return {
          opacity: animValue,
          transform: [
            {
              translateX: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        };
      case 'slideInRight':
        return {
          opacity: animValue,
          transform: [
            {
              translateX: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        };
      case 'scale':
        return {
          opacity: animValue,
          transform: [
            {
              scale: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        };
      default:
        return { opacity: animValue };
    }
  };

  const AnimatedItem = ({ item, index }: { item: any; index: number }) => {
    if (!renderItem) return null;

    return (
      <Animated.View style={getAnimatedStyle(index)}>
        {renderItem({ item, index })}
      </Animated.View>
    );
  };

  if (useScrollView || children) {
    return (
      <ScrollView
        style={style}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      >
        {children}
      </ScrollView>
    );
  }

  if (!data || !renderItem) {
    return <View style={style}>{children}</View>;
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => <AnimatedItem item={item} index={index} />}
      keyExtractor={(item, index) => index.toString()}
      style={style}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    />
  );
}
