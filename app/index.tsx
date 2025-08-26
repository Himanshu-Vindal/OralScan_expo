import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

const IndexScreen = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    if (!loading) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        if (user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/auth');
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Animatable.View 
        animation="bounceIn" 
        duration={1000}
        style={{
          alignItems: 'center',
        }}
      >
        <View 
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            backgroundColor: 'rgba(255,255,255,0.2)',
          }}
        >
          <Ionicons name="medical" size={48} color="white" />
        </View>
        
        <Text 
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 8,
          }}
        >
          OralScan AI
        </Text>
        
        <Text 
          style={{
            fontSize: 18,
            color: 'white',
            opacity: 0.9,
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          Your Personal Oral Health Assistant
        </Text>
        
        <Animatable.View 
          animation="pulse" 
          iterationCount="infinite"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="refresh" size={24} color="white" />
          <Text 
            style={{
              color: 'white',
              marginLeft: 8,
              fontSize: 16,
            }}
          >
            Loading...
          </Text>
        </Animatable.View>
      </Animatable.View>
    </LinearGradient>
  );
};

export default IndexScreen;
