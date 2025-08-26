import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type Theme = 'light' | 'dark' | 'system';

interface Colors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  onBackground: string;
  onSurface: string;
  onPrimary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  colors: Colors;
  setTheme: (theme: Theme) => void;
}

const lightColors: Colors = {
  primary: '#2563eb',
  secondary: '#10b981',
  background: '#ffffff',
  surface: '#f8fafc',
  surfaceVariant: '#e2e8f0',
  text: '#1e293b',
  textSecondary: '#6b7280',
  onBackground: '#1e293b',
  onSurface: '#334155',
  onPrimary: '#ffffff',
  border: '#d1d5db',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6',
};

const darkColors: Colors = {
  primary: '#3b82f6',
  secondary: '#10b981',
  background: '#0f172a',
  surface: '#1e293b',
  surfaceVariant: '#334155',
  text: '#f1f5f9',
  textSecondary: '#9ca3af',
  onBackground: '#f1f5f9',
  onSurface: '#e2e8f0',
  onPrimary: '#ffffff',
  border: '#4b5563',
  error: '#f87171',
  success: '#34d399',
  warning: '#fbbf24',
  info: '#60a5fa',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync('theme');
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeState(savedTheme as Theme);
        }
      } catch (error) {
        console.log('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  const setTheme = async (newTheme: Theme) => {
    try {
      await SecureStore.setItemAsync('theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
      setThemeState(newTheme);
    }
  };

  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  const value: ThemeContextType = {
    theme,
    isDark,
    colors,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Default export for the provider
export default ThemeProvider;
