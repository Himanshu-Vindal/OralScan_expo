import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import { CircularProgress } from 'react-native-circular-progress';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import TopNavigation from '../components/TopNavigation';

const { width } = Dimensions.get('window');

interface HealthScore {
  category: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  improvement?: number;
}

interface ScanResult {
  id: string;
  date: string;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  issues: string[];
  recommendations: string[];
}

interface DashboardData {
  overallScore: number;
  totalScans: number;
  weeklyProgress: number[];
  recentScans: ScanResult[];
  healthScores: HealthScore[];
}

const getScoreColor = (score: number): string => {
  if (score >= 85) return '#10B981'; // Green - Excellent
  if (score >= 70) return '#3B82F6'; // Blue - Good  
  if (score >= 50) return '#F59E0B'; // Orange - Warning
  return '#EF4444'; // Red - Critical
};

const getStatusInfo = (score: number) => {
  if (score >= 85) return { status: 'excellent', label: 'Excellent', color: '#10B981' };
  if (score >= 70) return { status: 'good', label: 'Good', color: '#3B82F6' };
  if (score >= 50) return { status: 'warning', label: 'Needs Attention', color: '#F59E0B' };
  return { status: 'critical', label: 'Critical', color: '#EF4444' };
};

const HealthScoreCard = ({ 
  score, 
  colors, 
  delay = 0 
}: { 
  score: HealthScore; 
  colors: any; 
  delay?: number; 
}) => {
  const trendIcon = score.trend === 'up' ? 'trending-up' : score.trend === 'down' ? 'trending-down' : 'remove';
  const trendColor = score.trend === 'up' ? '#10B981' : score.trend === 'down' ? '#EF4444' : '#94A3B8';

  return (
    <Animatable.View
      animation="fadeInUp"
      delay={delay}
      duration={800}
      className="card-medical p-5 mx-2 my-2 min-w-[42%] shadow-medical"
    >
      <View className="flex-row justify-between items-start">
        <View 
          className="w-12 h-12 rounded-2xl p-3 items-center justify-center"
          style={{ backgroundColor: getScoreColor(score.score) + '20' }}
        >
          <Ionicons name={score.icon as any} size={24} color={getScoreColor(score.score)} />
        </View>
        
        <View className="flex-row items-center">
          <Ionicons name={trendIcon as any} size={16} color={trendColor} />
          {score.improvement && (
            <Text className="text-xs font-semibold ml-1" style={{ color: trendColor }}>
              {score.improvement > 0 ? '+' : ''}{score.improvement}%
            </Text>
          )}
        </View>
      </View>

      <View className="mt-4">
        <Text className="text-3xl font-extrabold mb-1" style={{ color: getScoreColor(score.score) }}>
          {score.score}
        </Text>
        
        <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          {score.category}
        </Text>

        {/* Progress Bar */}
        <View className="h-1.5 bg-medical-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <Animatable.View
            animation="slideInLeft"
            delay={delay + 500}
            duration={1000}
            className="h-full rounded-full"
            style={{
              width: `${score.score}%`,
              backgroundColor: getScoreColor(score.score),
            }}
          />
        </View>
      </View>
    </Animatable.View>
  );
};

const ScanHistoryCard = ({ 
  scan, 
  colors, 
  delay = 0,
  onPress
}: { 
  scan: ScanResult; 
  colors: any; 
  delay?: number;
  onPress?: () => void;
}) => {
  const statusInfo = getStatusInfo(scan.score);

  return (
    <Animatable.View
      animation="fadeInUp"
      delay={delay}
      duration={600}
      className="card-medical p-4 my-1.5 mx-5 border-l-4"
      style={{ borderLeftColor: statusInfo.color }}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <View 
              className="w-10 h-10 rounded-xl p-2 mr-3 items-center justify-center"
              style={{ backgroundColor: statusInfo.color + '20' }}
            >
              <Ionicons 
                name={scan.status === 'excellent' ? 'checkmark-circle' : 
                      scan.status === 'good' ? 'thumbs-up' :
                      scan.status === 'warning' ? 'warning' : 'alert-circle'} 
                size={20} 
                color={statusInfo.color} 
              />
            </View>
            
            <View>
              <Text className="text-base font-semibold text-slate-900 dark:text-white">
                {statusInfo.label}
              </Text>
              <Text className="text-xs text-slate-600 dark:text-slate-400">
                {new Date(scan.date).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {scan.issues.length > 0 && (
            <Text className="text-sm text-slate-600 dark:text-slate-400 leading-5">
              {scan.issues.slice(0, 2).join(', ')}
              {scan.issues.length > 2 && ` +${scan.issues.length - 2} more`}
            </Text>
          )}
        </View>

        <View className="items-center">
          <Text className="text-2xl font-bold" style={{ color: statusInfo.color }}>
            {scan.score}
          </Text>
          <Text className="text-xs text-slate-600 dark:text-slate-400">
            Score
          </Text>
        </View>
      </View>
    </Animatable.View>
  );
};

export default function DashboardScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const fetchDashboardData = async () => {
    try {
      // Mock data for now - replace with API calls later
      const mockData: DashboardData = {
        overallScore: 85,
        totalScans: 12,
        weeklyProgress: [75, 78, 82, 85, 88, 85, 87],
        recentScans: [
          {
            id: '1',
            date: '2024-01-15',
            score: 87,
            status: 'good',
            issues: ['Minor plaque buildup'],
            recommendations: ['Increase flossing frequency']
          }
        ],
        healthScores: [
          { category: 'Gums', score: 90, trend: 'up', icon: 'heart', improvement: 5 },
          { category: 'Teeth', score: 85, trend: 'stable', icon: 'medical', improvement: 0 },
          { category: 'Overall', score: 88, trend: 'up', icon: 'checkmark-circle', improvement: 3 }
        ]
      };
      setDashboardData(mockData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchDashboardData();
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleScanPress = (scan: ScanResult) => {
    // Navigate to scan details
    console.log('View scan details:', scan.id);
  };

  if (!dashboardData) {
    return (
      <SafeAreaView className="flex-1 bg-medical-50 dark:bg-slate-900">
        <TopNavigation
          title={t('dashboard')}
          subtitle={t('dashboardSubtitle')}
          showBackButton={true}
          rightIcon="share-outline"
          onRightPress={() => console.log('Share pressed')}
        />
        
        <View className="flex-1 justify-center items-center">
          <Ionicons name="sync" size={48} color={colors.textSecondary} />
          <Text className="text-lg text-slate-600 dark:text-slate-400 mt-4">
            Loading dashboard data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-medical-50 dark:bg-slate-900">
      <TopNavigation
        title={t('dashboard')}
        subtitle={t('dashboardSubtitle')}
        showBackButton={true}
        rightIcon="share-outline"
        onRightPress={() => console.log('Share pressed')}
      />
      
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <Animatable.View
          animation="fadeInDown"
          duration={800}
          className="px-6 pt-5 pb-8"
        >
          <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Health Dashboard
          </Text>
          <Text className="text-base text-slate-600 dark:text-slate-400 font-medium">
            Track your oral health progress
          </Text>
        </Animatable.View>

        {/* Health Scores */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4 px-6">
            Health Overview
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {dashboardData.healthScores.map((score, index) => (
              <HealthScoreCard
                key={score.category}
                score={score}
                colors={colors}
                delay={index * 100}
              />
            ))}
          </ScrollView>
        </View>

        {/* Progress Chart */}
        <Animatable.View
          animation="fadeInUp"
          delay={400}
          duration={800}
          className="mb-8"
        >
          <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4 px-6">
            Progress Over Time
          </Text>
          
          <View className="card-medical mx-5 p-4 shadow-medical">
            <LineChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                  data: dashboardData.weeklyProgress,
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                  strokeWidth: 3,
                }],
              }}
              width={width - 72}
              height={220}
              chartConfig={{
                backgroundColor: colors.surface,
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => colors.text + Math.floor(opacity * 255).toString(16),
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: colors.primary,
                  fill: colors.primary,
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: colors.border,
                  strokeWidth: 1,
                },
              }}
              bezier
              style={{ borderRadius: 16 }}
              withDots={true}
              withShadow={false}
              withInnerLines={true}
              withOuterLines={false}
            />
          </View>
        </Animatable.View>

        {/* Recent Scans */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center px-6 mb-4">
            <Text className="text-xl font-bold text-slate-900 dark:text-white">
              Recent Scans
            </Text>
            <TouchableOpacity
              onPress={() => console.log('View all scans')}
              className="bg-primary-500/15 rounded-xl px-3 py-1.5"
            >
              <Text className="text-sm font-semibold text-primary-500">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {dashboardData.recentScans.length > 0 ? (
            dashboardData.recentScans.map((scan, index) => (
              <ScanHistoryCard
                key={scan.id}
                scan={scan}
                colors={colors}
                delay={500 + index * 100}
                onPress={() => handleScanPress(scan)}
              />
            ))
          ) : (
            <Animatable.View
              animation="fadeInUp"
              delay={500}
              duration={600}
              className="card-medical p-10 mx-5 items-center shadow-sm"
            >
              <Ionicons 
                name="document-outline" 
                size={48} 
                color={colors.textSecondary} 
                className="mb-4"
              />
              <Text className="text-lg font-semibold text-slate-900 dark:text-white mb-2 text-center">
                No Scans Yet
              </Text>
              <Text className="text-sm text-slate-600 dark:text-slate-400 text-center leading-5 mb-5">
                Start your first oral health scan to see your progress here
              </Text>
              <TouchableOpacity
                onPress={() => console.log('Navigate to scan')}
                className="bg-primary-500 rounded-xl px-5 py-2.5"
              >
                <Text className="text-white text-sm font-semibold">
                  Start Scan
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
