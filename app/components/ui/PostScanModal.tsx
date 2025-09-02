import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface PostScanModalProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
  onRetake: () => void;
  onContinue: (analysisResult: AnalysisResult) => void;
}

interface QualityMetrics {
  clarity: number;
  lighting: number;
  positioning: number;
  overall: number;
}

interface AnalysisResult {
  score: number;
  category: 'excellent' | 'good' | 'fair' | 'poor';
  insights: string[];
  recommendations: string[];
  riskFactors: string[];
  nextSteps: string[];
}

const { width } = Dimensions.get('window');

export default function PostScanModal({
  visible,
  imageUri,
  onClose,
  onRetake,
  onContinue,
}: PostScanModalProps) {
  const [currentStep, setCurrentStep] = useState<'quality' | 'analyzing' | 'results'>('quality');
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics>({
    clarity: 0,
    lighting: 0,
    positioning: 0,
    overall: 0,
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Animate modal entrance
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Start quality check simulation
      simulateQualityCheck();
    } else {
      slideAnim.setValue(0);
      scaleAnim.setValue(0.8);
      setCurrentStep('quality');
      setAnalysisProgress(0);
    }
  }, [visible]);

  const simulateQualityCheck = async () => {
    // Animate quality metrics
    const metrics = {
      clarity: Math.random() * 40 + 60, // 60-100%
      lighting: Math.random() * 30 + 70, // 70-100%
      positioning: Math.random() * 20 + 80, // 80-100%
      overall: 0,
    };
    metrics.overall = (metrics.clarity + metrics.lighting + metrics.positioning) / 3;

    for (const [key, value] of Object.entries(metrics)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setQualityMetrics(prev => ({ ...prev, [key]: value }));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Wait then proceed to analysis
    setTimeout(() => {
      if (metrics.overall >= 75) {
        setCurrentStep('analyzing');
        simulateAnalysis();
      } else {
        // Quality too low - show retry option
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }, 1000);
  };

  const simulateAnalysis = async () => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    }).start();

    // Update progress text
    const steps = [
      'Preprocessing image...',
      'Detecting oral features...',
      'Analyzing dental health...',
      'Generating insights...',
      'Finalizing report...',
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress((i + 1) / steps.length * 100);
    }

    // Generate mock results
    const mockResult: AnalysisResult = {
      score: Math.floor(Math.random() * 30 + 70), // 70-100
      category: 'good',
      insights: [
        'Good overall oral hygiene detected',
        'Teeth alignment appears normal',
        'No visible signs of decay',
      ],
      recommendations: [
        'Continue regular brushing twice daily',
        'Consider using fluoride mouthwash',
        'Schedule routine dental checkup',
      ],
      riskFactors: [
        'Minor plaque buildup detected',
      ],
      nextSteps: [
        'Book professional cleaning',
        'Monitor daily oral care routine',
      ],
    };

    // Set category based on score
    if (mockResult.score >= 90) mockResult.category = 'excellent';
    else if (mockResult.score >= 80) mockResult.category = 'good';
    else if (mockResult.score >= 70) mockResult.category = 'fair';
    else mockResult.category = 'poor';

    setAnalysisResult(mockResult);
    setCurrentStep('results');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-health-excellent';
    if (score >= 80) return 'text-health-good';
    if (score >= 70) return 'text-health-warning';
    return 'text-health-critical';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 90) return 'bg-health-excellent';
    if (score >= 80) return 'bg-health-good';
    if (score >= 70) return 'bg-health-warning';
    return 'bg-health-critical';
  };

  const renderQualityCheck = () => (
    <View className="flex-1 justify-center items-center px-6">
      <View className="bg-white dark:bg-medical-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <View className="items-center mb-6">
          <View className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-4 mb-4">
            <Ionicons name="checkmark-circle" size={32} color="#3b82f6" />
          </View>
          <Text className="text-xl font-bold text-medical-900 dark:text-medical-100 text-center">
            Quality Check
          </Text>
          <Text className="text-medical-600 dark:text-medical-400 text-center mt-2">
            Analyzing image quality...
          </Text>
        </View>

        <View className="space-y-4">
          <QualityMetric label="Image Clarity" value={qualityMetrics.clarity} />
          <QualityMetric label="Lighting" value={qualityMetrics.lighting} />
          <QualityMetric label="Positioning" value={qualityMetrics.positioning} />
          <View className="border-t border-medical-200 dark:border-medical-700 pt-4">
            <QualityMetric 
              label="Overall Quality" 
              value={qualityMetrics.overall} 
              isOverall 
            />
          </View>
        </View>

        {qualityMetrics.overall > 0 && qualityMetrics.overall < 75 && (
          <View className="mt-6 p-4 bg-health-warning/10 rounded-lg border border-health-warning/20">
            <Text className="text-health-warning font-medium text-center">
              Image quality could be improved
            </Text>
            <TouchableOpacity
              onPress={onRetake}
              className="bg-health-warning rounded-lg py-3 px-6 mt-3"
            >
              <Text className="text-white font-semibold text-center">
                Retake Photo
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const renderAnalyzing = () => (
    <View className="flex-1 justify-center items-center px-6">
      <View className="bg-white dark:bg-medical-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <View className="items-center mb-6">
          <View className="bg-gradient-to-r from-primary-500 to-accent-cyan rounded-full p-4 mb-4">
            <Ionicons name="analytics" size={32} color="white" />
          </View>
          <Text className="text-xl font-bold text-medical-900 dark:text-medical-100 text-center">
            AI Analysis
          </Text>
          <Text className="text-medical-600 dark:text-medical-400 text-center mt-2">
            Our AI is analyzing your oral health
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="mb-6">
          <View className="bg-medical-200 dark:bg-medical-700 rounded-full h-2 overflow-hidden">
            <Animated.View
              className="bg-gradient-to-r from-primary-500 to-accent-cyan h-full rounded-full"
              style={{
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              }}
            />
          </View>
          <Text className="text-medical-600 dark:text-medical-400 text-sm text-center mt-2">
            {Math.round(analysisProgress)}% complete
          </Text>
        </View>

        {/* Animated Dots */}
        <View className="flex-row justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"
              style={{
                animationDelay: `${index * 200}ms`,
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );

  const renderResults = () => {
    if (!analysisResult) return null;

    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4">
          {/* Header */}
          <View className="bg-white dark:bg-medical-800 rounded-2xl p-6 mb-4 shadow-lg">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-2xl font-bold text-medical-900 dark:text-medical-100">
                  Health Score
                </Text>
                <Text className="text-medical-600 dark:text-medical-400">
                  Based on AI analysis
                </Text>
              </View>
              <View className="items-center">
                <View className={`
                  w-16 h-16 rounded-full justify-center items-center
                  ${getScoreBgColor(analysisResult.score)}
                `}>
                  <Text className="text-white text-xl font-bold">
                    {analysisResult.score}
                  </Text>
                </View>
                <Text className={`
                  text-sm font-medium mt-1 capitalize
                  ${getScoreColor(analysisResult.score)}
                `}>
                  {analysisResult.category}
                </Text>
              </View>
            </View>
          </View>

          {/* Image Preview */}
          <View className="bg-white dark:bg-medical-800 rounded-2xl p-4 mb-4 shadow-lg">
            <Text className="text-lg font-semibold text-medical-900 dark:text-medical-100 mb-3">
              Captured Image
            </Text>
            <Image
              source={{ uri: imageUri }}
              className="w-full h-48 rounded-lg"
              resizeMode="cover"
            />
          </View>

          {/* Insights */}
          <ResultSection
            title="Key Insights"
            icon="lightbulb"
            items={analysisResult.insights}
            color="primary"
          />

          {/* Recommendations */}
          <ResultSection
            title="Recommendations"
            icon="checkmark-circle"
            items={analysisResult.recommendations}
            color="health-good"
          />

          {/* Risk Factors */}
          {analysisResult.riskFactors.length > 0 && (
            <ResultSection
              title="Areas to Watch"
              icon="warning"
              items={analysisResult.riskFactors}
              color="health-warning"
            />
          )}

          {/* Next Steps */}
          <ResultSection
            title="Next Steps"
            icon="arrow-forward"
            items={analysisResult.nextSteps}
            color="accent-cyan"
          />

          {/* Action Buttons */}
          <View className="mt-6 space-y-3">
            <TouchableOpacity
              onPress={() => onContinue(analysisResult)}
              className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl py-4 px-6 shadow-lg"
            >
              <Text className="text-white text-lg font-semibold text-center">
                Save Results
              </Text>
            </TouchableOpacity>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={onRetake}
                className="flex-1 bg-medical-200 dark:bg-medical-700 rounded-xl py-3 px-4"
              >
                <Text className="text-medical-700 dark:text-medical-300 font-medium text-center">
                  Retake
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {/* Share results */}}
                className="flex-1 bg-medical-200 dark:bg-medical-700 rounded-xl py-3 px-4"
              >
                <Text className="text-medical-700 dark:text-medical-300 font-medium text-center">
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="h-8" />
        </View>
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <Animated.View
          className="flex-1"
          style={{
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
              { scale: scaleAnim },
            ],
            opacity: slideAnim,
          }}
        >
          {/* Header */}
          <View className="bg-white dark:bg-medical-900 pt-12 pb-4 px-6 shadow-lg">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-medical-900 dark:text-medical-100">
                Scan Analysis
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="bg-medical-100 dark:bg-medical-800 rounded-full p-2"
              >
                <Ionicons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Progress Steps */}
            <View className="flex-row items-center justify-center mt-4 space-x-4">
              <StepIndicator 
                step={1} 
                label="Quality" 
                active={currentStep === 'quality'} 
                completed={currentStep !== 'quality'} 
              />
              <View className="w-8 h-0.5 bg-medical-300 dark:bg-medical-600" />
              <StepIndicator 
                step={2} 
                label="Analysis" 
                active={currentStep === 'analyzing'} 
                completed={currentStep === 'results'} 
              />
              <View className="w-8 h-0.5 bg-medical-300 dark:bg-medical-600" />
              <StepIndicator 
                step={3} 
                label="Results" 
                active={currentStep === 'results'} 
                completed={false} 
              />
            </View>
          </View>

          {/* Content */}
          <View className="flex-1 bg-medical-50 dark:bg-medical-900">
            {currentStep === 'quality' && renderQualityCheck()}
            {currentStep === 'analyzing' && renderAnalyzing()}
            {currentStep === 'results' && renderResults()}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// Helper Components
function QualityMetric({ 
  label, 
  value, 
  isOverall = false 
}: { 
  label: string; 
  value: number; 
  isOverall?: boolean; 
}) {
  const getColor = (val: number) => {
    if (val >= 80) return 'text-health-excellent';
    if (val >= 70) return 'text-health-good';
    if (val >= 60) return 'text-health-warning';
    return 'text-health-critical';
  };

  return (
    <View className="flex-row items-center justify-between">
      <Text className={`
        ${isOverall ? 'font-semibold' : 'font-medium'} 
        text-medical-700 dark:text-medical-300
      `}>
        {label}
      </Text>
      <Text className={`
        ${isOverall ? 'text-lg font-bold' : 'font-medium'} 
        ${getColor(value)}
      `}>
        {Math.round(value)}%
      </Text>
    </View>
  );
}

function StepIndicator({ 
  step, 
  label, 
  active, 
  completed 
}: { 
  step: number; 
  label: string; 
  active: boolean; 
  completed: boolean; 
}) {
  return (
    <View className="items-center">
      <View className={`
        w-8 h-8 rounded-full justify-center items-center border-2
        ${completed ? 'bg-primary-500 border-primary-500' : 
          active ? 'border-primary-500 bg-white dark:bg-medical-800' : 
          'border-medical-300 dark:border-medical-600 bg-white dark:bg-medical-800'}
      `}>
        {completed ? (
          <Ionicons name="checkmark" size={16} color="white" />
        ) : (
          <Text className={`
            text-xs font-bold
            ${active ? 'text-primary-500' : 'text-medical-400 dark:text-medical-500'}
          `}>
            {step}
          </Text>
        )}
      </View>
      <Text className={`
        text-xs mt-1
        ${active || completed ? 'text-primary-500 font-medium' : 'text-medical-400 dark:text-medical-500'}
      `}>
        {label}
      </Text>
    </View>
  );
}

function ResultSection({ 
  title, 
  icon, 
  items, 
  color 
}: { 
  title: string; 
  icon: keyof typeof Ionicons.glyphMap; 
  items: string[]; 
  color: string; 
}) {
  return (
    <View className="bg-white dark:bg-medical-800 rounded-2xl p-4 mb-4 shadow-lg">
      <View className="flex-row items-center mb-3">
        <View className={`bg-${color}/10 rounded-lg p-2 mr-3`}>
          <Ionicons name={icon} size={20} color={
            color === 'primary' ? '#3b82f6' :
            color === 'health-good' ? '#10b981' :
            color === 'health-warning' ? '#f59e0b' :
            color === 'accent-cyan' ? '#06b6d4' : '#64748b'
          } />
        </View>
        <Text className="text-lg font-semibold text-medical-900 dark:text-medical-100">
          {title}
        </Text>
      </View>
      {items.map((item, index) => (
        <View key={index} className="flex-row items-start mb-2">
          <View className="w-1.5 h-1.5 bg-medical-400 dark:bg-medical-500 rounded-full mt-2 mr-3" />
          <Text className="flex-1 text-medical-700 dark:text-medical-300 leading-5">
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}
