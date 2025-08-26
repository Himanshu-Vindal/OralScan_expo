import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../../lib/api-client';

const { width, height } = Dimensions.get('window');

const CameraOverlay = ({ onCapture, isCapturing }: { onCapture: () => void; isCapturing: boolean }) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateCapture = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCapture = () => {
    if (!isCapturing) {
      animateCapture();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onCapture();
    }
  };

  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      
      {/* Camera Guide */}
      <View style={{
        position: 'absolute',
        top: -120,
        left: width * 0.1,
        right: width * 0.1,
        height: 100,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 20,
        backgroundColor: 'transparent',
      }}>
        <View style={{
          position: 'absolute',
          top: -30,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          }}>
            <Text style={{
              color: 'white',
              fontSize: 12,
              fontWeight: '600',
            }}>
              Position your mouth here
            </Text>
          </View>
        </View>
        
        {/* Corner indicators */}
        {[0, 1, 2, 3].map((corner) => (
          <View
            key={corner}
            style={{
              position: 'absolute',
              width: 20,
              height: 20,
              borderColor: colors.primary,
              ...(corner === 0 && { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4 }),
              ...(corner === 1 && { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4 }),
              ...(corner === 2 && { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4 }),
              ...(corner === 3 && { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4 }),
            }}
          />
        ))}
      </View>

      {/* Capture Button */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={handleCapture}
          disabled={isCapturing}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 4,
            borderColor: colors.primary,
            opacity: isCapturing ? 0.6 : 1,
          }}
        >
          {isCapturing ? (
            <Animatable.View
              animation="rotate"
              iterationCount="infinite"
              duration={1000}
            >
              <Ionicons name="hourglass" size={32} color={colors.primary} />
            </Animatable.View>
          ) : (
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: colors.primary,
            }} />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const InstructionsModal = ({ 
  visible, 
  onClose, 
  onStart 
}: { 
  visible: boolean; 
  onClose: () => void; 
  onStart: () => void; 
}) => {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();

  const instructions = [
    {
      icon: 'sunny',
      title: t('instruction1'),
      description: 'Natural lighting works best for accurate analysis',
    },
    {
      icon: 'camera',
      title: t('instruction2'),
      description: 'Keep your device steady and follow the on-screen guide',
    },
    {
      icon: 'happy',
      title: t('instruction3'),
      description: 'Relax your jaw and keep your mouth naturally open',
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
      }}>
        <Animatable.View
          animation="slideInUp"
          duration={300}
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 40,
            maxHeight: height * 0.7,
          }}
        >
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: colors.onBackground,
            }}>
              {t('scanInstructions')}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.surface,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="close" size={20} color={colors.onSurface} />
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          {instructions.map((instruction, index) => (
            <Animatable.View
              key={index}
              animation="fadeInUp"
              delay={index * 100}
              duration={600}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.primary + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}>
                <Ionicons name={instruction.icon as any} size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.onSurface,
                  marginBottom: 4,
                }}>
                  {instruction.title}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: colors.onSurface,
                  opacity: 0.7,
                  lineHeight: 18,
                }}>
                  {instruction.description}
                </Text>
              </View>
            </Animatable.View>
          ))}

          {/* Start Button */}
          <TouchableOpacity
            onPress={onStart}
            style={{
              marginTop: 8,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{
                color: 'white',
                fontSize: 18,
                fontWeight: '700',
              }}>
                {t('startScan')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </Modal>
  );
};

const LoadingOverlay = ({ visible, progress }: { visible: boolean; progress: string }) => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  if (!visible) return null;

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <Animatable.View
        animation="fadeIn"
        duration={300}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 32,
          alignItems: 'center',
          marginHorizontal: 40,
        }}
      >
        <Animatable.View
          animation="rotate"
          iterationCount="infinite"
          duration={2000}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            borderWidth: 4,
            borderColor: colors.primary,
            borderTopColor: 'transparent',
            marginBottom: 20,
          }}
        />
        
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: colors.onSurface,
          marginBottom: 8,
          textAlign: 'center',
        }}>
          {t('analyzingImage')}
        </Text>
        
        <Text style={{
          fontSize: 14,
          color: colors.onSurface,
          opacity: 0.7,
          textAlign: 'center',
          lineHeight: 20,
        }}>
          {progress}
        </Text>
      </Animatable.View>
    </View>
  );
};

export default function ScanScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [showInstructions, setShowInstructions] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (!cameraRef.current || isAnalyzing) return;

    try {
      setIsAnalyzing(true);
      setAnalysisProgress(t('pleaseWait'));

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      if (photo?.base64) {
        setAnalysisProgress('Processing image...');
        
        const response = await apiClient.analyzeOralHealth(
          photo.base64,
          'Unknown',
          'en',
          user?.id,
          {}
        );

        if (response.data) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          // Navigate to results or show success
          Alert.alert('Analysis Complete', 'Your oral health analysis is ready!');
        } else {
          throw new Error(response.error || t('analysisError'));
        }
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t('error'), error instanceof Error ? error.message : t('cameraError'));
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  const selectFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.base64) {
      setIsAnalyzing(true);
      setAnalysisProgress('Analyzing selected image...');
      
      try {
        const response = await apiClient.analyzeOralHealth(
          result.assets[0].base64,
          'Unknown',
          'en',
          user?.id,
          {}
        );

        if (response.data) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert('Analysis Complete', 'Your oral health analysis is ready!');
        } else {
          throw new Error(response.error || t('analysisError'));
        }
      } catch (error) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(t('error'), error instanceof Error ? error.message : t('analysisError'));
      } finally {
        setIsAnalyzing(false);
        setAnalysisProgress('');
      }
    }
  };

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 40,
        }}>
          <Animatable.View
            animation="fadeIn"
            duration={800}
            style={{ alignItems: 'center' }}
          >
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: colors.primary + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 32,
            }}>
              <Ionicons name="camera" size={60} color={colors.primary} />
            </View>
            
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: colors.onBackground,
              textAlign: 'center',
              marginBottom: 16,
            }}>
              {t('permission')}
            </Text>
            
            <Text style={{
              fontSize: 16,
              color: colors.onBackground,
              opacity: 0.7,
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: 32,
            }}>
              {t('cameraPermissionRequired')}
            </Text>
            
            <TouchableOpacity
              onPress={requestPermission}
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                minWidth: 200,
              }}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 32,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  {t('grantPermission')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
      >
        {/* Top Controls */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 20,
          zIndex: 100,
        }}>
          <TouchableOpacity
            onPress={() => setShowInstructions(true)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="help" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Camera Overlay */}
        <CameraOverlay onCapture={takePicture} isCapturing={isAnalyzing} />

        {/* Gallery Button */}
        <TouchableOpacity
          onPress={selectFromGallery}
          style={{
            position: 'absolute',
            bottom: 60,
            left: 40,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: 'rgba(255,255,255,0.9)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="images" size={28} color={colors.primary} />
        </TouchableOpacity>
      </CameraView>

      {/* Instructions Modal */}
      <InstructionsModal
        visible={showInstructions}
        onClose={() => setShowInstructions(false)}
        onStart={() => setShowInstructions(false)}
      />

      {/* Loading Overlay */}
      <LoadingOverlay visible={isAnalyzing} progress={analysisProgress} />
    </SafeAreaView>
  );
}
