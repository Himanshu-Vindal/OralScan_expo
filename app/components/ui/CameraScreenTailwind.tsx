import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface CameraScreenProps {
  onCapture: (imageUri: string, quality: QualityCheck) => void;
  onQualityFail: (reason: string) => void;
  onClose: () => void;
  scanType?: 'oral' | 'facial';
}

interface QualityCheck {
  isGood: boolean;
  score: number;
  issues: string[];
  recommendations: string[];
}

interface AlignmentGuide {
  isAligned: boolean;
  distance: 'too_close' | 'too_far' | 'perfect';
  lighting: 'too_dark' | 'too_bright' | 'good';
  blur: 'blurry' | 'sharp';
  mouthVisible: boolean;
}

export default function CameraScreenTailwind({
  onCapture,
  onQualityFail,
  onClose,
  scanType = 'oral'
}: CameraScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [alignment, setAlignment] = useState<AlignmentGuide>({
    isAligned: false,
    distance: 'too_far',
    lighting: 'too_dark',
    blur: 'blurry',
    mouthVisible: false,
  });
  const [autoCapture, setAutoCapture] = useState(true);

  const cameraRef = useRef<CameraView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Mock alignment detection
  useEffect(() => {
    const interval = setInterval(() => {
      const mockAlignment: AlignmentGuide = {
        isAligned: Math.random() > 0.3,
        distance: ['too_close', 'too_far', 'perfect'][Math.floor(Math.random() * 3)] as any,
        lighting: ['too_dark', 'too_bright', 'good'][Math.floor(Math.random() * 3)] as any,
        blur: Math.random() > 0.7 ? 'blurry' : 'sharp',
        mouthVisible: Math.random() > 0.4,
      };
      setAlignment(mockAlignment);

      if (autoCapture && mockAlignment.isAligned && 
          mockAlignment.distance === 'perfect' && 
          mockAlignment.lighting === 'good' && 
          mockAlignment.blur === 'sharp' &&
          mockAlignment.mouthVisible) {
        handleAutoCapture();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [autoCapture]);

  // Pulse animation
  useEffect(() => {
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

  const getHintText = (): string => {
    if (!alignment.mouthVisible) return 'Open your mouth wider';
    if (alignment.distance === 'too_close') return 'Move a bit further away';
    if (alignment.distance === 'too_far') return 'Move a bit closer';
    if (alignment.lighting === 'too_dark') return 'Find better lighting';
    if (alignment.lighting === 'too_bright') return 'Reduce bright light';
    if (alignment.blur === 'blurry') return 'Hold steady';
    if (alignment.isAligned) return 'Perfect! Hold still...';
    return 'Position your face in the oval';
  };

  const getOverlayColorClass = (): string => {
    if (alignment.isAligned && alignment.distance === 'perfect') {
      return 'border-health-excellent';
    }
    if (alignment.distance === 'perfect') {
      return 'border-health-good';
    }
    return 'border-health-warning';
  };

  const handleAutoCapture = async () => {
    if (isCapturing) return;
    
    setIsCapturing(true);
    setCountdown(3);
    
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    await captureImage();
  };

  const handleManualCapture = async () => {
    if (isCapturing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await captureImage();
  };

  const captureImage = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo) {
        const qualityCheck: QualityCheck = {
          isGood: alignment.blur === 'sharp' && alignment.lighting === 'good',
          score: Math.random() * 100,
          issues: alignment.blur === 'blurry' ? ['Image is blurry'] : [],
          recommendations: alignment.lighting !== 'good' ? ['Improve lighting'] : [],
        };

        if (qualityCheck.isGood) {
          onCapture(photo.uri, qualityCheck);
        } else {
          onQualityFail(qualityCheck.issues.join(', '));
        }
      }
    } catch (error) {
      onQualityFail('Failed to capture image');
    } finally {
      setIsCapturing(false);
      setCountdown(0);
    }
  };

  const toggleTorch = () => {
    setTorchEnabled(!torchEnabled);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (!permission?.granted) {
    return (
      <View className="flex-1 bg-black justify-center items-center px-6">
        <Ionicons name="camera-outline" size={48} color="#9CA3AF" />
        <Text className="text-white text-lg text-center mt-4">
          Camera permission required
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="btn-primary mt-6"
        >
          <Text className="text-white text-base font-semibold">
            Enable Camera
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        className="flex-1"
        facing={facing}
        enableTorch={torchEnabled}
      >
        {/* Top Controls */}
        <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center z-10">
          <TouchableOpacity
            onPress={onClose}
            className="bg-black/50 rounded-full p-3"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {/* Show help */}}
            className="bg-black/50 rounded-full p-3"
          >
            <Ionicons name="help-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Alignment Overlay */}
        <View className="absolute inset-0 justify-center items-center">
          <View 
            className={`
              w-60 h-80 rounded-full border-4 border-dashed
              ${getOverlayColorClass()}
              opacity-80 justify-center items-center
            `}
          >
            {/* Corner Guides */}
            <View className={`absolute -top-0.5 -left-0.5 w-5 h-5 border-t-4 border-l-4 ${getOverlayColorClass()} rounded-tl-lg`} />
            <View className={`absolute -top-0.5 -right-0.5 w-5 h-5 border-t-4 border-r-4 ${getOverlayColorClass()} rounded-tr-lg`} />
            <View className={`absolute -bottom-0.5 -left-0.5 w-5 h-5 border-b-4 border-l-4 ${getOverlayColorClass()} rounded-bl-lg`} />
            <View className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 border-b-4 border-r-4 ${getOverlayColorClass()} rounded-br-lg`} />
          </View>
        </View>

        {/* Hint Text */}
        <View className="absolute top-32 left-4 right-4 items-center">
          <View className="bg-black/70 rounded-lg py-3 px-5 animate-pulse">
            <Text className="text-white text-base font-medium text-center">
              {getHintText()}
            </Text>
          </View>
        </View>

        {/* Countdown Overlay */}
        {countdown > 0 && (
          <View className="absolute inset-0 justify-center items-center bg-black/50">
            <Text className="text-white text-6xl font-bold animate-scale-in">
              {countdown}
            </Text>
          </View>
        )}

        {/* Bottom Controls */}
        <View className="absolute bottom-10 left-0 right-0 px-6">
          <View className="flex-row justify-between items-center">
            {/* Torch Button */}
            <TouchableOpacity
              onPress={toggleTorch}
              className={`
                ${torchEnabled ? 'bg-primary-500' : 'bg-white/20'} 
                rounded-full p-4 min-w-touch min-h-touch
              `}
            >
              <Ionicons 
                name={torchEnabled ? "flash" : "flash-off"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>

            {/* Capture Button */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={handleManualCapture}
                disabled={isCapturing}
                className={`
                  w-20 h-20 rounded-full justify-center items-center
                  border-4 border-white shadow-xl
                  ${alignment.isAligned ? 'bg-health-excellent' : 'bg-white'}
                  min-w-touch-large min-h-touch-large
                `}
              >
                {isCapturing ? (
                  <View className="animate-spin">
                    <Ionicons name="sync" size={32} color="white" />
                  </View>
                ) : (
                  <Ionicons 
                    name="camera" 
                    size={32} 
                    color={alignment.isAligned ? 'white' : 'black'} 
                  />
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Auto-capture Toggle */}
            <TouchableOpacity
              onPress={() => setAutoCapture(!autoCapture)}
              className={`
                ${autoCapture ? 'bg-primary-500' : 'bg-white/20'} 
                rounded-full p-4 min-w-touch min-h-touch
              `}
            >
              <Ionicons 
                name={autoCapture ? "timer" : "timer-outline"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>

          {/* Quality Indicators */}
          <View className="flex-row justify-center items-center mt-4 space-x-4">
            <QualityIndicator 
              icon="eye" 
              status={alignment.mouthVisible ? 'good' : 'bad'} 
              label="Mouth" 
            />
            <QualityIndicator 
              icon="resize" 
              status={alignment.distance === 'perfect' ? 'good' : 'warning'} 
              label="Distance" 
            />
            <QualityIndicator 
              icon="sunny" 
              status={alignment.lighting === 'good' ? 'good' : 'warning'} 
              label="Light" 
            />
            <QualityIndicator 
              icon="camera" 
              status={alignment.blur === 'sharp' ? 'good' : 'bad'} 
              label="Focus" 
            />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

// Quality Indicator Component with Tailwind
function QualityIndicator({ 
  icon, 
  status, 
  label 
}: { 
  icon: keyof typeof Ionicons.glyphMap; 
  status: 'good' | 'warning' | 'bad';
  label: string;
}) {
  const getStatusClasses = () => {
    switch (status) {
      case 'good': return {
        border: 'border-health-excellent',
        text: 'text-health-excellent',
        opacity: 'opacity-100'
      };
      case 'warning': return {
        border: 'border-health-warning',
        text: 'text-health-warning',
        opacity: 'opacity-75'
      };
      case 'bad': return {
        border: 'border-health-critical',
        text: 'text-health-critical',
        opacity: 'opacity-60'
      };
    }
  };

  const classes = getStatusClasses();

  return (
    <View className={`items-center ${classes.opacity}`}>
      <View className={`
        bg-black/50 rounded-md p-2 border 
        ${classes.border}
      `}>
        <Ionicons name={icon} size={16} color={
          status === 'good' ? '#10b981' : 
          status === 'warning' ? '#f59e0b' : '#ef4444'
        } />
      </View>
      <Text className={`${classes.text} text-xs mt-1 text-center`}>
        {label}
      </Text>
    </View>
  );
}

// Tailwind Class Examples for Web Version:
/*
Web CSS Classes (for marketing/admin pages):

.camera-overlay {
  @apply absolute inset-0 flex items-center justify-center;
}

.camera-guide {
  @apply w-60 h-80 rounded-full border-4 border-dashed border-primary-500 opacity-80;
}

.camera-hint {
  @apply bg-black/70 backdrop-blur-sm rounded-lg py-3 px-5 animate-pulse;
}

.camera-controls {
  @apply flex justify-between items-center px-6 py-4;
}

.capture-button {
  @apply w-20 h-20 rounded-full bg-white border-4 border-white shadow-xl 
         hover:scale-105 active:scale-95 transition-transform duration-200;
}

.quality-indicator {
  @apply flex flex-col items-center space-y-1;
}

.quality-good {
  @apply border-emerald-500 text-emerald-500;
}

.quality-warning {
  @apply border-amber-500 text-amber-500;
}

.quality-bad {
  @apply border-red-500 text-red-500;
}
*/
