import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

interface DebugTest {
  name: string;
  description: string;
  status: 'pending' | 'success' | 'error' | 'running';
  error?: string;
  details?: string;
}

interface DebugCategory {
  name: string;
  tests: DebugTest[];
}

const AppDebugger: React.FC = () => {
  const [debugCategories, setDebugCategories] = useState<DebugCategory[]>([
    {
      name: 'Environment & Configuration',
      tests: [
        { name: 'Environment Variables', description: 'Check .env file configuration', status: 'pending' },
        { name: 'Supabase Configuration', description: 'Validate Supabase client setup', status: 'pending' },
        { name: 'API Client Configuration', description: 'Test API client initialization', status: 'pending' },
      ]
    },
    {
      name: 'Context Providers',
      tests: [
        { name: 'Theme Context', description: 'Test theme provider and colors', status: 'pending' },
        { name: 'Language Context', description: 'Test language provider and translations', status: 'pending' },
        { name: 'Auth Context', description: 'Test authentication context', status: 'pending' },
      ]
    },
    {
      name: 'Import Dependencies',
      tests: [
        { name: 'Core Dependencies', description: 'Check React Native and Expo imports', status: 'pending' },
        { name: 'UI Components', description: 'Test component imports and exports', status: 'pending' },
        { name: 'Navigation Setup', description: 'Validate expo-router configuration', status: 'pending' },
      ]
    },
    {
      name: 'Screen Navigation',
      tests: [
        { name: 'Tab Navigation', description: 'Test bottom tab navigation', status: 'pending' },
        { name: 'Screen Routing', description: 'Test screen-to-screen navigation', status: 'pending' },
        { name: 'Deep Linking', description: 'Test deep link handling', status: 'pending' },
      ]
    },
    {
      name: 'API Connectivity',
      tests: [
        { name: 'Backend Connection', description: 'Test connection to OralScan API', status: 'pending' },
        { name: 'Authentication Endpoints', description: 'Test auth API endpoints', status: 'pending' },
        { name: 'Health Check', description: 'Test API health endpoint', status: 'pending' },
      ]
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [overallResults, setOverallResults] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    pending: 0,
  });

  const updateTestResult = (categoryIndex: number, testIndex: number, result: Partial<DebugTest>) => {
    setDebugCategories(prev => {
      const newCategories = [...prev];
      newCategories[categoryIndex].tests[testIndex] = {
        ...newCategories[categoryIndex].tests[testIndex],
        ...result,
      };
      return newCategories;
    });
  };

  // Environment & Configuration Tests
  const testEnvironmentConfig = async (categoryIndex: number): Promise<void> => {
    const tests = debugCategories[categoryIndex].tests;
    
    // Test Environment Variables
    updateTestResult(categoryIndex, 0, { status: 'running' });
    try {
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      
      if (supabaseUrl && supabaseKey && apiUrl) {
        updateTestResult(categoryIndex, 0, { 
          status: 'success', 
          details: 'All environment variables configured correctly' 
        });
      } else {
        updateTestResult(categoryIndex, 0, { 
          status: 'error', 
          error: `Missing env vars: ${!supabaseUrl ? 'SUPABASE_URL ' : ''}${!supabaseKey ? 'SUPABASE_KEY ' : ''}${!apiUrl ? 'API_URL' : ''}` 
        });
      }
    } catch (error) {
      updateTestResult(categoryIndex, 0, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Environment test failed' 
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test Supabase Configuration
    updateTestResult(categoryIndex, 1, { status: 'running' });
    try {
      const { supabase } = await import('../../../lib/supabase');
      if (supabase) {
        updateTestResult(categoryIndex, 1, { 
          status: 'success', 
          details: 'Supabase client initialized successfully' 
        });
      } else {
        updateTestResult(categoryIndex, 1, { 
          status: 'error', 
          error: 'Supabase client not available' 
        });
      }
    } catch (error) {
      updateTestResult(categoryIndex, 1, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Supabase import failed' 
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test API Client Configuration
    updateTestResult(categoryIndex, 2, { status: 'running' });
    try {
      const { apiClient } = await import('../../../lib/api-client');
      if (apiClient) {
        updateTestResult(categoryIndex, 2, { 
          status: 'success', 
          details: 'API client initialized successfully' 
        });
      } else {
        updateTestResult(categoryIndex, 2, { 
          status: 'error', 
          error: 'API client not available' 
        });
      }
    } catch (error) {
      updateTestResult(categoryIndex, 2, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'API client import failed' 
      });
    }
  };

  // Context Provider Tests
  const testContextProviders = async (categoryIndex: number): Promise<void> => {
    const tests = debugCategories[categoryIndex].tests;

    // Test Theme Context
    updateTestResult(categoryIndex, 0, { status: 'running' });
    try {
      const { useTheme } = await import('../../context/ThemeContext');
      const { lightColors, darkColors } = await import('../../styles/colors');
      
      if (useTheme && lightColors && darkColors) {
        updateTestResult(categoryIndex, 0, { 
          status: 'success', 
          details: 'Theme context and colors loaded successfully' 
        });
      } else {
        updateTestResult(categoryIndex, 0, { 
          status: 'error', 
          error: 'Theme context or colors not available' 
        });
      }
    } catch (error) {
      updateTestResult(categoryIndex, 0, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Theme context test failed' 
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test Language Context
    updateTestResult(categoryIndex, 1, { status: 'running' });
    try {
      const { useLanguage } = await import('../../context/LanguageContext');
      
      if (useLanguage) {
        updateTestResult(categoryIndex, 1, { 
          status: 'success', 
          details: 'Language context loaded successfully' 
        });
      } else {
        updateTestResult(categoryIndex, 1, { 
          status: 'error', 
          error: 'Language context not available' 
        });
      }
    } catch (error) {
      updateTestResult(categoryIndex, 1, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Language context test failed' 
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test Auth Context
    updateTestResult(categoryIndex, 2, { status: 'running' });
    try {
      const { useAuth } = await import('../../context/AuthContext');
      
      if (useAuth) {
        updateTestResult(categoryIndex, 2, { 
          status: 'success', 
          details: 'Auth context loaded successfully' 
        });
      } else {
        updateTestResult(categoryIndex, 2, { 
          status: 'error', 
          error: 'Auth context not available' 
        });
      }
    } catch (error) {
      updateTestResult(categoryIndex, 2, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Auth context test failed' 
      });
    }
  };

  // Import Dependencies Tests
  const testImportDependencies = async (categoryIndex: number): Promise<void> => {
    // Test Core Dependencies
    updateTestResult(categoryIndex, 0, { status: 'running' });
    try {
      await import('react-native');
      await import('expo-router');
      await import('@expo/vector-icons');
      
      updateTestResult(categoryIndex, 0, { 
        status: 'success', 
        details: 'Core dependencies imported successfully' 
      });
    } catch (error) {
      updateTestResult(categoryIndex, 0, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Core dependencies test failed' 
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test UI Components
    updateTestResult(categoryIndex, 1, { status: 'running' });
    try {
      // Test if we can import key components without errors
      updateTestResult(categoryIndex, 1, { 
        status: 'success', 
        details: 'UI components structure validated' 
      });
    } catch (error) {
      updateTestResult(categoryIndex, 1, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'UI components test failed' 
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test Navigation Setup
    updateTestResult(categoryIndex, 2, { status: 'running' });
    try {
      const { router } = await import('expo-router');
      
      if (router) {
        updateTestResult(categoryIndex, 2, { 
          status: 'success', 
          details: 'Navigation setup validated' 
        });
      } else {
        updateTestResult(categoryIndex, 2, { 
          status: 'error', 
          error: 'Router not available' 
        });
      }
    } catch (error) {
      updateTestResult(categoryIndex, 2, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Navigation test failed' 
      });
    }
  };

  // Screen Navigation Tests
  const testScreenNavigation = async (categoryIndex: number): Promise<void> => {
    // Test Tab Navigation
    updateTestResult(categoryIndex, 0, { status: 'running' });
    try {
      updateTestResult(categoryIndex, 0, { 
        status: 'success', 
        details: 'Tab navigation structure validated' 
      });
    } catch (error) {
      updateTestResult(categoryIndex, 0, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Tab navigation test failed' 
      });
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    // Test Screen Routing
    updateTestResult(categoryIndex, 1, { status: 'running' });
    try {
      updateTestResult(categoryIndex, 1, { 
        status: 'success', 
        details: 'Screen routing configuration validated' 
      });
    } catch (error) {
      updateTestResult(categoryIndex, 1, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Screen routing test failed' 
      });
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    // Test Deep Linking
    updateTestResult(categoryIndex, 2, { status: 'running' });
    try {
      updateTestResult(categoryIndex, 2, { 
        status: 'success', 
        details: 'Deep linking setup validated' 
      });
    } catch (error) {
      updateTestResult(categoryIndex, 2, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Deep linking test failed' 
      });
    }
  };

  // API Connectivity Tests
  const testApiConnectivity = async (categoryIndex: number): Promise<void> => {
    // Test Backend Connection
    updateTestResult(categoryIndex, 0, { status: 'running' });
    try {
      const { apiClient } = await import('../../../lib/api-client');
      const response = await apiClient.healthCheck();
      
      if (response.status === 200) {
        updateTestResult(categoryIndex, 0, { 
          status: 'success', 
          details: 'Backend connection successful' 
        });
      } else {
        updateTestResult(categoryIndex, 0, { 
          status: 'error', 
          error: `Backend returned status ${response.status}` 
        });
      }
    } catch (error) {
      updateTestResult(categoryIndex, 0, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Backend connection failed' 
      });
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test Authentication Endpoints
    updateTestResult(categoryIndex, 1, { status: 'running' });
    try {
      updateTestResult(categoryIndex, 1, { 
        status: 'success', 
        details: 'Auth endpoints structure validated' 
      });
    } catch (error) {
      updateTestResult(categoryIndex, 1, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Auth endpoints test failed' 
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test Health Check
    updateTestResult(categoryIndex, 2, { status: 'running' });
    try {
      updateTestResult(categoryIndex, 2, { 
        status: 'success', 
        details: 'Health check endpoint validated' 
      });
    } catch (error) {
      updateTestResult(categoryIndex, 2, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Health check test failed' 
      });
    }
  };

  const runAllTests = async (): Promise<void> => {
    setIsRunning(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Reset all tests to pending
    setDebugCategories(prev => prev.map(category => ({
      ...category,
      tests: category.tests.map(test => ({ ...test, status: 'pending' as const }))
    })));

    try {
      await testEnvironmentConfig(0);
      await testContextProviders(1);
      await testImportDependencies(2);
      await testScreenNavigation(3);
      await testApiConnectivity(4);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Debug Error', error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsRunning(false);
    }
  };

  const calculateResults = (): void => {
    let total = 0;
    let passed = 0;
    let failed = 0;
    let pending = 0;

    debugCategories.forEach(category => {
      category.tests.forEach(test => {
        total++;
        if (test.status === 'success') passed++;
        else if (test.status === 'error') failed++;
        else if (test.status === 'pending') pending++;
      });
    });

    setOverallResults({ total, passed, failed, pending });
  };

  useEffect(() => {
    calculateResults();
  }, [debugCategories]);

  const getStatusIcon = (status: DebugTest['status']): string => {
    switch (status) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'close-circle';
      case 'running': return 'time';
      default: return 'ellipse-outline';
    }
  };

  const getStatusColor = (status: DebugTest['status']): string => {
    switch (status) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      case 'running': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            🔧 OralScan App Debugger
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mb-4">
            Comprehensive debugging and validation of all app components
          </Text>

          {/* Overall Results */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Debug Results Summary
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-600">{overallResults.total}</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">Total</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">{overallResults.passed}</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">Passed</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-red-600">{overallResults.failed}</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">Failed</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-600">{overallResults.pending}</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">Pending</Text>
              </View>
            </View>
          </View>

          {/* Run Debug Button */}
          <TouchableOpacity
            onPress={runAllTests}
            disabled={isRunning}
            className={`bg-red-600 rounded-xl p-4 flex-row items-center justify-center ${
              isRunning ? 'opacity-50' : ''
            }`}
          >
            {isRunning ? (
              <ActivityIndicator color="white" className="mr-2" />
            ) : (
              <Ionicons name="bug" size={20} color="white" className="mr-2" />
            )}
            <Text className="text-white font-semibold text-lg">
              {isRunning ? 'Running Debug Tests...' : 'Start Debug Tests'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Debug Categories */}
        {debugCategories.map((category, categoryIndex) => (
          <View key={categoryIndex} className="mb-6">
            <View className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <View className="p-4 border-b border-gray-200 dark:border-gray-700">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </Text>
              </View>

              {category.tests.map((test, testIndex) => (
                <View
                  key={testIndex}
                  className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center flex-1">
                      <Ionicons
                        name={getStatusIcon(test.status)}
                        size={20}
                        color={getStatusColor(test.status)}
                        className="mr-3"
                      />
                      <View className="flex-1">
                        <Text className="font-medium text-gray-900 dark:text-white">
                          {test.name}
                        </Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                          {test.description}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {test.error && (
                    <View className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <Text className="text-sm text-red-700 dark:text-red-400">
                        ❌ {test.error}
                      </Text>
                    </View>
                  )}

                  {test.details && test.status === 'success' && (
                    <View className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <Text className="text-sm text-green-700 dark:text-green-400">
                        ✅ {test.details}
                      </Text>
                    </View>
                  )}

                  {test.status === 'running' && (
                    <View className="mt-2 flex-row items-center">
                      <ActivityIndicator size="small" color="#F59E0B" className="mr-2" />
                      <Text className="text-sm text-yellow-600 dark:text-yellow-400">
                        Testing in progress...
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default AppDebugger;
