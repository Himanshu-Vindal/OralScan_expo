import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Switch,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightComponent?: React.ReactNode;
  delay?: number;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  rightComponent,
  delay = 0,
}) => {
  const { colors } = useTheme();

  return (
    <Animatable.View
      animation="fadeInUp"
      delay={delay}
      duration={600}
    >
      <TouchableOpacity
        onPress={() => {
          if (onPress) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }
        }}
        disabled={!onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 16,
          paddingHorizontal: 20,
          backgroundColor: colors.surface,
          marginHorizontal: 20,
          marginBottom: 12,
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View style={{
          backgroundColor: colors.primary + '15',
          borderRadius: 12,
          padding: 10,
          marginRight: 16,
        }}>
          <Ionicons name={icon as any} size={22} color={colors.primary} />
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: subtitle ? 4 : 0,
          }}>
            {title}
          </Text>
          {subtitle && (
            <Text style={{
              fontSize: 13,
              color: colors.textSecondary,
              lineHeight: 18,
            }}>
              {subtitle}
            </Text>
          )}
        </View>

        {rightComponent || (showArrow && (
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={colors.textSecondary} 
          />
        ))}
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default function ProfileScreen() {
  const { colors, isDark, theme, setTheme } = useTheme();
  const { t, language, setLanguage, languages } = useLanguage();
  const { user, signOut } = useAuth();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const userName = user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'user@example.com';

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing functionality will be available soon.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Update Profile Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Gallery permission is required to select photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            signOut();
          }
        }
      ]
    );
  };

  const languageOptions = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

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
      >
        {/* Profile Header */}
        <Animatable.View
          animation="fadeInDown"
          duration={800}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 32,
            alignItems: 'center',
          }}
        >
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={{
              borderRadius: 28,
              padding: 4,
              marginBottom: 20,
              shadowColor: '#3B82F6',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 12,
            }}
          >
            <TouchableOpacity
              onPress={handleImagePicker}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 24,
                padding: 2,
              }}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 22,
                  }}
                />
              ) : (
                <View style={{
                  width: 100,
                  height: 100,
                  borderRadius: 22,
                  backgroundColor: colors.primary + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Ionicons name="person" size={48} color={colors.primary} />
                </View>
              )}
              <View style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: colors.primary,
                borderRadius: 12,
                padding: 6,
                borderWidth: 2,
                borderColor: colors.surface,
              }}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </LinearGradient>

          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 6,
            textTransform: 'capitalize',
          }}>
            {userName}
          </Text>
          <Text style={{
            fontSize: 16,
            color: colors.textSecondary,
            marginBottom: 20,
          }}>
            {userEmail}
          </Text>

          <TouchableOpacity
            onPress={handleEditProfile}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Ionicons name="create-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '600',
            }}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Account Settings */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 16,
            paddingHorizontal: 20,
          }}>
            Account
          </Text>

          <SettingItem
            icon="person-circle"
            title="Personal Information"
            subtitle="Manage your personal details and preferences"
            onPress={handleEditProfile}
            delay={100}
          />

          <SettingItem
            icon="shield-checkmark"
            title="Privacy & Security"
            subtitle="Control your privacy settings and security options"
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon')}
            delay={150}
          />

          <SettingItem
            icon="notifications"
            title="Notifications"
            subtitle="Customize your notification preferences"
            onPress={() => Alert.alert('Notifications', 'Notification settings coming soon')}
            delay={200}
          />
        </View>

        {/* App Preferences */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 16,
            paddingHorizontal: 20,
          }}>
            Preferences
          </Text>

          <SettingItem
            icon="moon"
            title="Dark Mode"
            subtitle={`Currently ${isDark ? 'enabled' : 'disabled'}`}
            showArrow={false}
            rightComponent={
              <Switch
                value={theme === 'dark'}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTheme(value ? 'dark' : 'light');
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            }
            delay={250}
          />

          <SettingItem
            icon="language"
            title="Language"
            subtitle={languageOptions.find(lang => lang.code === language)?.name || 'English'}
            onPress={() => setShowLanguageModal(true)}
            delay={300}
          />
        </View>

        {/* Support */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 16,
            paddingHorizontal: 20,
          }}>
            Support
          </Text>

          <SettingItem
            icon="help-circle"
            title="Help & Support"
            subtitle="Get help and contact our support team"
            onPress={() => Alert.alert('Help', 'Support center coming soon')}
            delay={350}
          />

          <SettingItem
            icon="document-text"
            title="Terms & Conditions"
            subtitle="Read our terms of service and policies"
            onPress={() => Alert.alert('Terms', 'Terms & conditions coming soon')}
            delay={400}
          />

          <SettingItem
            icon="information-circle"
            title="About"
            subtitle="App version 1.0.0"
            onPress={() => Alert.alert('About', 'OralScan v1.0.0\nAI-powered oral health analysis')}
            delay={450}
          />
        </View>

        {/* Sign Out */}
        <Animatable.View
          animation="fadeInUp"
          delay={500}
          duration={600}
          style={{ paddingHorizontal: 20, marginBottom: 20 }}
        >
          <TouchableOpacity
            onPress={handleSignOut}
            style={{
              backgroundColor: '#EF4444',
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              shadowColor: '#EF4444',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '600',
            }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}>
          <Animatable.View
            animation="slideInUp"
            duration={300}
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 20,
              paddingBottom: 40,
              maxHeight: '70%',
            }}
          >
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: colors.text,
              }}>
                Select Language
              </Text>
              <TouchableOpacity
                onPress={() => setShowLanguageModal(false)}
                style={{
                  backgroundColor: colors.border,
                  borderRadius: 16,
                  padding: 8,
                }}
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {languageOptions.map((lang, index) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setLanguage(lang.code as any);
                    setShowLanguageModal(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    backgroundColor: language === lang.code ? colors.primary + '15' : 'transparent',
                    marginHorizontal: 20,
                    borderRadius: 12,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontSize: 24, marginRight: 16 }}>
                    {lang.flag}
                  </Text>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: language === lang.code ? '600' : '500',
                    color: language === lang.code ? colors.primary : colors.text,
                    flex: 1,
                  }}>
                    {lang.name}
                  </Text>
                  {language === lang.code && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animatable.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
