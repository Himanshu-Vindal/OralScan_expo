import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Animatable from 'react-native-animatable';

interface NetworkStatusProps {
  onRetry?: () => void;
  className?: string;
  isOffline?: boolean;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ 
  onRetry, 
  className = '',
  isOffline = false 
}) => {
  const [showOffline, setShowOffline] = useState(isOffline);

  useEffect(() => {
    setShowOffline(isOffline);
  }, [isOffline]);

  const handleRetry = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRetry?.();
  };

  if (!showOffline) {
    return null;
  }

  return (
    <Animatable.View 
      animation="slideInDown" 
      duration={300}
      className={`absolute top-0 left-0 right-0 z-50 ${className}`}
    >
      <LinearGradient
        colors={['#ef4444', '#dc2626']}
        className="px-4 py-3"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Ionicons name="wifi-outline" size={20} color="white" />
            <Text className="text-white text-sm font-medium ml-2">
              No internet connection
            </Text>
          </View>
          
          {onRetry && (
            <TouchableOpacity
              onPress={handleRetry}
              className="bg-white/20 px-3 py-1 rounded-full"
            >
              <Text className="text-white text-xs font-semibold">
                Retry
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </Animatable.View>
  );
};

// Simple network check utility using fetch
export const checkNetworkConnection = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

export default NetworkStatus;
