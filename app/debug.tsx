import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AppDebugger from './components/testing/AppDebugger';
import APIConnectivityTest from './components/testing/APIConnectivityTest';
import NavigationFunctionalityTest from './components/testing/NavigationFunctionalityTest';

const DebugScreen: React.FC = () => {
  const [activeTest, setActiveTest] = React.useState<'debugger' | 'api' | 'navigation'>('debugger');

  const handleBackPress = async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const switchTest = async (testType: 'debugger' | 'api' | 'navigation'): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTest(testType);
  };

  const renderActiveTest = (): React.ReactNode => {
    switch (activeTest) {
      case 'api':
        return <APIConnectivityTest />;
      case 'navigation':
        return <NavigationFunctionalityTest />;
      default:
        return <AppDebugger />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          onPress={handleBackPress}
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
          <Text className="ml-2 text-lg font-medium text-gray-900 dark:text-white">
            Back
          </Text>
        </TouchableOpacity>
        
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          Debug Center
        </Text>
        
        <View className="w-16" />
      </View>

      {/* Test Selector */}
      <View className="flex-row bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          onPress={() => switchTest('debugger')}
          className={`flex-1 py-3 px-4 ${
            activeTest === 'debugger' 
              ? 'border-b-2 border-red-600' 
              : ''
          }`}
        >
          <Text className={`text-center font-medium ${
            activeTest === 'debugger'
              ? 'text-red-600'
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            App Debugger
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => switchTest('api')}
          className={`flex-1 py-3 px-4 ${
            activeTest === 'api' 
              ? 'border-b-2 border-red-600' 
              : ''
          }`}
        >
          <Text className={`text-center font-medium ${
            activeTest === 'api'
              ? 'text-red-600'
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            API Tests
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => switchTest('navigation')}
          className={`flex-1 py-3 px-4 ${
            activeTest === 'navigation' 
              ? 'border-b-2 border-red-600' 
              : ''
          }`}
        >
          <Text className={`text-center font-medium ${
            activeTest === 'navigation'
              ? 'text-red-600'
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            Navigation Tests
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Test Component */}
      {renderActiveTest()}
    </SafeAreaView>
  );
};

export default DebugScreen;
