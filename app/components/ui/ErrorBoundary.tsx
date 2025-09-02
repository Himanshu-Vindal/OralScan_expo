import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  retry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return <DefaultErrorFallback error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; retry: () => void }> = ({ error, retry }) => {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
      <LinearGradient
        colors={['#ef4444', '#dc2626']}
        className="w-20 h-20 rounded-full items-center justify-center mb-6"
      >
        <Ionicons name="alert-circle" size={40} color="white" />
      </LinearGradient>
      
      <Text className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-3">
        Oops! Something went wrong
      </Text>
      
      <Text className="text-base text-slate-600 dark:text-slate-400 text-center leading-6 mb-8 max-w-sm">
        We encountered an unexpected error. Don't worry, this has been logged and we're working on it.
      </Text>
      
      {__DEV__ && error && (
        <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 max-w-sm">
          <Text className="text-sm font-mono text-red-800 dark:text-red-200">
            {error.message}
          </Text>
        </View>
      )}
      
      <TouchableOpacity
        onPress={retry}
        className="bg-primary-500 px-8 py-4 rounded-xl shadow-lg active:bg-primary-600"
      >
        <View className="flex-row items-center">
          <Ionicons name="refresh" size={20} color="white" className="mr-2" />
          <Text className="text-white text-base font-semibold ml-2">
            Try Again
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorBoundary;
