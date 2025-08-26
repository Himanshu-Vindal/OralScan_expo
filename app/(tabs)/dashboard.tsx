import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Dimensions,
} from 'react-native';
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

const { width } = Dimensions.get('window');

interface HealthScore {
  category: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

interface ScanResult {
  id: string;
  date: string;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  issues: string[];
  recommendations: string[];
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

const HealthScoreCard: React.FC<{ 
  score: HealthScore; 
  delay: number; 
  colors: any;
}> = ({ score, delay, colors }) => {
  const getTrendIcon = () => {
    switch (score.trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'remove';
    }
  };

  const getTrendColor = () => {
    switch (score.trend) {
      case 'up': return '#10B981';
      case 'down': return '#EF4444';
      default: return colors.textSecondary;
    }
  };

  return (
    <Animatable.View
      animation="fadeInUp"
      delay={delay}
      duration={800}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 8,
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <View style={{
          backgroundColor: getScoreColor(score.score) + '20',
          borderRadius: 12,
          padding: 8,
          marginRight: 12,
        }}>
          <Ionicons 
            name={score.icon as any} 
            size={20} 
            color={getScoreColor(score.score)} 
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: colors.text,
          }}>
            {score.category}
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Ionicons 
            name={getTrendIcon() as any} 
            size={16} 
            color={getTrendColor()} 
          />
        </View>
      </View>

      <CircularProgress
        size={80}
        width={6}
        fill={score.score}
        tintColor={getScoreColor(score.score)}
        backgroundColor={colors.border}
        rotation={0}
        lineCap="round"
        style={{ alignSelf: 'center', marginBottom: 12 }}
      >
        {() => (
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
          }}>
            {score.score}
          </Text>
        )}
      </CircularProgress>

      <Text style={{
        fontSize: 12,
        color: getScoreColor(score.score),
        textAlign: 'center',
        fontWeight: '600',
      }}>
        {getStatusInfo(score.score).label}
      </Text>
    </Animatable.View>
  );
};

const ScanHistoryCard: React.FC<{
  scan: ScanResult;
  delay: number;
  colors: any;
  onPress: () => void;
}> = ({ scan, delay, colors, onPress }) => {
  const statusInfo = getStatusInfo(scan.score);

  return (
    <Animatable.View
      animation="fadeInUp"
      delay={delay}
      duration={600}
    >
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 20,
          marginHorizontal: 20,
          marginBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 4,
          borderLeftWidth: 4,
          borderLeftColor: statusInfo.color,
        }}
      >
        <View style={{
          backgroundColor: statusInfo.color + '20',
          borderRadius: 12,
          padding: 12,
          marginRight: 16,
        }}>
          <Ionicons 
            name="document-text" 
            size={20} 
            color={statusInfo.color} 
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.text,
              marginRight: 8,
            }}>
              Scan Report
            </Text>
            <View style={{
              backgroundColor: statusInfo.color,
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}>
              <Text style={{
                fontSize: 10,
                color: '#FFFFFF',
                fontWeight: '600',
              }}>
                {statusInfo.label.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <Text style={{
            fontSize: 13,
            color: colors.textSecondary,
            marginBottom: 4,
          }}>
            {scan.date}
          </Text>

          <Text style={{
            fontSize: 13,
            color: colors.textSecondary,
          }}>
            {scan.issues.length} issues found • Score: {scan.score}/100
          </Text>
        </View>

        <View style={{
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: statusInfo.color,
            marginBottom: 4,
          }}>
            {scan.score}
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color={colors.textSecondary} 
          />
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default function DashboardScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const healthScores: HealthScore[] = [
    { category: 'Overall Health', score: 87, trend: 'up', icon: 'heart' },
    { category: 'Gum Health', score: 92, trend: 'up', icon: 'leaf' },
    { category: 'Teeth Condition', score: 78, trend: 'stable', icon: 'diamond' },
    { category: 'Oral Hygiene', score: 85, trend: 'up', icon: 'sparkles' },
  ];

  const recentScans: ScanResult[] = [
    {
      id: '1',
      date: 'Today, 2:30 PM',
      score: 87,
      status: 'excellent',
      issues: ['Minor plaque buildup'],
      recommendations: ['Regular brushing', 'Use mouthwash']
    },
    {
      id: '2', 
      date: 'Yesterday, 9:15 AM',
      score: 92,
      status: 'excellent',
      issues: [],
      recommendations: ['Keep up the good work']
    },
    {
      id: '3',
      date: '2 days ago, 6:45 PM',
      score: 74,
      status: 'good',
      issues: ['Slight gum inflammation', 'Tartar buildup'],
      recommendations: ['Professional cleaning', 'Floss daily']
    },
    {
      id: '4',
      date: '1 week ago, 11:20 AM',
      score: 68,
      status: 'warning',
      issues: ['Cavity detected', 'Gum recession'],
      recommendations: ['See dentist', 'Improve oral hygiene']
    }
  ];

  const progressData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [65, 72, 78, 85, 89, 87],
      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
      strokeWidth: 3,
    }],
  };

  const chartConfig = {
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
  };

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleScanPress = (scan: ScanResult) => {
    // Navigate to scan details
    console.log('View scan details:', scan.id);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <ScrollView
        style={{ flex: 1 }}
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
          style={{
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: 32,
          }}
        >
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 8,
          }}>
            Health Dashboard
          </Text>
          <Text style={{
            fontSize: 16,
            color: colors.textSecondary,
            fontWeight: '500',
          }}>
            Track your oral health progress
          </Text>
        </Animatable.View>

        {/* Health Scores */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 16,
            paddingHorizontal: 24,
          }}>
            Health Overview
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {healthScores.map((score, index) => (
              <HealthScoreCard
                key={score.category}
                score={score}
                delay={index * 100}
                colors={colors}
              />
            ))}
          </ScrollView>
        </View>

        {/* Progress Chart */}
        <Animatable.View
          animation="fadeInUp"
          delay={400}
          duration={800}
          style={{ marginBottom: 32 }}
        >
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 16,
            paddingHorizontal: 24,
          }}>
            Progress Over Time
          </Text>
          
          <View style={{
            backgroundColor: colors.surface,
            marginHorizontal: 20,
            borderRadius: 20,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 6,
          }}>
            <LineChart
              data={progressData}
              width={width - 72}
              height={220}
              chartConfig={chartConfig}
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
        <View style={{ marginBottom: 24 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 24,
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: colors.text,
            }}>
              Recent Scans
            </Text>
            <TouchableOpacity
              onPress={() => console.log('View all scans')}
              style={{
                backgroundColor: colors.primary + '15',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.primary,
              }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {recentScans.length > 0 ? (
            recentScans.map((scan, index) => (
              <ScanHistoryCard
                key={scan.id}
                scan={scan}
                delay={500 + index * 100}
                colors={colors}
                onPress={() => handleScanPress(scan)}
              />
            ))
          ) : (
            <Animatable.View
              animation="fadeInUp"
              delay={500}
              duration={600}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 40,
                marginHorizontal: 20,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Ionicons 
                name="document-outline" 
                size={48} 
                color={colors.textSecondary} 
                style={{ marginBottom: 16 }}
              />
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 8,
                textAlign: 'center',
              }}>
                No Scans Yet
              </Text>
              <Text style={{
                fontSize: 14,
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 20,
                marginBottom: 20,
              }}>
                Start your first oral health scan to see your progress here
              </Text>
              <TouchableOpacity
                onPress={() => console.log('Navigate to scan')}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                }}
              >
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: '600',
                }}>
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
