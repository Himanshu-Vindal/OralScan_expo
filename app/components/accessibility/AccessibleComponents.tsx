import React, { forwardRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Switch,
  TouchableOpacityProps,
  TextProps,
  ViewProps,
  TextInputProps,
  SwitchProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAccessibility, getAccessibleFontSize, getMinimumTouchTarget } from './AccessibilitySystem';
import { useTheme } from '../../context/ThemeContext';

// Accessible Button Component
interface AccessibleButtonProps extends TouchableOpacityProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  accessibilityHint?: string;
}

export const AccessibleButton = forwardRef<TouchableOpacity, AccessibleButtonProps>(
  ({ 
    title, 
    subtitle, 
    icon, 
    variant = 'primary', 
    size = 'medium', 
    loading = false,
    accessibilityHint,
    onPress,
    disabled,
    className = '',
    ...props 
  }, ref) => {
    const { settings, fontScale, screenScale } = useAccessibility();
    const { colors } = useTheme();

    const minTouchTarget = getMinimumTouchTarget(screenScale);
    const fontSize = getAccessibleFontSize(
      size === 'small' ? 14 : size === 'large' ? 18 : 16,
      fontScale
    );

    const handlePress = () => {
      if (settings.hapticFeedback && !disabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress?.();
    };

    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return 'bg-medical-600 dark:bg-medical-500';
        case 'secondary':
          return 'bg-slate-100 dark:bg-slate-800';
        case 'outline':
          return 'border-2 border-medical-600 dark:border-medical-500 bg-transparent';
        case 'ghost':
          return 'bg-transparent';
        default:
          return 'bg-medical-600 dark:bg-medical-500';
      }
    };

    const getTextColor = () => {
      switch (variant) {
        case 'primary':
          return 'text-white';
        case 'secondary':
          return 'text-slate-900 dark:text-white';
        case 'outline':
          return 'text-medical-600 dark:text-medical-400';
        case 'ghost':
          return 'text-medical-600 dark:text-medical-400';
        default:
          return 'text-white';
      }
    };

    return (
      <TouchableOpacity
        ref={ref}
        onPress={handlePress}
        disabled={disabled || loading}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={accessibilityHint || subtitle}
        accessibilityState={{ disabled: disabled || loading }}
        style={{ minHeight: minTouchTarget, minWidth: minTouchTarget }}
        className={`
          ${getVariantStyles()}
          px-6 py-3 rounded-xl flex-row items-center justify-center
          ${disabled || loading ? 'opacity-50' : 'opacity-100'}
          ${className}
        `}
        activeOpacity={0.7}
        {...props}
      >
        {icon && !loading && (
          <Ionicons 
            name={icon} 
            size={fontSize} 
            color={variant === 'primary' ? 'white' : colors.primary}
            style={{ marginRight: title ? 8 : 0 }}
          />
        )}
        
        {loading && (
          <View className="mr-2">
            <Ionicons 
              name="refresh" 
              size={fontSize} 
              color={variant === 'primary' ? 'white' : colors.primary}
            />
          </View>
        )}
        
        <View>
          <Text 
            className={`${getTextColor()} font-semibold`}
            style={{ fontSize }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              className={`${getTextColor()} opacity-80`}
              style={{ fontSize: fontSize * 0.85 }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

// Accessible Text Component
interface AccessibleTextProps extends TextProps {
  variant?: 'heading1' | 'heading2' | 'heading3' | 'body' | 'caption';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export const AccessibleText = forwardRef<Text, AccessibleTextProps>(
  ({ variant = 'body', weight = 'normal', color, children, className = '', style, ...props }, ref) => {
    const { fontScale } = useAccessibility();
    
    const getBaseSize = () => {
      switch (variant) {
        case 'heading1': return 32;
        case 'heading2': return 24;
        case 'heading3': return 20;
        case 'body': return 16;
        case 'caption': return 14;
        default: return 16;
      }
    };

    const getFontWeight = () => {
      switch (weight) {
        case 'normal': return 'font-normal';
        case 'medium': return 'font-medium';
        case 'semibold': return 'font-semibold';
        case 'bold': return 'font-bold';
        default: return 'font-normal';
      }
    };

    const getColorClass = () => {
      if (!color) return 'text-slate-900 dark:text-white';
      
      switch (color) {
        case 'primary': return 'text-medical-600 dark:text-medical-400';
        case 'secondary': return 'text-slate-600 dark:text-slate-400';
        case 'success': return 'text-green-600 dark:text-green-400';
        case 'warning': return 'text-amber-600 dark:text-amber-400';
        case 'error': return 'text-red-600 dark:text-red-400';
        default: return 'text-slate-900 dark:text-white';
      }
    };

    const fontSize = getAccessibleFontSize(getBaseSize(), fontScale);

    return (
      <Text
        ref={ref}
        accessible={true}
        accessibilityRole={variant.startsWith('heading') ? 'header' : 'text'}
        className={`${getFontWeight()} ${getColorClass()} ${className}`}
        style={[{ fontSize }, style]}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

// Accessible Input Component
interface AccessibleInputProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  required?: boolean;
}

export const AccessibleInput = forwardRef<TextInput, AccessibleInputProps>(
  ({ label, error, hint, icon, required = false, className = '', ...props }, ref) => {
    const { fontScale, screenScale } = useAccessibility();
    const { colors } = useTheme();
    
    const fontSize = getAccessibleFontSize(16, fontScale);
    const minTouchTarget = getMinimumTouchTarget(screenScale);

    const accessibilityLabel = `${label}${required ? ', required' : ''}`;
    const accessibilityHint = hint || error || undefined;

    return (
      <View className="mb-4">
        <AccessibleText variant="body" weight="medium" className="mb-2">
          {label}{required && <Text className="text-red-500"> *</Text>}
        </AccessibleText>
        
        <View className="relative">
          {icon && (
            <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              <Ionicons name={icon} size={20} color={colors.textSecondary} />
            </View>
          )}
          
          <TextInput
            ref={ref}
            accessible={true}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            accessibilityRequired={required}
            style={{ 
              fontSize,
              minHeight: minTouchTarget,
              paddingLeft: icon ? 48 : 16,
            }}
            className={`
              border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-800
              text-slate-900 dark:text-white
              rounded-xl px-4 py-3
              ${error ? 'border-red-500' : 'focus:border-medical-500'}
              ${className}
            `}
            placeholderTextColor={colors.textSecondary}
            {...props}
          />
        </View>
        
        {hint && !error && (
          <AccessibleText variant="caption" color="secondary" className="mt-1">
            {hint}
          </AccessibleText>
        )}
        
        {error && (
          <AccessibleText variant="caption" color="error" className="mt-1">
            {error}
          </AccessibleText>
        )}
      </View>
    );
  }
);

// Accessible Switch Component
interface AccessibleSwitchProps extends SwitchProps {
  label: string;
  description?: string;
}

export const AccessibleSwitch: React.FC<AccessibleSwitchProps> = ({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
  ...props
}) => {
  const { settings, screenScale } = useAccessibility();
  const { colors } = useTheme();
  
  const minTouchTarget = getMinimumTouchTarget(screenScale);

  const handleValueChange = (newValue: boolean) => {
    if (settings.hapticFeedback && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onValueChange?.(newValue);
  };

  return (
    <TouchableOpacity
      onPress={() => handleValueChange(!value)}
      disabled={disabled}
      accessible={true}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ checked: value, disabled }}
      style={{ minHeight: minTouchTarget }}
      className="flex-row items-center justify-between py-3"
      activeOpacity={0.7}
    >
      <View className="flex-1 mr-4">
        <AccessibleText variant="body" weight="medium">
          {label}
        </AccessibleText>
        {description && (
          <AccessibleText variant="caption" color="secondary" className="mt-1">
            {description}
          </AccessibleText>
        )}
      </View>
      
      <Switch
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        trackColor={{
          false: colors.border,
          true: colors.primary + '80',
        }}
        thumbColor={value ? colors.primary : colors.surface}
        {...props}
      />
    </TouchableOpacity>
  );
};

// Accessible Card Component
interface AccessibleCardProps extends ViewProps {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  pressable?: boolean;
  accessibilityHint?: string;
}

export const AccessibleCard = forwardRef<View, AccessibleCardProps>(
  ({ 
    title, 
    subtitle, 
    onPress, 
    pressable = false, 
    accessibilityHint,
    children, 
    className = '',
    ...props 
  }, ref) => {
    const { settings, screenScale } = useAccessibility();
    
    const minTouchTarget = pressable ? getMinimumTouchTarget(screenScale) : undefined;

    const handlePress = () => {
      if (settings.hapticFeedback && onPress) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress?.();
    };

    const CardContent = (
      <View
        ref={ref}
        style={{ minHeight: minTouchTarget }}
        className={`
          card-medical p-4 shadow-medical
          ${className}
        `}
        {...props}
      >
        {title && (
          <AccessibleText variant="heading3" weight="semibold" className="mb-1">
            {title}
          </AccessibleText>
        )}
        {subtitle && (
          <AccessibleText variant="body" color="secondary" className="mb-3">
            {subtitle}
          </AccessibleText>
        )}
        {children}
      </View>
    );

    if (pressable && onPress) {
      return (
        <TouchableOpacity
          onPress={handlePress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={title}
          accessibilityHint={accessibilityHint || subtitle}
          activeOpacity={0.7}
        >
          {CardContent}
        </TouchableOpacity>
      );
    }

    return CardContent;
  }
);

// Accessibility Status Indicator
export const AccessibilityStatusIndicator: React.FC = () => {
  const { settings, isAccessibilityEnabled } = useAccessibility();

  if (!isAccessibilityEnabled) return null;

  return (
    <View className="bg-medical-100 dark:bg-medical-900 p-2 rounded-lg mb-4">
      <View className="flex-row items-center">
        <Ionicons name="accessibility" size={16} color="#3b82f6" />
        <AccessibleText variant="caption" className="ml-2">
          Accessibility features active
        </AccessibleText>
      </View>
      
      <View className="flex-row flex-wrap mt-1">
        {settings.screenReaderEnabled && (
          <View className="bg-medical-200 dark:bg-medical-800 px-2 py-1 rounded mr-2 mb-1">
            <AccessibleText variant="caption">Screen Reader</AccessibleText>
          </View>
        )}
        {settings.reduceMotion && (
          <View className="bg-medical-200 dark:bg-medical-800 px-2 py-1 rounded mr-2 mb-1">
            <AccessibleText variant="caption">Reduced Motion</AccessibleText>
          </View>
        )}
        {settings.largeText && (
          <View className="bg-medical-200 dark:bg-medical-800 px-2 py-1 rounded mr-2 mb-1">
            <AccessibleText variant="caption">Large Text</AccessibleText>
          </View>
        )}
      </View>
    </View>
  );
};
