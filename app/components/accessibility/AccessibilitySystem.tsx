import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AccessibilityInfo, 
  Platform, 
  Dimensions,
  PixelRatio,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReaderEnabled: boolean;
  hapticFeedback: boolean;
  voiceOver: boolean;
  talkBack: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void;
  isAccessibilityEnabled: boolean;
  fontScale: number;
  screenScale: number;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const ACCESSIBILITY_STORAGE_KEY = '@oralscan_accessibility_settings';

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    screenReaderEnabled: false,
    hapticFeedback: true,
    voiceOver: false,
    talkBack: false,
  });

  const [fontScale, setFontScale] = useState(1);
  const [screenScale, setScreenScale] = useState(1);
  const [isAccessibilityEnabled, setIsAccessibilityEnabled] = useState(false);

  useEffect(() => {
    loadAccessibilitySettings();
    detectSystemAccessibilityFeatures();
    
    // Listen for system accessibility changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (reduceMotionEnabled) => {
        updateSetting('reduceMotion', reduceMotionEnabled);
      }
    );

    const screenReaderSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (screenReaderEnabled) => {
        updateSetting('screenReaderEnabled', screenReaderEnabled);
        setIsAccessibilityEnabled(screenReaderEnabled);
      }
    );

    return () => {
      subscription?.remove();
      screenReaderSubscription?.remove();
    };
  }, []);

  const loadAccessibilitySettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings(prevSettings => ({ ...prevSettings, ...parsedSettings }));
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    }
  };

  const detectSystemAccessibilityFeatures = async () => {
    try {
      // Detect system accessibility features
      const reduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      const screenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      
      // Get font and screen scaling
      const { fontScale: systemFontScale } = Dimensions.get('window');
      const pixelRatio = PixelRatio.get();
      
      setFontScale(systemFontScale);
      setScreenScale(pixelRatio);
      setIsAccessibilityEnabled(screenReaderEnabled);

      // Update settings based on system preferences
      setSettings(prev => ({
        ...prev,
        reduceMotion: reduceMotionEnabled,
        screenReaderEnabled,
        largeText: systemFontScale > 1.2,
        voiceOver: Platform.OS === 'ios' && screenReaderEnabled,
        talkBack: Platform.OS === 'android' && screenReaderEnabled,
      }));
    } catch (error) {
      console.warn('Failed to detect system accessibility features:', error);
    }
  };

  const updateSetting = async (key: keyof AccessibilitySettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      await AsyncStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }
  };

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    isAccessibilityEnabled,
    fontScale,
    screenScale,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

// Accessibility Helper Functions
export const getAccessibleFontSize = (baseSize: number, fontScale: number, maxScale: number = 1.5) => {
  return Math.min(baseSize * fontScale, baseSize * maxScale);
};

export const getMinimumTouchTarget = (screenScale: number) => {
  // WCAG 2.1 AA requires minimum 44dp touch targets
  return Math.max(44, 44 * screenScale);
};

export const getContrastRatio = (foreground: string, background: string): number => {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd use a proper color contrast library
  const getLuminance = (color: string) => {
    // This is a simplified version - use a proper color library in production
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

export const validateWCAGCompliance = (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA') => {
  const ratio = getContrastRatio(foreground, background);
  const requiredRatio = level === 'AAA' ? 7 : 4.5;
  
  return {
    isCompliant: ratio >= requiredRatio,
    ratio,
    requiredRatio,
    level,
  };
};

// Accessibility-aware animation configuration
export const getAnimationConfig = (reduceMotion: boolean) => {
  if (reduceMotion) {
    return {
      duration: 0,
      useNativeDriver: true,
    };
  }
  
  return {
    duration: 300,
    useNativeDriver: true,
  };
};

// Screen reader announcements
export const announceForScreenReader = (message: string) => {
  if (Platform.OS === 'ios') {
    AccessibilityInfo.announceForAccessibility(message);
  } else if (Platform.OS === 'android') {
    AccessibilityInfo.announceForAccessibility(message);
  }
};

// Focus management
export const setAccessibilityFocus = (ref: React.RefObject<any>) => {
  if (ref.current && AccessibilityInfo.setAccessibilityFocus) {
    AccessibilityInfo.setAccessibilityFocus(ref.current);
  }
};

export default AccessibilityProvider;
