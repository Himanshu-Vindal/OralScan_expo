import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';
import * as Haptics from 'expo-haptics';

type AuthMode = 'signin' | 'signup' | 'reset';

const AuthScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { signIn, signUp, resetPassword } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleAuth = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (mode === 'reset') {
      await handlePasswordReset();
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        Alert.alert('Error', 'Please enter your full name');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        router.replace('/(tabs)');
      } else if (mode === 'signup') {
        await signUp(email, password, fullName);
        Alert.alert(
          'Success',
          'Account created successfully! Please check your email to verify your account.',
          [{ text: 'OK', onPress: () => setMode('signin') }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Password Reset',
        'Password reset instructions have been sent to your email.',
        [{ text: 'OK', onPress: () => setMode('signin') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const getTitle = () => {
    switch (mode) {
      case 'signin': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'reset': return 'Reset Password';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signin': return 'Sign in to continue your oral health journey';
      case 'signup': return 'Join thousands tracking their oral health';
      case 'reset': return 'Enter your email to reset your password';
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case 'signin': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'reset': return 'Send Reset Email';
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          className="pt-15 pb-10 px-5"
        >
          <TouchableOpacity
            className="w-10 h-10 rounded-full justify-center items-center mb-8"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <Animatable.View animation="fadeInUp" delay={200}>
            <Text className="text-3xl font-bold text-white mb-2">
              {getTitle()}
            </Text>
            <Text className="text-base text-white opacity-90">
              {getSubtitle()}
            </Text>
          </Animatable.View>
        </LinearGradient>

        {/* Form */}
        <View className="flex-1 px-5 pt-8">
          <Animatable.View animation="fadeInUp" delay={400}>
            {/* Full Name Input (Sign Up only) */}
            {mode === 'signup' && (
              <View className="mb-6">
                <Text className="text-sm font-semibold mb-2" style={{ color: colors.onSurface }}>
                  Full Name
                </Text>
                <View 
                  className="flex-row items-center p-4 rounded-xl border"
                  style={{ 
                    backgroundColor: colors.surface,
                    borderColor: colors.surfaceVariant,
                  }}
                >
                  <Ionicons name="person-outline" size={20} color={colors.onSurface + '60'} />
                  <TextInput
                    className="flex-1 ml-3 text-base"
                    style={{ color: colors.onSurface }}
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.onSurface + '60'}
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                </View>
              </View>
            )}

            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold mb-2" style={{ color: colors.onSurface }}>
                Email Address
              </Text>
              <View 
                className="flex-row items-center p-4 rounded-xl border"
                style={{ 
                  backgroundColor: colors.surface,
                  borderColor: colors.surfaceVariant,
                }}
              >
                <Ionicons name="mail-outline" size={20} color={colors.onSurface + '60'} />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  style={{ color: colors.onSurface }}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.onSurface + '60'}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password Input (Not for reset) */}
            {mode !== 'reset' && (
              <View className="mb-6">
                <Text className="text-sm font-semibold mb-2" style={{ color: colors.onSurface }}>
                  Password
                </Text>
                <View 
                  className="flex-row items-center p-4 rounded-xl border"
                  style={{ 
                    backgroundColor: colors.surface,
                    borderColor: colors.surfaceVariant,
                  }}
                >
                  <Ionicons name="lock-closed-outline" size={20} color={colors.onSurface + '60'} />
                  <TextInput
                    className="flex-1 ml-3 text-base"
                    style={{ color: colors.onSurface }}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.onSurface + '60'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="ml-2"
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color={colors.onSurface + '60'} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Confirm Password Input (Sign Up only) */}
            {mode === 'signup' && (
              <View className="mb-6">
                <Text className="text-sm font-semibold mb-2" style={{ color: colors.onSurface }}>
                  Confirm Password
                </Text>
                <View 
                  className="flex-row items-center p-4 rounded-xl border"
                  style={{ 
                    backgroundColor: colors.surface,
                    borderColor: colors.surfaceVariant,
                  }}
                >
                  <Ionicons name="lock-closed-outline" size={20} color={colors.onSurface + '60'} />
                  <TextInput
                    className="flex-1 ml-3 text-base"
                    style={{ color: colors.onSurface }}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.onSurface + '60'}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-2"
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color={colors.onSurface + '60'} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Forgot Password Link (Sign In only) */}
            {mode === 'signin' && (
              <TouchableOpacity
                className="self-end mb-6"
                onPress={() => switchMode('reset')}
              >
                <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              className={`p-4 rounded-xl items-center mb-6 ${loading ? 'opacity-70' : ''}`}
              style={{ backgroundColor: colors.primary }}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <View className="flex-row items-center">
                  <Animatable.View animation="rotate" iterationCount="infinite">
                    <Ionicons name="refresh" size={20} color="white" />
                  </Animatable.View>
                  <Text className="text-white text-base font-semibold ml-2">
                    Please wait...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-base font-semibold">
                  {getButtonText()}
                </Text>
              )}
            </TouchableOpacity>

            {/* Mode Switch Links */}
            <View className="items-center">
              {mode === 'signin' && (
                <View className="flex-row items-center">
                  <Text className="text-sm" style={{ color: colors.onSurface + '80' }}>
                    Don't have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={() => switchMode('signup')}>
                    <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {mode === 'signup' && (
                <View className="flex-row items-center">
                  <Text className="text-sm" style={{ color: colors.onSurface + '80' }}>
                    Already have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={() => switchMode('signin')}>
                    <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {mode === 'reset' && (
                <View className="flex-row items-center">
                  <Text className="text-sm" style={{ color: colors.onSurface + '80' }}>
                    Remember your password?{' '}
                  </Text>
                  <TouchableOpacity onPress={() => switchMode('signin')}>
                    <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Terms and Privacy (Sign Up only) */}
            {mode === 'signup' && (
              <View className="mt-8 px-4">
                <Text className="text-xs text-center leading-5" style={{ color: colors.onSurface + '60' }}>
                  By creating an account, you agree to our{' '}
                  <Text className="font-semibold" style={{ color: colors.primary }}>
                    Terms of Service
                  </Text>
                  {' '}and{' '}
                  <Text className="font-semibold" style={{ color: colors.primary }}>
                    Privacy Policy
                  </Text>
                </Text>
              </View>
            )}
          </Animatable.View>
        </View>

        {/* Features Preview */}
        <View className="px-5 py-8">
          <Text className="text-lg font-bold text-center mb-6" style={{ color: colors.onBackground }}>
            Why Choose OralScan AI?
          </Text>
          <View style={{ gap: 16 }}>
            {[
              {
                icon: 'camera',
                title: 'AI-Powered Analysis',
                description: 'Advanced AI analyzes your oral health instantly',
              },
              {
                icon: 'trending-up',
                title: 'Track Progress',
                description: 'Monitor your oral health improvements over time',
              },
              {
                icon: 'shield-checkmark',
                title: 'Secure & Private',
                description: 'Your health data is encrypted and secure',
              },
            ].map((feature, index) => (
              <Animatable.View
                key={index}
                animation="fadeInUp"
                delay={600 + index * 100}
                className="flex-row items-center"
              >
                <View 
                  className="w-12 h-12 rounded-full justify-center items-center mr-4"
                  style={{ backgroundColor: colors.primary + '20' }}
                >
                  <Ionicons name={feature.icon as any} size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold mb-1" style={{ color: colors.onSurface }}>
                    {feature.title}
                  </Text>
                  <Text className="text-sm" style={{ color: colors.onSurface + '80' }}>
                    {feature.description}
                  </Text>
                </View>
              </Animatable.View>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;
