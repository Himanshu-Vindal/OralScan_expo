// Medical Health App Color System
export interface Colors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  background: string;
  surface: string;
  surfaceSecondary: string;
  card: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  border: string;
  borderLight: string;
  divider: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;
  excellent: string;
  good: string;
  fair: string;
  poor: string;
  shadow: string;
  shadowLight: string;
  shadowMedium: string;
  shadowHeavy: string;
  gradients: {
    primary: string[];
    secondary: string[];
    success: string[];
    warning: string[];
    error: string[];
    health: string[];
  };
}

// Light Theme Colors
export const lightColors: Colors = {
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#1d4ed8',
  secondary: '#06b6d4',
  secondaryLight: '#22d3ee',
  secondaryDark: '#0891b2',
  background: '#ffffff',
  surface: '#f8fafc',
  surfaceSecondary: '#f1f5f9',
  card: '#ffffff',
  text: '#0f172a',
  textSecondary: '#475569',
  textTertiary: '#64748b',
  textInverse: '#ffffff',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  divider: '#cbd5e1',
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  error: '#ef4444',
  errorLight: '#fee2e2',
  info: '#3b82f6',
  infoLight: '#dbeafe',
  excellent: '#10b981',
  good: '#3b82f6',
  fair: '#f59e0b',
  poor: '#ef4444',
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
  shadowHeavy: 'rgba(0, 0, 0, 0.25)',
  gradients: {
    primary: ['#3b82f6', '#1d4ed8'],
    secondary: ['#06b6d4', '#0891b2'],
    success: ['#10b981', '#059669'],
    warning: ['#f59e0b', '#d97706'],
    error: ['#ef4444', '#dc2626'],
    health: ['#10b981', '#3b82f6'],
  },
};

// Dark Theme Colors
export const darkColors: Colors = {
  primary: '#60a5fa',
  primaryLight: '#93c5fd',
  primaryDark: '#3b82f6',
  secondary: '#22d3ee',
  secondaryLight: '#67e8f9',
  secondaryDark: '#06b6d4',
  background: '#0f172a',
  surface: '#1e293b',
  surfaceSecondary: '#334155',
  card: '#1e293b',
  text: '#f8fafc',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
  textInverse: '#0f172a',
  border: '#334155',
  borderLight: '#475569',
  divider: '#475569',
  success: '#34d399',
  successLight: '#064e3b',
  warning: '#fbbf24',
  warningLight: '#78350f',
  error: '#f87171',
  errorLight: '#7f1d1d',
  info: '#60a5fa',
  infoLight: '#1e3a8a',
  excellent: '#34d399',
  good: '#60a5fa',
  fair: '#fbbf24',
  poor: '#f87171',
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowLight: 'rgba(0, 0, 0, 0.2)',
  shadowMedium: 'rgba(0, 0, 0, 0.4)',
  shadowHeavy: 'rgba(0, 0, 0, 0.6)',
  gradients: {
    primary: ['#60a5fa', '#3b82f6'],
    secondary: ['#22d3ee', '#06b6d4'],
    success: ['#34d399', '#10b981'],
    warning: ['#fbbf24', '#f59e0b'],
    error: ['#f87171', '#ef4444'],
    health: ['#34d399', '#60a5fa'],
  },
};

// Utility Functions
export const getHealthScoreStyle = (score: number): string => {
  if (score >= 85) return 'health-score-excellent';
  if (score >= 70) return 'health-score-good';
  if (score >= 50) return 'health-score-warning';
  return 'health-score-critical';
};

export const getHealthScoreColor = (score: number, isDark: boolean = false): string => {
  const colors = isDark ? darkColors : lightColors;
  if (score >= 85) return colors.excellent;
  if (score >= 70) return colors.good;
  if (score >= 50) return colors.fair;
  return colors.poor;
};
