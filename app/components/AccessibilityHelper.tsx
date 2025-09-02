import React from 'react';
import {
  View,
  Text,
  ViewStyle,
  TextStyle,
  AccessibilityInfo,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';

// Accessibility utilities
export const AccessibilityUtils = {
  // Announce text to screen readers
  announceForAccessibility: (message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  },

  // Check if screen reader is enabled
  isScreenReaderEnabled: async (): Promise<boolean> => {
    return await AccessibilityInfo.isScreenReaderEnabled();
  },

  // Provide haptic feedback based on context
  provideFeedback: (type: 'success' | 'error' | 'warning' | 'selection') => {
    switch (type) {
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'selection':
        Haptics.selectionAsync();
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },

  // Get accessible color contrast
  getAccessibleColors: () => ({
    primary: '#1D4ED8', // High contrast blue
    secondary: '#059669', // High contrast green
    error: '#DC2626', // High contrast red
    warning: '#D97706', // High contrast orange
    text: '#111827', // High contrast dark text
    textSecondary: '#4B5563', // Medium contrast gray
    background: '#FFFFFF',
    surface: '#F9FAFB',
  }),
};

// Screen reader friendly text component
interface AccessibleTextProps {
  children: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: TextStyle;
  heading?: boolean;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function AccessibleText({
  children,
  accessibilityLabel,
  accessibilityHint,
  style,
  heading = false,
  level = 1,
}: AccessibleTextProps) {
  const getHeadingStyle = (): TextStyle => {
    if (!heading) return {};
    
    switch (level) {
      case 1: return { fontSize: 28, fontWeight: 'bold' };
      case 2: return { fontSize: 24, fontWeight: 'bold' };
      case 3: return { fontSize: 20, fontWeight: '600' };
      case 4: return { fontSize: 18, fontWeight: '600' };
      case 5: return { fontSize: 16, fontWeight: '600' };
      case 6: return { fontSize: 14, fontWeight: '600' };
      default: return { fontSize: 16, fontWeight: '600' };
    }
  };

  return (
    <Text
      accessible={true}
      accessibilityRole={heading ? 'header' : 'text'}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={[
        {
          color: AccessibilityUtils.getAccessibleColors().text,
          fontSize: 16,
          lineHeight: 24,
        },
        getHeadingStyle(),
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// Focus management component
interface FocusableViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  focusable?: boolean;
  autoFocus?: boolean;
}

export function FocusableView({
  children,
  style,
  accessibilityLabel,
  accessibilityHint,
  focusable = true,
  autoFocus = false,
}: FocusableViewProps) {
  const viewRef = React.useRef<View>(null);

  React.useEffect(() => {
    if (autoFocus && viewRef.current) {
      // Focus the view after a short delay
      setTimeout(() => {
        AccessibilityInfo.setAccessibilityFocus(viewRef.current!);
      }, 100);
    }
  }, [autoFocus]);

  return (
    <View
      ref={viewRef}
      accessible={focusable}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={style}
    >
      {children}
    </View>
  );
}

// Loading announcement component
interface LoadingAnnouncementProps {
  isLoading: boolean;
  loadingText?: string;
  completedText?: string;
}

export function LoadingAnnouncement({
  isLoading,
  loadingText = 'Loading',
  completedText = 'Loading completed',
}: LoadingAnnouncementProps) {
  const previousLoadingState = React.useRef(isLoading);

  React.useEffect(() => {
    if (isLoading && !previousLoadingState.current) {
      // Started loading
      AccessibilityUtils.announceForAccessibility(loadingText);
    } else if (!isLoading && previousLoadingState.current) {
      // Finished loading
      AccessibilityUtils.announceForAccessibility(completedText);
    }
    previousLoadingState.current = isLoading;
  }, [isLoading, loadingText, completedText]);

  return null; // This component doesn't render anything
}

// Error announcement component
interface ErrorAnnouncementProps {
  error: string | null;
  prefix?: string;
}

export function ErrorAnnouncement({
  error,
  prefix = 'Error: ',
}: ErrorAnnouncementProps) {
  React.useEffect(() => {
    if (error) {
      AccessibilityUtils.announceForAccessibility(`${prefix}${error}`);
      AccessibilityUtils.provideFeedback('error');
    }
  }, [error, prefix]);

  return null;
}

// Success announcement component
interface SuccessAnnouncementProps {
  success: string | null;
  prefix?: string;
}

export function SuccessAnnouncement({
  success,
  prefix = 'Success: ',
}: SuccessAnnouncementProps) {
  React.useEffect(() => {
    if (success) {
      AccessibilityUtils.announceForAccessibility(`${prefix}${success}`);
      AccessibilityUtils.provideFeedback('success');
    }
  }, [success, prefix]);

  return null;
}
