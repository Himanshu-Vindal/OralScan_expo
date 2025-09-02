import { Platform } from 'react-native';

// Typography system for OralScan app
export const typography = {
  // Font families
  fonts: {
    regular: Platform.select({
      ios: 'SF Pro Display',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'SF Pro Display Medium',
      android: 'Roboto Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'SF Pro Display Bold',
      android: 'Roboto Bold',
      default: 'System',
    }),
    light: Platform.select({
      ios: 'SF Pro Display Light',
      android: 'Roboto Light',
      default: 'System',
    }),
  },

  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },

  // Line heights
  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },

  // Font weights
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Predefined text styles
  styles: {
    // Headings
    h1: {
      fontSize: 36,
      fontWeight: '700' as const,
      lineHeight: 1.25,
      letterSpacing: -0.025,
    },
    h2: {
      fontSize: 30,
      fontWeight: '700' as const,
      lineHeight: 1.25,
      letterSpacing: -0.025,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 1.375,
      letterSpacing: -0.025,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 1.375,
    },
    h5: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 1.375,
    },
    h6: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 1.375,
    },

    // Body text
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 1.5,
    },

    // Labels and captions
    label: {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 1.375,
    },
    labelLarge: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 1.375,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 1.375,
    },

    // Button text
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 1.25,
      letterSpacing: 0.025,
    },
    buttonLarge: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 1.25,
      letterSpacing: 0.025,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 1.25,
      letterSpacing: 0.025,
    },

    // Special text styles
    overline: {
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 1.25,
      letterSpacing: 0.1,
      textTransform: 'uppercase' as const,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 1.5,
      opacity: 0.7,
    },
    link: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 1.375,
      textDecorationLine: 'underline' as const,
    },
  },
};

// Helper function to get text style
export const getTextStyle = (style: keyof typeof typography.styles) => {
  return typography.styles[style];
};

// Helper function to create custom text style
export const createTextStyle = (options: {
  size?: keyof typeof typography.sizes;
  weight?: keyof typeof typography.weights;
  lineHeight?: keyof typeof typography.lineHeights;
  letterSpacing?: keyof typeof typography.letterSpacing;
}) => {
  return {
    fontSize: options.size ? typography.sizes[options.size] : typography.sizes.base,
    fontWeight: options.weight ? typography.weights[options.weight] : typography.weights.normal,
    lineHeight: options.lineHeight ? typography.lineHeights[options.lineHeight] : typography.lineHeights.normal,
    letterSpacing: options.letterSpacing ? typography.letterSpacing[options.letterSpacing] : typography.letterSpacing.normal,
  };
};
