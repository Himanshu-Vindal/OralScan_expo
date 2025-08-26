import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

/**
 * Floating, production-grade custom tab bar
 * - Always leaves extra air above Android gesture pill / back chevron
 * - Proper hitSlop & ripple
 * - Clear active indicator, balanced spacing
 */
function FloatingTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  // Colors tuned for visibility
  const ACTIVE = '#2563EB';
  const INACTIVE = '#94A3B8';

  // Extra lift so bar never crowds the system nav area
  const bottomLift =
    (Platform.OS === 'android' ? Math.max(insets.bottom, 16) : Math.max(insets.bottom, 8)) + 12;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: bottomLift,
      }}
    >
      {/* Background (blur on iOS, translucent on Android) */}
      <View
        style={{
          borderRadius: 22,
          overflow: 'hidden',
          // shadow/elevation for floating effect
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        {Platform.OS === 'ios' ? (
          <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={{ paddingVertical: 6 }}>
            <BarContent
              state={state}
              descriptors={descriptors}
              navigation={navigation}
              ACTIVE={ACTIVE}
              INACTIVE={INACTIVE}
            />
          </BlurView>
        ) : (
          <View
            style={{
              backgroundColor: isDark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.96)',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              borderWidth: 1,
              paddingVertical: 6,
            }}
          >
            <BarContent
              state={state}
              descriptors={descriptors}
              navigation={navigation}
              ACTIVE={ACTIVE}
              INACTIVE={INACTIVE}
            />
          </View>
        )}
      </View>
    </View>
  );
}

function BarContent({ state, descriptors, navigation, ACTIVE, INACTIVE }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const color = isFocused ? ACTIVE : INACTIVE;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        const icon =
          typeof options.tabBarIcon === 'function'
            ? options.tabBarIcon({ focused: isFocused, color, size: isFocused ? 26 : 22 })
            : null;

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            android_ripple={{ color: 'rgba(37,99,235,0.12)', borderless: false }}
            style={{
              flex: 1,
              paddingVertical: 6,
              paddingHorizontal: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              {icon || (
                <Ionicons
                  name="ellipse"
                  size={isFocused ? 26 : 22}
                  color={color}
                />
              )}

              {/* subtle indicator */}
              <View
                style={{
                  width: isFocused ? 22 : 0,
                  height: isFocused ? 3 : 0,
                  backgroundColor: color,
                  borderRadius: 2,
                  marginTop: 5,
                }}
              />

              <Text
                numberOfLines={1}
                style={{
                  marginTop: 2,
                  fontSize: 12,
                  fontWeight: isFocused ? '700' : '600',
                  color,
                }}
              >
                {String(label)}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <Tabs
      // Use our custom bar
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: { display: 'none' }, // required to fully delegate to custom tabBar
      }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: t('scan'),
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'camera' : 'camera-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t('dashboard'),
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'analytics' : 'analytics-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
