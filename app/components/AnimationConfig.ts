// Animation configuration for consistent 60fps performance across the app
export const AnimationConfig = {
  // Standard durations for consistent timing
  durations: {
    fast: 200,
    normal: 300,
    slow: 500,
    extra_slow: 800,
  },

  // Easing functions optimized for native driver
  easing: {
    ease: 'ease-out',
    linear: 'linear',
    bounce: 'ease-out-bounce',
    spring: 'ease-out-back',
  },

  // Common animation presets using native driver
  presets: {
    fadeIn: {
      animation: 'fadeIn' as const,
      duration: 300,
      useNativeDriver: true,
    },
    fadeOut: {
      animation: 'fadeOut' as const,
      duration: 200,
      useNativeDriver: true,
    },
    slideInUp: {
      animation: 'slideInUp' as const,
      duration: 400,
      useNativeDriver: true,
    },
    slideInDown: {
      animation: 'slideInDown' as const,
      duration: 400,
      useNativeDriver: true,
    },
    slideInLeft: {
      animation: 'slideInLeft' as const,
      duration: 300,
      useNativeDriver: true,
    },
    slideInRight: {
      animation: 'slideInRight' as const,
      duration: 300,
      useNativeDriver: true,
    },
    bounceIn: {
      animation: 'bounceIn' as const,
      duration: 600,
      useNativeDriver: true,
    },
    zoomIn: {
      animation: 'zoomIn' as const,
      duration: 400,
      useNativeDriver: true,
    },
    pulse: {
      animation: 'pulse' as const,
      duration: 1000,
      iterationCount: 'infinite' as const,
      useNativeDriver: true,
    },
    rotate: {
      animation: 'rotate' as const,
      duration: 1500,
      iterationCount: 'infinite' as const,
      easing: 'linear' as const,
      useNativeDriver: true,
    },
  },

  // Staggered animation delays for list items
  stagger: {
    delay: 100,
    maxDelay: 500,
  },

  // Spring animation configs for smooth interactions
  spring: {
    tension: 100,
    friction: 8,
    useNativeDriver: true,
  },

  // Timing animation configs
  timing: {
    duration: 300,
    useNativeDriver: true,
  },
};

// Helper function to create staggered animations
export const createStaggeredAnimation = (index: number, maxItems: number = 10) => {
  const delay = Math.min(index * AnimationConfig.stagger.delay, AnimationConfig.stagger.maxDelay);
  return {
    ...AnimationConfig.presets.fadeIn,
    delay,
  };
};

// Helper function for optimized scale animations
export const createScaleAnimation = (toValue: number, duration: number = 300) => ({
  toValue,
  duration,
  useNativeDriver: true,
});

// Helper function for optimized opacity animations
export const createOpacityAnimation = (toValue: number, duration: number = 300) => ({
  toValue,
  duration,
  useNativeDriver: true,
});

// Helper function for optimized transform animations
export const createTransformAnimation = (
  property: 'translateX' | 'translateY' | 'rotate',
  toValue: number,
  duration: number = 300
) => ({
  [property]: toValue,
  duration,
  useNativeDriver: true,
});
