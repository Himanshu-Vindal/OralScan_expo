import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface ScanStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
}

export default function ScanScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [isScanning, setIsScanning] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  
  const cameraRef = useRef<CameraView>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const scanSteps: ScanStep[] = [
    {
      id: 1,
      title: 'Position Your Face',
      description: 'Align your face within the oval guide',
      icon: 'person-circle-outline',
      completed: false
    },
    {
      id: 2,
      title: 'Open Your Mouth',
      description: 'Open wide to show your teeth clearly',
      icon: 'happy-outline',
      completed: false
    },
    {
      id: 3,
      title: 'Hold Still',
      description: 'Keep steady while we analyze',
      icon: 'checkmark-circle-outline',
      completed: false
    }
  ];

  useEffect(() => {
    // Pulse animation for capture button
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const handleCameraPermission = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access to scan your oral health.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => console.log('Open settings') }
          ]
        );
        return false;
      }
    }
    return true;
  };

  const startScan = async () => {
    const hasPermission = await handleCameraPermission();
    if (!hasPermission) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsScanning(true);
    setScanProgress(0);
    setCurrentStep(0);

    // Simulate scanning process with real API call
    const steps = [0, 33, 66, 100];
    for (let i = 0; i < steps.length; i++) {
      setTimeout(() => {
        setScanProgress(steps[i]);
        setCurrentStep(i);
        
        Animated.timing(progressAnim, {
          toValue: steps[i] / 100,
          duration: 800,
          useNativeDriver: false,
        }).start();

        if (i === steps.length - 1) {
          setTimeout(() => {
            setIsScanning(false);
            setShowResults(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }, 1000);
        }
      }, i * 2000);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        
        if (photo && photo.base64) {
          await analyzeImage(photo.base64);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const analyzeImage = async (imageBase64: string) => {
    setIsScanning(true);
    setScanProgress(0);
    setCurrentStep(0);

    try {
      // Update progress to show analysis starting
      setScanProgress(25);
      setCurrentStep(1);

      // Mock analysis for now - replace with backend API later
      const mockResponse = {
        success: true,
        data: {
          overallScore: 85,
          analysis: {
            gums: { score: 90, status: 'healthy', issues: [] },
            teeth: { score: 80, status: 'good', issues: ['Minor plaque'] },
            overall: { score: 85, status: 'good', issues: ['Regular cleaning needed'] }
          },
          recommendations: ['Brush twice daily', 'Use mouthwash', 'Regular dental checkups']
        }
      };

      setScanProgress(75);
      setCurrentStep(2);

      if (!mockResponse.success) {
        throw new Error('Analysis failed');
      }

      // Complete the analysis
      setScanProgress(100);
      setCurrentStep(3);

      // Store the results
      setScanResults(mockResponse.data);
      
      // Show results after a brief delay
      setTimeout(() => {
        setIsScanning(false);
        setShowResults(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Store the analysis result for dashboard
        if (mockResponse.data) {
          // You can store this in AsyncStorage or context for later use
          console.log('Analysis result:', mockResponse.data);
        }
      }, 1000);

    } catch (error) {
      setIsScanning(false);
      Alert.alert(
        'Analysis Failed', 
        error instanceof Error ? error.message : 'Failed to analyze image. Please try again.',
        [
          { text: 'OK', style: 'default' }
        ]
      );
    }
  };

  const selectFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Gallery access is required to select photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      await analyzeImage(result.assets[0].base64);
    }
  };

  const handleResults = () => {
    setShowResults(false);
    router.push('/dashboard');
  };

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-medical-50 dark:bg-slate-900">
        <View className="flex-1 justify-center items-center p-5">
          <Ionicons name="camera-outline" size={64} color={colors.textSecondary} />
          <Text className="text-lg text-slate-900 dark:text-white text-center mt-4">
            Loading camera...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-medical-50 dark:bg-slate-900">
        <View className="flex-1 justify-center items-center p-5">
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            className="rounded-[32px] p-5 mb-6"
          >
            <Ionicons name="camera-outline" size={48} color="#FFFFFF" />
          </LinearGradient>
          
          <Text className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-3">
            Camera Access Required
          </Text>
          
          <Text className="text-base text-slate-600 dark:text-slate-400 text-center leading-6 mb-8">
            We need camera access to analyze your oral health. Your privacy is protected - photos are processed locally.
          </Text>
          
          <TouchableOpacity
            onPress={requestPermission}
            className="btn-primary shadow-medical"
          >
            <Text className="text-white text-base font-semibold">
              Enable Camera
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 pt-15 px-5 pb-5">
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent']}
          className="absolute top-0 left-0 right-0 h-30"
        />
        
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.push('/')}
            className="bg-white/20 rounded-[20px] p-3"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text className="text-lg font-bold text-white">
            Oral Health Scan
          </Text>
          
          <TouchableOpacity
            onPress={() => setShowInstructions(true)}
            className="bg-white/20 rounded-[20px] p-3"
          >
            <Ionicons name="help-circle" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        className="flex-1"
        facing={facing}
      >
        {/* Face Guide Overlay */}
        <View 
          className="absolute left-0 right-0 justify-center items-center"
          style={{
            top: height * 0.15,
            bottom: height * 0.25,
          }}
        >
          {/* Main oval guide */}
          <View 
            className={`justify-center items-center relative border-3 border-dashed ${
              isScanning ? 'border-health-excellent' : 'border-white'
            }`}
            style={{
              width: width * 0.7,
              height: width * 0.9,
              borderRadius: width * 0.35,
            }}
          >
            {/* Corner guides */}
            <View 
              className={`absolute -top-0.5 -left-0.5 w-7.5 h-7.5 border-t-4 border-l-4 rounded-tl-2xl ${
                isScanning ? 'border-health-excellent' : 'border-white'
              }`}
            />
            <View 
              className={`absolute -top-0.5 -right-0.5 w-7.5 h-7.5 border-t-4 border-r-4 rounded-tr-2xl ${
                isScanning ? 'border-health-excellent' : 'border-white'
              }`}
            />
            <View 
              className={`absolute -bottom-0.5 -left-0.5 w-7.5 h-7.5 border-b-4 border-l-4 rounded-bl-2xl ${
                isScanning ? 'border-health-excellent' : 'border-white'
              }`}
            />
            <View 
              className={`absolute -bottom-0.5 -right-0.5 w-7.5 h-7.5 border-b-4 border-r-4 rounded-br-2xl ${
                isScanning ? 'border-health-excellent' : 'border-white'
              }`}
            />

            {/* Center instruction */}
            {!isScanning && (
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                duration={2000}
                className="bg-black/70 px-5 py-3 rounded-[20px] items-center"
              >
                <Ionicons name="person-outline" size={32} color="#FFFFFF" className="mb-2" />
                <Text className="text-white text-base font-semibold text-center">
                  Position your face here
                </Text>
                <Text className="text-white/80 text-xs text-center mt-1">
                  Keep your mouth open
                </Text>
              </Animatable.View>
            )}

            {/* Quality indicators */}
            {!isScanning && (
              <View 
                className="absolute bg-health-excellent/90 px-3 py-1.5 rounded-xl flex-row items-center"
                style={{
                  top: -40,
                  left: '50%',
                  marginLeft: -30,
                }}
              >
                <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                <Text className="text-white text-xs ml-1 font-semibold">
                  Good Light
                </Text>
              </View>
            )}
          </View>

          {/* Tips overlay */}
          {!isScanning && (
            <Animatable.View
              animation="fadeInUp"
              delay={1000}
              className="absolute -bottom-15 left-5 right-5 bg-black/80 rounded-2xl p-4"
            >
              <Text className="text-white text-sm text-center leading-5">
                💡 <Text className="font-semibold">Tip:</Text> Ensure good lighting and keep your device steady
              </Text>
            </Animatable.View>
          )}
        </View>

        {/* Scanning Progress */}
        {isScanning && (
          <Animatable.View
            animation="fadeIn"
            className="absolute left-5 right-5 items-center"
            style={{ top: height * 0.15 }}
          >
            <View className="bg-black/80 rounded-2xl p-5 items-center min-w-[200px]">
              <Text className="text-white text-lg font-bold mb-3">
                {scanSteps[currentStep]?.title || 'Analyzing...'}
              </Text>
              
              <View className="w-37.5 h-1.5 bg-white/30 rounded-full mb-2">
                <Animated.View
                  className="h-full bg-health-excellent rounded-full"
                  style={{
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  }}
                />
              </View>
              
              <Text className="text-white/80 text-sm text-center">
                {scanProgress}% Complete
              </Text>
            </View>
          </Animatable.View>
        )}
      </CameraView>

      {/* Bottom Controls */}
      <View 
        className="absolute bottom-0 left-0 right-0 px-5"
        style={{
          paddingBottom: Platform.OS === 'android' 
            ? Math.max(insets.bottom, 16) + 120  // Tab bar height + extra spacing
            : Math.max(insets.bottom, 8) + 120,   // Tab bar height + extra spacing
        }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          className="absolute bottom-0 left-0 right-0 h-50"
        />
        
        <View className="flex-row justify-between items-center pt-7.5">
          {/* Gallery Button */}
          <Animatable.View
            animation={isScanning ? "pulse" : undefined}
            iterationCount="infinite"
            duration={2000}
          >
            <TouchableOpacity
              onPress={selectFromGallery}
              disabled={isScanning}
              className={`${
                isScanning ? 'bg-white/10 opacity-50' : 'bg-white/20'
              } rounded-[25px] p-5 border-2 border-white/30`}
            >
              <Ionicons name="images" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </Animatable.View>

          {/* Capture Button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              onPress={takePicture}
              disabled={isScanning}
              className={`w-22.5 h-22.5 rounded-full ${
                isScanning ? 'bg-health-excellent border-white' : 'bg-white border-white/30'
              } justify-center items-center border-6 shadow-xl`}
            >
              {isScanning ? (
                <Animatable.View
                  animation="rotate"
                  iterationCount="infinite"
                  duration={2000}
                >
                  <Ionicons name="sync" size={36} color="#FFFFFF" />
                </Animatable.View>
              ) : (
                <View className="w-17.5 h-17.5 rounded-full bg-black justify-center items-center">
                  <Ionicons name="camera" size={32} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Flip Camera Button */}
          <Animatable.View
            animation={isScanning ? "pulse" : undefined}
            iterationCount="infinite"
            duration={2000}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFacing(current => (current === 'back' ? 'front' : 'back'));
              }}
              disabled={isScanning}
              className={`${
                isScanning ? 'bg-white/10 opacity-50' : 'bg-white/20'
              } rounded-[25px] p-5 border-2 border-white/30`}
            >
              <Ionicons name="camera-reverse" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </Animatable.View>
        </View>

        {/* Control Labels */}
        <View className="flex-row justify-between items-center mt-3 px-2.5">
          <Text className="text-white/80 text-xs font-medium text-center w-[70px]">
            Gallery
          </Text>
          <Text className="text-white/90 text-sm font-semibold text-center w-[90px]">
            {isScanning ? 'Analyzing...' : 'Capture'}
          </Text>
          <Text className="text-white/80 text-xs font-medium text-center w-[70px]">
            Flip
          </Text>
        </View>
      </View>

      {/* Instructions Modal */}
      <Modal
        visible={showInstructions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInstructions(false)}
      >
        <View className="flex-1 bg-black/80 justify-end">
          <Animatable.View
            animation="slideInUp"
            duration={300}
            className="card-medical rounded-t-3xl pt-5 pb-10 px-5"
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-900 dark:text-white">
                Scan Instructions
              </Text>
              <TouchableOpacity
                onPress={() => setShowInstructions(false)}
                className="bg-medical-200 dark:bg-slate-700 rounded-2xl p-2"
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            {scanSteps.map((step, index) => (
              <View
                key={step.id}
                className={`flex-row items-center py-4 ${
                  index < scanSteps.length - 1 ? 'border-b border-medical-200 dark:border-slate-700' : ''
                }`}
              >
                <View className="bg-primary-500/20 rounded-2xl p-3 mr-4">
                  <Ionicons name={step.icon as any} size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                    {step.title}
                  </Text>
                  <Text className="text-sm text-slate-600 dark:text-slate-400 leading-5">
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={() => setShowInstructions(false)}
              className="btn-primary mt-6"
            >
              <Text className="text-white text-base font-semibold">
                Got It
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>

      {/* Results Modal */}
      <Modal
        visible={showResults}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResults(false)}
      >
        <View className="flex-1 bg-black/90 justify-center items-center p-5">
          <Animatable.View
            animation="zoomIn"
            duration={500}
            className="card-medical rounded-3xl p-8 items-center w-full max-w-[320px]"
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              className="rounded-[32px] p-4 mb-6"
            >
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </LinearGradient>

            <Text className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-3">
              Scan Complete!
            </Text>

            <Text className="text-base text-slate-600 dark:text-slate-400 text-center leading-6 mb-8">
              Your oral health analysis is ready. View your results in the dashboard.
            </Text>

            <TouchableOpacity
              onPress={handleResults}
              className="btn-primary w-full"
            >
              <Text className="text-white text-base font-semibold">
                View Results
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
