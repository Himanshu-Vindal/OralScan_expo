import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class SafeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to crash reporting service in production
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: '#F8FAFC',
        }}>
          <View style={{
            backgroundColor: '#FEF2F2',
            borderRadius: 16,
            padding: 24,
            alignItems: 'center',
            maxWidth: 300,
          }}>
            <Ionicons name="warning" size={48} color="#EF4444" />
            
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#1F2937',
              marginTop: 16,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Something went wrong
            </Text>
            
            <Text style={{
              fontSize: 14,
              color: '#6B7280',
              textAlign: 'center',
              marginBottom: 20,
              lineHeight: 20,
            }}>
              We're sorry for the inconvenience. Please try again.
            </Text>

            {__DEV__ && this.state.error && (
              <Text style={{
                fontSize: 12,
                color: '#EF4444',
                textAlign: 'center',
                marginBottom: 20,
                fontFamily: 'monospace',
              }}>
                {this.state.error.message}
              </Text>
            )}
            
            <TouchableOpacity
              onPress={this.handleRetry}
              style={{
                backgroundColor: '#3B82F6',
                borderRadius: 12,
                paddingHorizontal: 24,
                paddingVertical: 12,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="refresh" size={18} color="#FFFFFF" />
              <Text style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: '600',
                marginLeft: 8,
              }}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
