import React, { useState, useCallback } from 'react';
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
import { apiClient, ApiResponse } from '../../../lib/api-client';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'pending' | 'success' | 'error' | 'running';
  responseTime?: number;
  statusCode?: number;
  error?: string;
  data?: any;
}

interface TestSuite {
  name: string;
  description: string;
  tests: TestResult[];
}

const APIConnectivityTest: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      name: 'Core API Endpoints',
      description: 'Essential API functionality tests',
      tests: [
        { endpoint: '/api/health', method: 'GET', status: 'pending' },
        { endpoint: '/api/validate-image', method: 'POST', status: 'pending' },
        { endpoint: '/api/gemini-analysis', method: 'POST', status: 'pending' },
        { endpoint: '/api/search-products', method: 'POST', status: 'pending' },
      ]
    },
    {
      name: 'Authentication Endpoints',
      description: 'User authentication and session management',
      tests: [
        { endpoint: '/api/auth/signin', method: 'POST', status: 'pending' },
        { endpoint: '/api/auth/signup', method: 'POST', status: 'pending' },
        { endpoint: '/api/auth/reset-password', method: 'POST', status: 'pending' },
      ]
    },
    {
      name: 'User Management',
      description: 'User profile and data endpoints',
      tests: [
        { endpoint: '/api/user/profile', method: 'GET', status: 'pending' },
        { endpoint: '/api/user/{userId}/scans', method: 'GET', status: 'pending' },
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

  const updateTestResult = useCallback((suiteIndex: number, testIndex: number, result: Partial<TestResult>) => {
    setTestSuites(prev => {
      const newSuites = [...prev];
      newSuites[suiteIndex].tests[testIndex] = {
        ...newSuites[suiteIndex].tests[testIndex],
        ...result,
      };
      return newSuites;
    });
  }, []);

  const runHealthCheck = async (suiteIndex: number, testIndex: number): Promise<void> => {
    const startTime = Date.now();
    updateTestResult(suiteIndex, testIndex, { status: 'running' });

    try {
      const response = await apiClient.healthCheck();
      const responseTime = Date.now() - startTime;

      if (response.status === 200 && response.data) {
        updateTestResult(suiteIndex, testIndex, {
          status: 'success',
          responseTime,
          statusCode: response.status,
          data: response.data,
        });
      } else {
        updateTestResult(suiteIndex, testIndex, {
          status: 'error',
          responseTime,
          statusCode: response.status,
          error: response.error || 'Health check failed',
        });
      }
    } catch (error) {
      updateTestResult(suiteIndex, testIndex, {
        status: 'error',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const runImageValidation = async (suiteIndex: number, testIndex: number): Promise<void> => {
    const startTime = Date.now();
    updateTestResult(suiteIndex, testIndex, { status: 'running' });

    // Create a simple test image (1x1 pixel base64 PNG)
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    try {
      const response = await apiClient.validateImage(testImageBase64);
      const responseTime = Date.now() - startTime;

      updateTestResult(suiteIndex, testIndex, {
        status: response.error ? 'error' : 'success',
        responseTime,
        statusCode: response.status,
        error: response.error,
        data: response.data,
      });
    } catch (error) {
      updateTestResult(suiteIndex, testIndex, {
        status: 'error',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const runOralHealthAnalysis = async (suiteIndex: number, testIndex: number): Promise<void> => {
    const startTime = Date.now();
    updateTestResult(suiteIndex, testIndex, { status: 'running' });

    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    try {
      const response = await apiClient.analyzeOralHealth(
        testImageBase64,
        'India',
        'en',
        'test-user-id',
        { testMode: true }
      );
      const responseTime = Date.now() - startTime;

      updateTestResult(suiteIndex, testIndex, {
        status: response.error ? 'error' : 'success',
        responseTime,
        statusCode: response.status,
        error: response.error,
        data: response.data,
      });
    } catch (error) {
      updateTestResult(suiteIndex, testIndex, {
        status: 'error',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const runProductSearch = async (suiteIndex: number, testIndex: number): Promise<void> => {
    const startTime = Date.now();
    updateTestResult(suiteIndex, testIndex, { status: 'running' });

    try {
      const response = await apiClient.searchProducts('toothbrush', 'India', 5);
      const responseTime = Date.now() - startTime;

      updateTestResult(suiteIndex, testIndex, {
        status: response.error ? 'error' : 'success',
        responseTime,
        statusCode: response.status,
        error: response.error,
        data: response.data,
      });
    } catch (error) {
      updateTestResult(suiteIndex, testIndex, {
        status: 'error',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const runAuthTest = async (suiteIndex: number, testIndex: number, endpoint: string): Promise<void> => {
    const startTime = Date.now();
    updateTestResult(suiteIndex, testIndex, { status: 'running' });

    try {
      let response: ApiResponse<any>;
      
      if (endpoint.includes('signin')) {
        response = await apiClient.signIn('test@example.com', 'testpassword');
      } else if (endpoint.includes('signup')) {
        response = await apiClient.signUp('test@example.com', 'testpassword', 'Test User');
      } else if (endpoint.includes('reset-password')) {
        response = await apiClient.resetPassword('test@example.com');
      } else {
        throw new Error('Unknown auth endpoint');
      }

      const responseTime = Date.now() - startTime;

      updateTestResult(suiteIndex, testIndex, {
        status: response.status < 500 ? 'success' : 'error', // Accept 4xx as success for auth tests
        responseTime,
        statusCode: response.status,
        error: response.error,
        data: response.data,
      });
    } catch (error) {
      updateTestResult(suiteIndex, testIndex, {
        status: 'error',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const runUserTest = async (suiteIndex: number, testIndex: number, endpoint: string): Promise<void> => {
    const startTime = Date.now();
    updateTestResult(suiteIndex, testIndex, { status: 'running' });

    try {
      let response: ApiResponse<any>;
      
      if (endpoint.includes('profile')) {
        response = await apiClient.getUserProfile();
      } else if (endpoint.includes('scans')) {
        response = await apiClient.getUserScans('test-user-id');
      } else {
        throw new Error('Unknown user endpoint');
      }

      const responseTime = Date.now() - startTime;

      updateTestResult(suiteIndex, testIndex, {
        status: response.status < 500 ? 'success' : 'error', // Accept 4xx as success for user tests
        responseTime,
        statusCode: response.status,
        error: response.error,
        data: response.data,
      });
    } catch (error) {
      updateTestResult(suiteIndex, testIndex, {
        status: 'error',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const runSingleTest = async (suiteIndex: number, testIndex: number): Promise<void> => {
    const test = testSuites[suiteIndex].tests[testIndex];
    
    try {
      if (test.endpoint === '/api/health') {
        await runHealthCheck(suiteIndex, testIndex);
      } else if (test.endpoint === '/api/validate-image') {
        await runImageValidation(suiteIndex, testIndex);
      } else if (test.endpoint === '/api/gemini-analysis') {
        await runOralHealthAnalysis(suiteIndex, testIndex);
      } else if (test.endpoint === '/api/search-products') {
        await runProductSearch(suiteIndex, testIndex);
      } else if (test.endpoint.startsWith('/api/auth/')) {
        await runAuthTest(suiteIndex, testIndex, test.endpoint);
      } else if (test.endpoint.startsWith('/api/user/')) {
        await runUserTest(suiteIndex, testIndex, test.endpoint);
      }
    } catch (error) {
      updateTestResult(suiteIndex, testIndex, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const runAllTests = async (): Promise<void> => {
    setIsRunning(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Reset all tests to pending
    setTestSuites(prev => prev.map(suite => ({
      ...suite,
      tests: suite.tests.map(test => ({ ...test, status: 'pending' as const }))
    })));

    try {
      for (let suiteIndex = 0; suiteIndex < testSuites.length; suiteIndex++) {
        const suite = testSuites[suiteIndex];
        for (let testIndex = 0; testIndex < suite.tests.length; testIndex++) {
          await runSingleTest(suiteIndex, testIndex);
          // Small delay between tests
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Test Error', error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsRunning(false);
    }
  };

  const calculateResults = (): void => {
    let total = 0;
    let passed = 0;
    let failed = 0;
    let pending = 0;

    testSuites.forEach(suite => {
      suite.tests.forEach(test => {
        total++;
        if (test.status === 'success') passed++;
        else if (test.status === 'error') failed++;
        else if (test.status === 'pending') pending++;
      });
    });

    setOverallResults({ total, passed, failed, pending });
  };

  React.useEffect(() => {
    calculateResults();
  }, [testSuites]);

  const getStatusIcon = (status: TestResult['status']): string => {
    switch (status) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'close-circle';
      case 'running': return 'time';
      default: return 'ellipse-outline';
    }
  };

  const getStatusColor = (status: TestResult['status']): string => {
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
            API Connectivity Test
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mb-4">
            Validate backend API endpoints and connectivity
          </Text>

          {/* Overall Results */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Test Results Summary
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

          {/* Run Tests Button */}
          <TouchableOpacity
            onPress={runAllTests}
            disabled={isRunning}
            className={`bg-blue-600 rounded-xl p-4 flex-row items-center justify-center ${
              isRunning ? 'opacity-50' : ''
            }`}
          >
            {isRunning ? (
              <ActivityIndicator color="white" className="mr-2" />
            ) : (
              <Ionicons name="play" size={20} color="white" className="mr-2" />
            )}
            <Text className="text-white font-semibold text-lg">
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Test Suites */}
        {testSuites.map((suite, suiteIndex) => (
          <View key={suiteIndex} className="mb-6">
            <View className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <View className="p-4 border-b border-gray-200 dark:border-gray-700">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                  {suite.name}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {suite.description}
                </Text>
              </View>

              {suite.tests.map((test, testIndex) => (
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
                          {test.method} {test.endpoint}
                        </Text>
                        {test.responseTime && (
                          <Text className="text-sm text-gray-600 dark:text-gray-400">
                            Response time: {test.responseTime}ms
                          </Text>
                        )}
                      </View>
                    </View>
                    {test.statusCode && (
                      <View className={`px-2 py-1 rounded ${
                        test.statusCode < 300 ? 'bg-green-100' :
                        test.statusCode < 400 ? 'bg-yellow-100' :
                        test.statusCode < 500 ? 'bg-orange-100' : 'bg-red-100'
                      }`}>
                        <Text className={`text-xs font-medium ${
                          test.statusCode < 300 ? 'text-green-800' :
                          test.statusCode < 400 ? 'text-yellow-800' :
                          test.statusCode < 500 ? 'text-orange-800' : 'text-red-800'
                        }`}>
                          {test.statusCode}
                        </Text>
                      </View>
                    )}
                  </View>

                  {test.error && (
                    <View className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <Text className="text-sm text-red-700 dark:text-red-400">
                        Error: {test.error}
                      </Text>
                    </View>
                  )}

                  {test.status === 'success' && test.data && (
                    <View className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <Text className="text-sm text-green-700 dark:text-green-400">
                        ✓ Response received successfully
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

export default APIConnectivityTest;
