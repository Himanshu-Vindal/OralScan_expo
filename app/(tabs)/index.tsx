import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { router } from 'expo-router';

// Modern Quick Action Card with enhanced TailwindCSS design
const QuickActionCard = ({ 
  icon, 
  title, 
  description, 
  onPress, 
  gradient,
  iconColor = 'white'
}: {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  gradient: [string, string];
  iconColor?: string;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      activeOpacity={0.9}
      className="flex-1 mx-2 mb-4"
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-6 rounded-2xl min-h-[160px] justify-between shadow-medical"
      >
        <View className="bg-white/20 w-14 h-14 rounded-full items-center justify-center mb-4">
          <Ionicons name={icon as any} size={28} color={iconColor} />
        </View>
        
        <View>
          <Text className="text-white text-lg font-bold mb-2 text-balance">
            {title}
          </Text>
          <Text className="text-white/90 text-sm leading-5 text-balance">
            {description}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Enhanced Health Tip Card with modern TailwindCSS design
const HealthTipCard = ({ tip, isDark }: { tip: string; isDark: boolean }) => {
  return (
    <View className="card-medical mx-5 mt-6 border-l-4 border-primary-500">
      <View className="p-6">
        <View className="flex-row items-center mb-4">
          <View className="bg-primary-100 dark:bg-primary-900/30 w-12 h-12 rounded-full items-center justify-center mr-4">
            <Ionicons name="bulb" size={24} color="#3b82f6" />
          </View>
          <Text className="text-lg font-semibold text-slate-900 dark:text-white">
            💡 Daily Health Tip
          </Text>
        </View>
        
        <Text className="text-sm leading-6 text-slate-700 dark:text-slate-300 text-balance">
          {tip}
        </Text>
      </View>
    </View>
  );
};

// Modern Stat Card Component
const StatCard = ({ 
  icon, 
  value, 
  label, 
  className = "" 
}: { 
  icon: string; 
  value: string; 
  label: string; 
  className?: string; 
}) => {
  return (
    <View className={`card-medical p-4 items-center ${className}`}>
      <View className="bg-primary-100 dark:bg-primary-900/30 w-10 h-10 rounded-full items-center justify-center mb-3">
        <Ionicons name={icon as any} size={20} color="#3b82f6" />
      </View>
      <Text className="text-xl font-bold text-slate-900 dark:text-white mb-1">
        {value}
      </Text>
      <Text className="text-xs text-slate-600 dark:text-slate-400 text-center">
        {label}
      </Text>
    </View>
  );
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const healthTips = [
    "Brush your teeth for at least 2 minutes twice daily for optimal oral health.",
    "Floss daily to remove plaque and bacteria between teeth that brushing can't reach.",
    "Use fluoride toothpaste to strengthen tooth enamel and prevent cavities.",
    "Limit sugary and acidic foods to protect your teeth from decay.",
    "Visit your dentist regularly for professional cleanings and check-ups.",
    "Stay hydrated with water to help wash away food particles and bacteria.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % healthTips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1000);
  };

  const handleQuickScan = () => {
    router.push('/(tabs)/scan');
  };

  const handleViewReports = () => {
    router.push('/(tabs)/dashboard');
  };

  const handleProfile = () => {
    router.push('/(tabs)/profile');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView className="flex-1 bg-medical-50 dark:bg-slate-900">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Header Section */}
        <View className="px-5 pt-6 pb-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-3xl font-bold mb-1 text-slate-900 dark:text-white">
                {getGreeting()} 👋
              </Text>
              <Text className="text-base text-slate-600 dark:text-slate-400">
                {user?.fullName || user?.email?.split('@')[0] || 'User'}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={handleProfile}
              className="w-12 h-12 rounded-full items-center justify-center bg-white dark:bg-slate-800 shadow-sm"
            >
              <Ionicons name="person" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View className="px-3 mb-6">
          <View className="flex-row">
            <StatCard
              icon="analytics"
              value="94%"
              label="AI Accuracy"
              className="flex-1 mx-2"
            />
            <StatCard
              icon="people"
              value="50K+"
              label="Happy Users"
              className="flex-1 mx-2"
            />
            <StatCard
              icon="camera"
              value="200K+"
              label="Scans Done"
              className="flex-1 mx-2"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-5 mb-6">
          <Text className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
            Quick Actions
          </Text>
          
          <View className="flex-row">
            <QuickActionCard
              icon="camera"
              title="Quick Scan"
              description="Start your oral health scan"
              onPress={handleQuickScan}
              gradient={['#3b82f6', '#1d4ed8']}
            />
            <QuickActionCard
              icon="analytics"
              title="View Reports"
              description="Check your health reports"
              onPress={handleViewReports}
              gradient={['#10b981', '#059669']}
            />
          </View>
        </View>

        {/* Health Tip */}
        <HealthTipCard tip={healthTips[currentTip]} isDark={isDark} />

        {/* Bottom Spacing for Tab Navigation */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
