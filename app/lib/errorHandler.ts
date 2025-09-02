import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface ErrorDetails {
  message: string;
  code?: string;
  context?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class AppError extends Error {
  public code?: string;
  public context?: string;
  public severity: 'low' | 'medium' | 'high' | 'critical';

  constructor(details: ErrorDetails) {
    super(details.message);
    this.name = 'AppError';
    this.code = details.code;
    this.context = details.context;
    this.severity = details.severity;
  }
}

export const errorHandler = {
  // Log error with context
  log: (error: Error | AppError, context?: string) => {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context: context || (error instanceof AppError ? error.context : undefined),
      timestamp: new Date().toISOString(),
    };
    
    console.error('Error logged:', errorInfo);
    
    // In production, send to crash reporting service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with crash reporting service (Sentry, Bugsnag, etc.)
    }
  },

  // Handle API errors
  handleApiError: (error: any, context?: string): AppError => {
    let message = 'An unexpected error occurred';
    let code = 'UNKNOWN_ERROR';
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';

    if (error?.response) {
      // HTTP error response
      const status = error.response.status;
      message = error.response.data?.message || error.response.statusText || message;
      
      if (status >= 400 && status < 500) {
        severity = 'medium';
        code = `HTTP_${status}`;
      } else if (status >= 500) {
        severity = 'high';
        code = `SERVER_ERROR_${status}`;
      }
    } else if (error?.code === 'NETWORK_ERROR' || !navigator.onLine) {
      message = 'Network connection error. Please check your internet connection.';
      code = 'NETWORK_ERROR';
      severity = 'medium';
    } else if (error?.message) {
      message = error.message;
    }

    const appError = new AppError({
      message,
      code,
      context,
      severity,
    });

    errorHandler.log(appError);
    return appError;
  },

  // Handle authentication errors
  handleAuthError: (error: any): AppError => {
    let message = 'Authentication failed';
    let code = 'AUTH_ERROR';

    if (error?.message?.includes('Invalid login credentials')) {
      message = 'Invalid email or password';
      code = 'INVALID_CREDENTIALS';
    } else if (error?.message?.includes('Email not confirmed')) {
      message = 'Please check your email and click the confirmation link';
      code = 'EMAIL_NOT_CONFIRMED';
    } else if (error?.message?.includes('User already registered')) {
      message = 'An account with this email already exists';
      code = 'USER_EXISTS';
    } else if (error?.message?.includes('Password should be')) {
      message = 'Password must be at least 6 characters long';
      code = 'WEAK_PASSWORD';
    }

    const appError = new AppError({
      message,
      code,
      context: 'Authentication',
      severity: 'medium',
    });

    errorHandler.log(appError);
    return appError;
  },

  // Show user-friendly error message
  showError: (error: Error | AppError, options?: { 
    title?: string; 
    showRetry?: boolean; 
    onRetry?: () => void;
    haptic?: boolean;
  }) => {
    const { title = 'Error', showRetry = false, onRetry, haptic = true } = options || {};
    
    if (haptic) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    const message = error instanceof AppError ? error.message : error.message;
    
    if (showRetry && onRetry) {
      Alert.alert(
        title,
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: onRetry },
        ]
      );
    } else {
      Alert.alert(title, message);
    }
  },

  // Handle camera/media errors
  handleMediaError: (error: any): AppError => {
    let message = 'Camera access failed';
    let code = 'MEDIA_ERROR';

    if (error?.message?.includes('permission')) {
      message = 'Camera permission is required to take photos';
      code = 'CAMERA_PERMISSION_DENIED';
    } else if (error?.message?.includes('not available')) {
      message = 'Camera is not available on this device';
      code = 'CAMERA_NOT_AVAILABLE';
    }

    const appError = new AppError({
      message,
      code,
      context: 'Media',
      severity: 'medium',
    });

    errorHandler.log(appError);
    return appError;
  },

  // Handle file system errors
  handleFileError: (error: any): AppError => {
    let message = 'File operation failed';
    let code = 'FILE_ERROR';

    if (error?.message?.includes('permission')) {
      message = 'File access permission denied';
      code = 'FILE_PERMISSION_DENIED';
    } else if (error?.message?.includes('not found')) {
      message = 'File not found';
      code = 'FILE_NOT_FOUND';
    } else if (error?.message?.includes('storage')) {
      message = 'Insufficient storage space';
      code = 'INSUFFICIENT_STORAGE';
    }

    const appError = new AppError({
      message,
      code,
      context: 'FileSystem',
      severity: 'medium',
    });

    errorHandler.log(appError);
    return appError;
  },

  // Validate environment variables
  validateEnvironment: () => {
    const requiredVars = [
      'EXPO_PUBLIC_SUPABASE_URL',
      'EXPO_PUBLIC_SUPABASE_ANON_KEY'
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      const error = new AppError({
        message: `Missing required environment variables: ${missing.join(', ')}`,
        code: 'MISSING_ENV_VARS',
        context: 'Configuration',
        severity: 'critical',
      });
      
      errorHandler.log(error);
      throw error;
    }
  },
};

export default errorHandler;
