import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const QuickActionCard = ({ 
  icon, 
  title, 
  description, 
  onPress, 
  gradient, 
  delay = 0 
}: {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  gradient: string[];
  delay?: number;
}) => {
  return (
    <Animatable.View
      animation="fadeInUp"
      delay={delay}
      duration={800}
      style={{ flex: 1, marginHorizontal: 6 }}
    >
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        activeOpacity={0.8}
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        }}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            padding: 20,
            minHeight: 140,
            justifyContent: 'space-between',
          }}
        >
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: 50,
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <Ionicons name={icon as any} size={24} color="white" />
          </View>
          
          <View>
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '700',
              marginBottom: 4,
            }}>
              {title}
            </Text>
            <Text style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 12,
              lineHeight: 16,
            }}>
              {description}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const HealthTipCard = ({ tip, colors }: { tip: string; colors: any }) => {
  return (
    <Animatable.View
      animation="fadeInUp"
      delay={600}
      duration={800}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginTop: 24,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View style={{
          backgroundColor: colors.primary + '20',
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}>
          <Ionicons name="bulb" size={20} color={colors.primary} />
        </View>
        <Text style={{
          color: colors.onSurface,
          fontSize: 18,
          fontWeight: '600',
        }}>
          Daily Health Tip
        </Text>
      </View>
      
      <Text style={{
        color: colors.onSurface,
        fontSize: 14,
        lineHeight: 20,
        opacity: 0.8,
      }}>
        {tip}
      </Text>
    </Animatable.View>
  );
};

const StatsCard = ({ 
  icon, 
  value, 
  label, 
  colors, 
  delay = 0 
}: {
  icon: string;
  value: string;
  label: string;
  colors: any;
  delay?: number;
}) => {
  return (
    <Animatable.View
      animation="fadeInUp"
      delay={delay}
      duration={800}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        flex: 1,
        marginHorizontal: 6,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      }}
    >
      <View style={{
        backgroundColor: colors.primary + '15',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <Ionicons name={icon as any} size={24} color={colors.primary} />
      </View>
      
      <Text style={{
        color: colors.onSurface,
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
      }}>
        {value}
      </Text>
      
      <Text style={{
        color: colors.onSurface,
        fontSize: 12,
        opacity: 0.7,
        textAlign: 'center',
      }}>
        {label}
      </Text>
    </Animatable.View>
  );
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
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
    }, 10000); // Change tip every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      <ScrollView
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
        {/* Header Section */}
        <Animatable.View
          animation="fadeInDown"
          duration={800}
          style={{ paddingHorizontal: 20, paddingTop: 20 }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                color: colors.onBackground,
                fontSize: 28,
                fontWeight: '800',
                marginBottom: 4,
              }}>
                {t('welcome')} 👋
              </Text>
              <Text style={{
                color: colors.onBackground,
                opacity: 0.7,
                fontSize: 16,
                lineHeight: 22,
              }}>
                {user?.fullName || user?.email?.split('@')[0] || t('user')}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={handleProfile}
              style={{
                backgroundColor: colors.surface,
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
              }}
            >
              <Ionicons name="person" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Animatable.View>

        {/* Stats Section */}
        <View style={{ paddingHorizontal: 14, marginTop: 24 }}>
          <View style={{ flexDirection: 'row' }}>
            <StatsCard
              icon="analytics"
              value="94%"
              label="AI Accuracy"
              colors={colors}
              delay={200}
            />
            <StatsCard
              icon="people"
              value="50K+"
              label="Happy Users"
              colors={colors}
              delay={300}
            />
            <StatsCard
              icon="camera"
              value="200K+"
              label="Scans Done"
              colors={colors}
              delay={400}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <Animatable.View
          animation="fadeInUp"
          delay={300}
          duration={800}
          style={{ paddingHorizontal: 20, marginTop: 32 }}
        >
          <Text style={{
            color: colors.onBackground,
            fontSize: 22,
            fontWeight: '700',
            marginBottom: 16,
          }}>
            {t('quickActions')}
          </Text>
          
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <QuickActionCard
              icon="camera"
              title={t('quickScan')}
              description={t('quickScanDesc')}
              onPress={handleQuickScan}
              gradient={['#667eea', '#764ba2']}
              delay={400}
            />
            <QuickActionCard
              icon="analytics"
              title={t('viewReports')}
              description={t('viewReportsDesc')}
              onPress={handleViewReports}
              gradient={['#f093fb', '#f5576c']}
              delay={500}
            />
          </View>
        </Animatable.View>

        {/* Health Tip */}
        <HealthTipCard tip={healthTips[currentTip]} colors={colors} />

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
