import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { apiClient } from '../../lib/api-client';
import AnimatedButton from './AnimatedButton';
import AnimatedCard from './AnimatedCard';
import { useAuth } from '../context/AuthContext';

interface TestResult {
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  duration?: number;
}

export default function APITestScreen() {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTestResult = (endpoint: string, status: 'success' | 'error', message: string, duration?: number) => {
    setTestResults(prev => {
      const existing = prev.find(r => r.endpoint === endpoint);
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.duration = duration;
        return [...prev];
      }
      return [...prev, { endpoint, status, message, duration }];
    });
  };

  const testImageValidation = async () => {
    const startTime = Date.now();
    try {
      // Create a simple test base64 image (1x1 pixel)
      const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      
      const response = await apiClient.validateImage(testImage);
      const duration = Date.now() - startTime;
      
      if (response.error) {
        updateTestResult('Image Validation', 'error', response.error, duration);
      } else {
        updateTestResult('Image Validation', 'success', 'Image validation successful', duration);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      updateTestResult('Image Validation', 'error', `Network error: ${error}`, duration);
    }
  };

  const testOralHealthAnalysis = async () => {
    const startTime = Date.now();
    try {
      // Create a simple test base64 image
      const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      
      const response = await apiClient.analyzeOralHealth(testImage, 'en');
      const duration = Date.now() - startTime;
      
      if (response.error) {
        updateTestResult('Oral Health Analysis', 'error', response.error, duration);
      } else {
        updateTestResult('Oral Health Analysis', 'success', 'AI analysis completed successfully', duration);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      updateTestResult('Oral Health Analysis', 'error', `Network error: ${error}`, duration);
    }
  };

  const testProductSearch = async () => {
    const startTime = Date.now();
    try {
      const response = await apiClient.searchProducts('toothbrush', 'en');
      const duration = Date.now() - startTime;
      
      if (response.error) {
        updateTestResult('Product Search', 'error', response.error, duration);
      } else {
        updateTestResult('Product Search', 'success', `Found ${response.data?.length || 0} products`, duration);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      updateTestResult('Product Search', 'error', `Network error: ${error}`, duration);
    }
  };

  const testAuthentication = async () => {
    const startTime = Date.now();
    try {
      // Test with dummy credentials to check endpoint availability
      const response = await apiClient.signIn('test@example.com', 'testpassword');
      const duration = Date.now() - startTime;
      
      // We expect this to fail with invalid credentials, but endpoint should be reachable
      if (response.error && response.error.includes('Invalid')) {
        updateTestResult('Authentication', 'success', 'Auth endpoint reachable (invalid credentials expected)', duration);
      } else if (response.error) {
        updateTestResult('Authentication', 'error', response.error, duration);
      } else {
        updateTestResult('Authentication', 'success', 'Auth endpoint working', duration);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      updateTestResult('Authentication', 'error', `Network error: ${error}`, duration);
    }
  };

  const testUserProfile = async () => {
    if (!user) {
      updateTestResult('User Profile', 'error', 'No authenticated user', 0);
      return;
    }

    const startTime = Date.now();
    try {
      const response = await apiClient.getUserProfile();
      const duration = Date.now() - startTime;
      
      if (response.error) {
        updateTestResult('User Profile', 'error', response.error, duration);
      } else {
        updateTestResult('User Profile', 'success', 'Profile data retrieved successfully', duration);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      updateTestResult('User Profile', 'error', `Network error: ${error}`, duration);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Initialize all tests as pending
    const endpoints = [
      'Image Validation',
      'Oral Health Analysis', 
      'Product Search',
      'Authentication',
      'User Profile'
    ];

    setTestResults(endpoints.map(endpoint => ({
      endpoint,
      status: 'pending',
      message: 'Running test...'
    })));

    // Run tests sequentially to avoid overwhelming the server
    await testImageValidation();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testOralHealthAnalysis();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testProductSearch();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testAuthentication();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testUserProfile();

    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '⚪';
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#1F2937',
          marginBottom: 8,
        }}>
          API Integration Tests
        </Text>
        
        <Text style={{
          fontSize: 16,
          color: '#6B7280',
          marginBottom: 24,
        }}>
          Test all backend API endpoints to ensure proper connectivity
        </Text>

        <AnimatedButton
          title={isRunning ? "Running Tests..." : "Run All Tests"}
          onPress={runAllTests}
          disabled={isRunning}
          loading={isRunning}
          icon="play"
          gradient
          style={{ marginBottom: 24 }}
        />

        {testResults.map((result, index) => (
          <AnimatedCard
            key={result.endpoint}
            style={{ marginBottom: 12 }}
            animationType="lift"
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View style={{ flex: 1 }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 4,
                }}>
                  <Text style={{ fontSize: 18, marginRight: 8 }}>
                    {getStatusIcon(result.status)}
                  </Text>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#1F2937',
                  }}>
                    {result.endpoint}
                  </Text>
                </View>
                
                <Text style={{
                  fontSize: 14,
                  color: getStatusColor(result.status),
                  marginBottom: result.duration ? 4 : 0,
                }}>
                  {result.message}
                </Text>
                
                {result.duration && (
                  <Text style={{
                    fontSize: 12,
                    color: '#6B7280',
                  }}>
                    Response time: {result.duration}ms
                  </Text>
                )}
              </View>
            </View>
          </AnimatedCard>
        ))}

        {testResults.length > 0 && (
          <AnimatedCard
            style={{ 
              marginTop: 16,
              backgroundColor: '#F0F9FF',
              borderColor: '#3B82F6',
              borderWidth: 1,
            }}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: 8,
            }}>
              Test Summary
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#10B981' }}>
                ✅ Passed: {testResults.filter(r => r.status === 'success').length}
              </Text>
              <Text style={{ color: '#EF4444' }}>
                ❌ Failed: {testResults.filter(r => r.status === 'error').length}
              </Text>
              <Text style={{ color: '#F59E0B' }}>
                ⏳ Pending: {testResults.filter(r => r.status === 'pending').length}
              </Text>
            </View>
          </AnimatedCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
