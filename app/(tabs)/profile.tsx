import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Switch,
  StatusBar,
  Platform,
  TextInput,
} from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext'; 
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import TopNavigation from '../components/TopNavigation';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightComponent?: React.ReactNode;
  delay?: number;
  iconColor?: string;
  iconBackground?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  rightComponent,
  delay = 0,
  iconColor,
  iconBackground,
}) => {
  const { colors } = useTheme();

  return (
    <Animatable.View
      animation="fadeInUp"
      delay={delay}
      duration={600}
      className="mx-5 my-1.5"
    >
      <TouchableOpacity
        onPress={() => {
          if (onPress) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }
        }}
        disabled={!onPress}
        className="card-medical p-5 flex-row items-center"
        activeOpacity={onPress ? 0.7 : 1}
      >
        <View 
          className="w-12 h-12 rounded-xl items-center justify-center mr-4"
          style={{
            backgroundColor: iconBackground || colors.primary + '20',
          }}
        >
          <Ionicons 
            name={icon as any} 
            size={22} 
            color={iconColor || colors.primary} 
          />
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm text-slate-600 dark:text-slate-400 leading-5">
              {subtitle}
            </Text>
          )}
        </View>

        {rightComponent || (showArrow && onPress && (
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
  const { colors, isDark, setTheme } = useTheme();
  const { t, language, setLanguage, languages } = useLanguage();
  const { user, signOut, updateProfile, uploadAvatar } = useAuth();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editedName, setEditedName] = useState(user?.fullName || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');

  const handleAvatarPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Gallery access is required to change avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        const avatarUrl = await uploadAvatar(result.assets[0].uri);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert('Success', 'Avatar updated successfully!');
      } catch (error: any) {
        console.error('Avatar upload error:', error);
        Alert.alert('Error', error.message || 'Failed to upload avatar');
      }
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
          onPress: async () => {
            await signOut();
          }
        }
      ]
    );
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        fullName: editedName,
        email: editedEmail,
      });
      setShowEditProfile(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      console.error('Profile save error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-medical-50 dark:bg-slate-900">
      <TopNavigation
        title={t('profile')}
        subtitle="Manage your account"
        showBackButton={true}
        rightIcon="settings-outline"
        onRightPress={() => {/* Settings functionality to be implemented */}}
      />
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Profile Header */}
        <Animatable.View
          animation="fadeInDown"
          duration={800}
          className="items-center py-8 px-5"
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            className="rounded-[60px] p-1 mb-5"
          >
            <TouchableOpacity
              onPress={handleAvatarPress}
              className="w-30 h-30 rounded-[60px] bg-white dark:bg-slate-800 items-center justify-center overflow-hidden relative"
            >
              {user?.avatarUrl ? (
                <Image 
                  source={{ uri: user.avatarUrl }} 
                  className="w-full h-full"
                />
              ) : (
                <Ionicons name="person" size={48} color={colors.primary} />
              )}
              
              <View 
                className="absolute bottom-0 right-0 w-8 h-8 rounded-2xl items-center justify-center border-3 border-white dark:border-slate-800"
                style={{ backgroundColor: colors.primary }}
              >
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </LinearGradient>

          <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {user?.fullName || 'User'}
          </Text>
          
          <Text className="text-base text-slate-600 dark:text-slate-400 mb-4">
            {user?.email}
          </Text>

          <TouchableOpacity
            onPress={() => setShowEditProfile(true)}
            className="bg-primary-500 rounded-[20px] px-6 py-3 flex-row items-center"
          >
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            <Text className="text-white text-sm font-semibold ml-2">
              Edit Profile
            </Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Settings Sections */}
        <View className="mt-5">
          {/* Preferences */}
          <Text className="text-lg font-bold text-slate-900 dark:text-white mx-5 mb-4">
            Preferences
          </Text>

          <SettingItem
            icon="moon"
            title={t('theme')}
            subtitle={isDark ? 'Dark mode' : 'Light mode'}
            delay={100}
            rightComponent={
              <Switch
                value={isDark}
                onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isDark ? '#FFFFFF' : colors.surface}
              />
            }
            showArrow={false}
          />

          <SettingItem
            icon="language"
            title={t('language')}
            subtitle={languages.find(lang => lang.code === language)?.name}
            onPress={() => setShowLanguageModal(true)}
            delay={150}
          />

          <SettingItem
            icon="notifications"
            title="Notifications"
            subtitle="Manage your notification preferences"
            onPress={() => {/* Navigate to notifications settings */}}
            delay={200}
          />

          {/* Health Data */}
          <Text className="text-lg font-bold text-slate-900 dark:text-white mx-5 mt-8 mb-4">
            Health Data
          </Text>

          <SettingItem
            icon="analytics"
            title="Health Reports"
            subtitle="View and export your health data"
            onPress={() => {/* Navigate to health reports */}}
            delay={250}
            iconColor="#10B981"
            iconBackground="#10B98120"
          />

          <SettingItem
            icon="calendar"
            title="Scan History"
            subtitle="View all your previous scans"
            onPress={() => {/* Navigate to scan history */}}
            delay={300}
            iconColor="#3B82F6"
            iconBackground="#3B82F620"
          />

          <SettingItem
            icon="bookmark"
            title="Saved Recommendations"
            subtitle="Products and tips you've saved"
            onPress={() => {/* Navigate to saved recommendations */}}
            delay={350}
            iconColor="#F59E0B"
            iconBackground="#F59E0B20"
          />

          {/* Support */}
          <Text className="text-lg font-bold text-slate-900 dark:text-white mx-5 mt-8 mb-4">
            Support
          </Text>

          <SettingItem
            icon="help-circle"
            title="Help & FAQ"
            subtitle="Get answers to common questions"
            onPress={() => {/* Navigate to help & FAQ */}}
            delay={400}
          />

          <SettingItem
            icon="mail"
            title="Contact Support"
            subtitle="Get help from our support team"
            onPress={() => {/* Open contact support */}}
            delay={450}
          />

          <SettingItem
            icon="star"
            title="Rate App"
            subtitle="Help us improve with your feedback"
            onPress={() => {/* Open app store rating */}}
            delay={500}
          />

          {/* Account */}
          <Text className="text-lg font-bold text-slate-900 dark:text-white mx-5 mt-8 mb-4">
            Account
          </Text>

          <SettingItem
            icon="shield-checkmark"
            title="Privacy Policy"
            subtitle="Learn how we protect your data"
            onPress={() => {/* Open privacy policy */}}
            delay={550}
          />

          <SettingItem
            icon="document-text"
            title="Terms of Service"
            subtitle="Read our terms and conditions"
            onPress={() => {/* Open terms of service */}}
            delay={600}
          />

          <SettingItem
            icon="log-out"
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={handleSignOut}
            delay={650}
            iconColor="#EF4444"
            iconBackground="#EF444420"
          />
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <Animatable.View
            animation="slideInUp"
            duration={300}
            className="card-medical rounded-t-3xl pt-5 pb-10 max-h-[70%]"
          >
            <View className="flex-row justify-between items-center px-5 mb-5">
              <Text className="text-xl font-bold text-slate-900 dark:text-white">
                Select Language
              </Text>
              <TouchableOpacity
                onPress={() => setShowLanguageModal(false)}
                className="bg-medical-200 dark:bg-slate-700 rounded-2xl p-2"
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {languages.map((lang, index) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => {
                    setLanguage(lang.code);
                    setShowLanguageModal(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={`flex-row items-center py-4 px-5 ${
                    language === lang.code ? 'bg-primary-500/20' : ''
                  }`}
                >
                  <Text className="text-2xl mr-4">{lang.flag}</Text>
                  <Text className={`text-base flex-1 ${
                    language === lang.code 
                      ? 'font-semibold text-primary-500' 
                      : 'font-normal text-slate-900 dark:text-white'
                  }`}>
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

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditProfile(false)}
      >
        <View className="flex-1 bg-black/50 justify-center px-5">
          <Animatable.View
            animation="zoomIn"
            duration={300}
            className="card-medical rounded-3xl p-6"
          >
            <Text className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              Edit Profile
            </Text>

            <View className="mb-5">
              <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Full Name
              </Text>
              <TextInput
                value={editedName}
                onChangeText={setEditedName}
                className="input-medical"
                placeholder="Enter your full name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View className="mb-8">
              <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Email
              </Text>
              <TextInput
                value={editedEmail}
                onChangeText={setEditedEmail}
                className="input-medical"
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowEditProfile(false)}
                className="flex-1 bg-medical-200 dark:bg-slate-700 rounded-2xl py-4 items-center"
              >
                <Text className="text-base font-semibold text-slate-900 dark:text-white">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveProfile}
                className="flex-1 bg-primary-500 rounded-2xl py-4 items-center"
              >
                <Text className="text-white text-base font-semibold">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
