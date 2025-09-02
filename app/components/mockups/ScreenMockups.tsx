import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Onboarding Screen Mockup
export function OnboardingMockup({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  
  return (
    <View className={`flex-1 ${isDark ? 'bg-medical-900' : 'bg-white'}`}>
      {/* Header */}
      <View className="pt-16 pb-8 px-6">
        <View className="items-center">
          <View className={`w-20 h-20 rounded-2xl ${isDark ? 'bg-primary-900/30' : 'bg-primary-100'} items-center justify-center mb-6`}>
            <Ionicons name="medical" size={40} color="#3b82f6" />
          </View>
          <Text className={`text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-medical-900'}`}>
            Welcome to OralScan
          </Text>
          <Text className={`text-lg text-center mt-3 ${isDark ? 'text-medical-300' : 'text-medical-600'}`}>
            AI-powered oral health analysis at your fingertips
          </Text>
        </View>
      </View>

      {/* Features */}
      <ScrollView className="flex-1 px-6">
        <FeatureCard
          icon="camera"
          title="Smart Camera Analysis"
          description="Advanced AI analyzes your oral health in seconds"
          isDark={isDark}
        />
        <FeatureCard
          icon="analytics"
          title="Personalized Insights"
          description="Get tailored recommendations for better oral care"
          isDark={isDark}
        />
        <FeatureCard
          icon="shield-checkmark"
          title="Track Progress"
          description="Monitor your oral health journey over time"
          isDark={isDark}
        />
      </ScrollView>

      {/* CTA Buttons */}
      <View className="px-6 pb-8 space-y-3">
        <LinearGradient
          colors={['#3b82f6', '#2563eb']}
          className="rounded-xl py-4 px-6"
        >
          <Text className="text-white text-lg font-semibold text-center">
            Get Started
          </Text>
        </LinearGradient>
        
        <TouchableOpacity className={`py-4 px-6 rounded-xl ${isDark ? 'bg-medical-800' : 'bg-medical-100'}`}>
          <Text className={`text-lg font-medium text-center ${isDark ? 'text-medical-300' : 'text-medical-700'}`}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Dashboard Screen Mockup
export function DashboardMockup({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  
  return (
    <View className={`flex-1 ${isDark ? 'bg-medical-900' : 'bg-medical-50'}`}>
      {/* Header */}
      <View className={`${isDark ? 'bg-medical-800' : 'bg-white'} pt-12 pb-6 px-6 shadow-sm`}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-medical-900'}`}>
              Dashboard
            </Text>
            <Text className={`${isDark ? 'text-medical-400' : 'text-medical-600'}`}>
              Your oral health overview
            </Text>
          </View>
          <TouchableOpacity className={`${isDark ? 'bg-medical-700' : 'bg-medical-100'} rounded-full p-3`}>
            <Ionicons name="notifications" size={24} color={isDark ? '#9ca3af' : '#64748b'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        {/* Health Score Card */}
        <View className={`${isDark ? 'bg-medical-800' : 'bg-white'} rounded-2xl p-6 mb-4 shadow-lg`}>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-medical-900'}`}>
                Health Score
              </Text>
              <Text className={`${isDark ? 'text-medical-400' : 'text-medical-600'}`}>
                Last scan: 2 days ago
              </Text>
            </View>
            <View className="items-center">
              <View className="w-16 h-16 bg-health-excellent rounded-full items-center justify-center">
                <Text className="text-white text-xl font-bold">87</Text>
              </View>
              <Text className="text-health-excellent text-sm font-medium mt-1">Excellent</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="flex-row space-x-3 mb-4">
          <StatCard title="Total Scans" value="24" isDark={isDark} />
          <StatCard title="Avg Score" value="85" isDark={isDark} />
          <StatCard title="Streak" value="7 days" isDark={isDark} />
        </View>

        {/* Recent Scans */}
        <View className={`${isDark ? 'bg-medical-800' : 'bg-white'} rounded-2xl p-4 shadow-lg`}>
          <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-medical-900'}`}>
            Recent Scans
          </Text>
          <ScanHistoryItem date="Today" score={87} status="excellent" isDark={isDark} />
          <ScanHistoryItem date="2 days ago" score={82} status="good" isDark={isDark} />
          <ScanHistoryItem date="5 days ago" score={79} status="good" isDark={isDark} />
        </View>
      </ScrollView>
    </View>
  );
}

// Scan Results Screen Mockup
export function ScanResultsMockup({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  
  return (
    <View className={`flex-1 ${isDark ? 'bg-medical-900' : 'bg-medical-50'}`}>
      {/* Header */}
      <View className={`${isDark ? 'bg-medical-800' : 'bg-white'} pt-12 pb-6 px-6 shadow-sm`}>
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4">
            <Ionicons name="arrow-back" size={24} color={isDark ? '#9ca3af' : '#64748b'} />
          </TouchableOpacity>
          <View>
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-medical-900'}`}>
              Scan Results
            </Text>
            <Text className={`${isDark ? 'text-medical-400' : 'text-medical-600'}`}>
              December 15, 2024
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        {/* Score Card */}
        <LinearGradient
          colors={['#10b981', '#059669']}
          className="rounded-2xl p-6 mb-4"
        >
          <View className="items-center">
            <Text className="text-white text-4xl font-bold">87</Text>
            <Text className="text-white/90 text-lg font-medium">Excellent Health</Text>
            <Text className="text-white/80 text-center mt-2">
              Your oral health is in great condition!
            </Text>
          </View>
        </LinearGradient>

        {/* Analysis Sections */}
        <AnalysisSection
          title="Key Insights"
          icon="lightbulb"
          items={[
            "Good overall oral hygiene detected",
            "Teeth alignment appears normal",
            "No visible signs of decay"
          ]}
          isDark={isDark}
        />

        <AnalysisSection
          title="Recommendations"
          icon="checkmark-circle"
          items={[
            "Continue regular brushing twice daily",
            "Consider using fluoride mouthwash",
            "Schedule routine dental checkup"
          ]}
          isDark={isDark}
        />

        {/* Action Buttons */}
        <View className="mt-6 space-y-3">
          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            className="rounded-xl py-4 px-6"
          >
            <Text className="text-white text-lg font-semibold text-center">
              Save to History
            </Text>
          </LinearGradient>
          
          <View className="flex-row space-x-3">
            <TouchableOpacity className={`flex-1 ${isDark ? 'bg-medical-800' : 'bg-white'} rounded-xl py-3 px-4`}>
              <Text className={`font-medium text-center ${isDark ? 'text-medical-300' : 'text-medical-700'}`}>
                Share
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className={`flex-1 ${isDark ? 'bg-medical-800' : 'bg-white'} rounded-xl py-3 px-4`}>
              <Text className={`font-medium text-center ${isDark ? 'text-medical-300' : 'text-medical-700'}`}>
                Retake
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Helper Components
function FeatureCard({ icon, title, description, isDark }: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  isDark: boolean;
}) {
  return (
    <View className={`${isDark ? 'bg-medical-800' : 'bg-white'} rounded-xl p-4 mb-4 shadow-sm`}>
      <View className="flex-row items-start">
        <View className={`${isDark ? 'bg-primary-900/30' : 'bg-primary-100'} rounded-lg p-3 mr-4`}>
          <Ionicons name={icon} size={24} color="#3b82f6" />
        </View>
        <View className="flex-1">
          <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-medical-900'}`}>
            {title}
          </Text>
          <Text className={`mt-1 ${isDark ? 'text-medical-400' : 'text-medical-600'}`}>
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
}

function StatCard({ title, value, isDark }: {
  title: string;
  value: string;
  isDark: boolean;
}) {
  return (
    <View className={`flex-1 ${isDark ? 'bg-medical-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
      <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-medical-900'}`}>
        {value}
      </Text>
      <Text className={`text-sm ${isDark ? 'text-medical-400' : 'text-medical-600'}`}>
        {title}
      </Text>
    </View>
  );
}

function ScanHistoryItem({ date, score, status, isDark }: {
  date: string;
  score: number;
  status: string;
  isDark: boolean;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-health-excellent';
      case 'good': return 'text-health-good';
      case 'fair': return 'text-health-warning';
      default: return 'text-health-critical';
    }
  };

  return (
    <View className="flex-row items-center justify-between py-3 border-b border-medical-200 dark:border-medical-700 last:border-b-0">
      <View>
        <Text className={`font-medium ${isDark ? 'text-white' : 'text-medical-900'}`}>
          {date}
        </Text>
        <Text className={`text-sm capitalize ${getStatusColor(status)}`}>
          {status}
        </Text>
      </View>
      <Text className={`text-lg font-bold ${getStatusColor(status)}`}>
        {score}
      </Text>
    </View>
  );
}

function AnalysisSection({ title, icon, items, isDark }: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  items: string[];
  isDark: boolean;
}) {
  return (
    <View className={`${isDark ? 'bg-medical-800' : 'bg-white'} rounded-2xl p-4 mb-4 shadow-lg`}>
      <View className="flex-row items-center mb-3">
        <View className={`${isDark ? 'bg-primary-900/30' : 'bg-primary-100'} rounded-lg p-2 mr-3`}>
          <Ionicons name={icon} size={20} color="#3b82f6" />
        </View>
        <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-medical-900'}`}>
          {title}
        </Text>
      </View>
      {items.map((item, index) => (
        <View key={index} className="flex-row items-start mb-2">
          <View className={`w-1.5 h-1.5 ${isDark ? 'bg-medical-500' : 'bg-medical-400'} rounded-full mt-2 mr-3`} />
          <Text className={`flex-1 ${isDark ? 'text-medical-300' : 'text-medical-700'} leading-5`}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

// Usage Examples:
/*
// Light Theme
<OnboardingMockup theme="light" />
<DashboardMockup theme="light" />
<ScanResultsMockup theme="light" />

// Dark Theme  
<OnboardingMockup theme="dark" />
<DashboardMockup theme="dark" />
<ScanResultsMockup theme="dark" />
*/
