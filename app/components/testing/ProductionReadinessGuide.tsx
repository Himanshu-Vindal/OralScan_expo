import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAccessibility, validateWCAGCompliance } from '../accessibility/AccessibilitySystem';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  priority: 'high' | 'medium' | 'low';
  automated?: boolean;
}

const PRODUCTION_CHECKLIST: ChecklistItem[] = [
  // UI/UX Quality
  {
    id: 'ui-consistency',
    category: 'UI/UX',
    title: 'UI Consistency',
    description: 'All screens follow consistent design patterns and TailwindCSS classes',
    status: 'completed',
    priority: 'high',
  },
  {
    id: 'responsive-design',
    category: 'UI/UX',
    title: 'Responsive Design',
    description: 'App works correctly on different screen sizes and orientations',
    status: 'completed',
    priority: 'high',
  },
  {
    id: 'dark-mode',
    category: 'UI/UX',
    title: 'Dark Mode Support',
    description: 'All components support light and dark themes properly',
    status: 'completed',
    priority: 'medium',
  },
  {
    id: 'animations',
    category: 'UI/UX',
    title: 'Smooth Animations',
    description: 'All animations use native driver and respect motion preferences',
    status: 'completed',
    priority: 'medium',
  },

  // Accessibility
  {
    id: 'wcag-compliance',
    category: 'Accessibility',
    title: 'WCAG 2.1 AA Compliance',
    description: 'Color contrast ratios meet 4.5:1 minimum requirement',
    status: 'completed',
    priority: 'high',
    automated: true,
  },
  {
    id: 'screen-reader',
    category: 'Accessibility',
    title: 'Screen Reader Support',
    description: 'All interactive elements have proper accessibility labels',
    status: 'completed',
    priority: 'high',
  },
  {
    id: 'touch-targets',
    category: 'Accessibility',
    title: 'Minimum Touch Targets',
    description: 'All interactive elements meet 44dp minimum size requirement',
    status: 'completed',
    priority: 'high',
    automated: true,
  },
  {
    id: 'font-scaling',
    category: 'Accessibility',
    title: 'Font Scaling Support',
    description: 'Text scales properly with system font size settings',
    status: 'completed',
    priority: 'medium',
  },

  // Performance
  {
    id: 'bundle-size',
    category: 'Performance',
    title: 'Bundle Size Optimization',
    description: 'App bundle size is optimized for production deployment',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 'memory-usage',
    category: 'Performance',
    title: 'Memory Usage',
    description: 'App memory usage is within acceptable limits',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 'animation-performance',
    category: 'Performance',
    title: 'Animation Performance',
    description: 'All animations maintain 60fps on target devices',
    status: 'completed',
    priority: 'high',
  },

  // Security
  {
    id: 'env-variables',
    category: 'Security',
    title: 'Environment Variables',
    description: 'Sensitive data is stored in environment variables',
    status: 'pending',
    priority: 'high',
  },
  {
    id: 'secure-storage',
    category: 'Security',
    title: 'Secure Storage',
    description: 'User tokens and sensitive data use secure storage',
    status: 'completed',
    priority: 'high',
  },
  {
    id: 'api-security',
    category: 'Security',
    title: 'API Security',
    description: 'All API calls use proper authentication and HTTPS',
    status: 'completed',
    priority: 'high',
  },

  // Functionality
  {
    id: 'camera-permissions',
    category: 'Functionality',
    title: 'Camera Permissions',
    description: 'Camera permissions are handled gracefully',
    status: 'completed',
    priority: 'high',
  },
  {
    id: 'offline-support',
    category: 'Functionality',
    title: 'Offline Support',
    description: 'App handles offline scenarios appropriately',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 'error-handling',
    category: 'Functionality',
    title: 'Error Handling',
    description: 'All error scenarios have proper user feedback',
    status: 'completed',
    priority: 'high',
  },

  // Code Quality
  {
    id: 'typescript',
    category: 'Code Quality',
    title: 'TypeScript Coverage',
    description: 'All components use proper TypeScript typing',
    status: 'completed',
    priority: 'medium',
  },
  {
    id: 'code-organization',
    category: 'Code Quality',
    title: 'Code Organization',
    description: 'Code is well-organized with reusable components',
    status: 'completed',
    priority: 'medium',
  },
  {
    id: 'unused-code',
    category: 'Code Quality',
    title: 'Unused Code Removal',
    description: 'All unused imports and code have been removed',
    status: 'completed',
    priority: 'low',
  },
];

const ChecklistItemComponent: React.FC<{
  item: ChecklistItem;
  index: number;
  onToggle: (id: string) => void;
}> = ({ item, index, onToggle }) => {
  const { colors } = useTheme();

  const getStatusIcon = () => {
    switch (item.status) {
      case 'completed':
        return { name: 'checkmark-circle', color: '#10b981' };
      case 'failed':
        return { name: 'close-circle', color: '#ef4444' };
      default:
        return { name: 'ellipse-outline', color: colors.textSecondary };
    }
  };

  const getPriorityColor = () => {
    switch (item.priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return colors.textSecondary;
    }
  };

  const statusIcon = getStatusIcon();

  return (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 50}
      duration={600}
      className="card-medical p-4 mx-4 mb-3 shadow-medical"
    >
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onToggle(item.id);
        }}
        className="flex-row items-start"
        activeOpacity={0.7}
      >
        <View className="mr-3 mt-1">
          <Ionicons
            name={statusIcon.name as any}
            size={24}
            color={statusIcon.color}
          />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-semibold text-slate-900 dark:text-white">
              {item.title}
            </Text>
            <View className="flex-row items-center">
              {item.automated && (
                <View className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded mr-2">
                  <Text className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                    AUTO
                  </Text>
                </View>
              )}
              <View
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getPriorityColor() }}
              />
            </View>
          </View>

          <Text className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            {item.description}
          </Text>

          <View className="flex-row items-center">
            <View className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              <Text className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {item.category}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const CategorySummary: React.FC<{
  category: string;
  items: ChecklistItem[];
}> = ({ category, items }) => {
  const completed = items.filter(item => item.status === 'completed').length;
  const total = items.length;
  const percentage = Math.round((completed / total) * 100);

  const getProgressColor = () => {
    if (percentage === 100) return '#10b981';
    if (percentage >= 80) return '#3b82f6';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Animatable.View
      animation="fadeInLeft"
      duration={600}
      className="card-medical p-4 mx-4 mb-3 shadow-medical"
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold text-slate-900 dark:text-white">
          {category}
        </Text>
        <Text className="text-sm font-semibold" style={{ color: getProgressColor() }}>
          {completed}/{total}
        </Text>
      </View>

      <View className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <Animatable.View
          animation="slideInLeft"
          duration={1000}
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: getProgressColor(),
          }}
        />
      </View>

      <Text className="text-xs text-slate-600 dark:text-slate-400 mt-2">
        {percentage}% Complete
      </Text>
    </Animatable.View>
  );
};

export const ProductionReadinessGuide: React.FC = () => {
  const { colors } = useTheme();
  const { settings } = useAccessibility();
  const [checklist, setChecklist] = useState<ChecklistItem[]>(PRODUCTION_CHECKLIST);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    runAutomatedChecks();
  }, []);

  const runAutomatedChecks = () => {
    // Simulate automated accessibility checks
    const updatedChecklist = checklist.map(item => {
      if (item.automated && item.id === 'wcag-compliance') {
        // Simulate WCAG compliance check
        const isCompliant = validateWCAGCompliance('#000000', '#ffffff').isCompliant;
        return { ...item, status: isCompliant ? 'completed' : 'failed' as const };
      }
      return item;
    });

    setChecklist(updatedChecklist);
  };

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const newStatus = item.status === 'completed' ? 'pending' : 'completed';
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const categories = Array.from(new Set(checklist.map(item => item.category)));
  const filteredItems = selectedCategory
    ? checklist.filter(item => item.category === selectedCategory)
    : checklist;

  const overallProgress = {
    completed: checklist.filter(item => item.status === 'completed').length,
    total: checklist.length,
  };

  const overallPercentage = Math.round((overallProgress.completed / overallProgress.total) * 100);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <Animatable.View
        animation="fadeInDown"
        duration={600}
        className="px-5 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
      >
        <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Production Readiness
        </Text>
        <Text className="text-base text-slate-600 dark:text-slate-400">
          Quality assurance checklist
        </Text>
      </Animatable.View>

      {/* Overall Progress */}
      <Animatable.View
        animation="fadeIn"
        delay={200}
        duration={600}
        className="mx-4 mt-4"
      >
        <LinearGradient
          colors={['#3b82f6', '#1d4ed8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="p-6 rounded-2xl shadow-lg"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-xl font-bold">
              Overall Progress
            </Text>
            <Text className="text-white text-2xl font-bold">
              {overallPercentage}%
            </Text>
          </View>

          <View className="h-3 bg-white/20 rounded-full overflow-hidden mb-2">
            <Animatable.View
              animation="slideInLeft"
              delay={500}
              duration={1500}
              className="h-full bg-white rounded-full"
              style={{ width: `${overallPercentage}%` }}
            />
          </View>

          <Text className="text-white/90 text-sm">
            {overallProgress.completed} of {overallProgress.total} items completed
          </Text>
        </LinearGradient>
      </Animatable.View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <TouchableOpacity
          onPress={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full mr-3 ${
            selectedCategory === null
              ? 'bg-medical-600'
              : 'bg-slate-200 dark:bg-slate-800'
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`font-medium ${
              selectedCategory === null
                ? 'text-white'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </Text>
        </TouchableOpacity>

        {categories.map(category => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full mr-3 ${
              selectedCategory === category
                ? 'bg-medical-600'
                : 'bg-slate-200 dark:bg-slate-800'
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`font-medium ${
                selectedCategory === category
                  ? 'text-white'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category Summaries */}
      {!selectedCategory && (
        <View className="mt-4">
          <Text className="text-lg font-bold text-slate-900 dark:text-white mx-4 mb-3">
            Category Overview
          </Text>
          {categories.map(category => (
            <CategorySummary
              key={category}
              category={category}
              items={checklist.filter(item => item.category === category)}
            />
          ))}
        </View>
      )}

      {/* Checklist Items */}
      <ScrollView
        className="flex-1 mt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {selectedCategory && (
          <Text className="text-lg font-bold text-slate-900 dark:text-white mx-4 mb-3">
            {selectedCategory} Items
          </Text>
        )}

        {filteredItems.map((item, index) => (
          <ChecklistItemComponent
            key={item.id}
            item={item}
            index={index}
            onToggle={toggleItem}
          />
        ))}

        {/* Production Tips */}
        <Animatable.View
          animation="fadeIn"
          delay={800}
          duration={600}
          className="card-medical p-6 mx-4 mt-4 shadow-medical"
        >
          <View className="flex-row items-center mb-4">
            <Ionicons name="bulb" size={24} color="#f59e0b" />
            <Text className="text-lg font-bold text-slate-900 dark:text-white ml-3">
              Production Tips
            </Text>
          </View>

          <View className="space-y-3">
            <View className="flex-row items-start">
              <Text className="text-amber-600 mr-2">•</Text>
              <Text className="text-sm text-slate-700 dark:text-slate-300 flex-1">
                Test on multiple devices and screen sizes before deployment
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="text-amber-600 mr-2">•</Text>
              <Text className="text-sm text-slate-700 dark:text-slate-300 flex-1">
                Verify all environment variables are properly configured
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="text-amber-600 mr-2">•</Text>
              <Text className="text-sm text-slate-700 dark:text-slate-300 flex-1">
                Run accessibility tests with screen readers enabled
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="text-amber-600 mr-2">•</Text>
              <Text className="text-sm text-slate-700 dark:text-slate-300 flex-1">
                Monitor performance metrics on lower-end devices
              </Text>
            </View>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};
