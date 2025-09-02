/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind preset is required
  presets: [require('nativewind/preset')],
  
  // NativeWind configuration for React Native
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./web/**/*.{js,jsx,ts,tsx,html}",
    "./admin/**/*.{js,jsx,ts,tsx,html}",
    "./marketing/**/*.{js,jsx,ts,tsx,html}",
  ],
  
  darkMode: 'class', // Enable dark mode with class strategy
  
  theme: {
    extend: {
      // Medical Brand Color System
      colors: {
        // Primary Brand Colors (Professional Blue)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Main brand
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        
        // Accent Gradient Colors
        accent: {
          cyan: '#06b6d4',
          teal: '#14b8a6',
          emerald: '#10b981',
        },
        
        // Health Score Status Colors
        health: {
          excellent: '#10b981', // Green (85-100)
          good: '#3b82f6',      // Blue (70-84)
          warning: '#f59e0b',   // Amber (50-69)
          critical: '#ef4444',  // Red (0-49)
        },
        
        // Semantic Colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        
        // Medical UI Neutrals
        medical: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        
        // Dark Theme Overrides
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          card: '#334155',
          border: '#475569',
        }
      },
      
      // Typography Scale (Medical App Optimized)
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '1' }],
        '6xl': ['60px', { lineHeight: '1' }],
      },
      
      // Font Families
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Courier New', 'monospace'],
        'medical': ['Inter', 'system-ui', 'sans-serif'], // Clean, readable
      },
      
      // Spacing System (8px base grid)
      spacing: {
        '0.5': '2px',
        '1.5': '6px',
        '2.5': '10px',
        '3.5': '14px',
        '4.5': '18px',
        '5.5': '22px',
        '6.5': '26px',
        '7.5': '30px',
        '8.5': '34px',
        '9.5': '38px',
        '15': '60px',
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px',
      },
      
      // Border Radius (Subtle, Medical)
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      
      // Box Shadow (Subtle Elevation)
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'md': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'medical': '0 4px 12px rgb(59 130 246 / 0.15)', // Brand shadow
        'health-good': '0 4px 12px rgb(16 185 129 / 0.15)',
        'health-warning': '0 4px 12px rgb(245 158 11 / 0.15)',
        'health-critical': '0 4px 12px rgb(239 68 68 / 0.15)',
      },
      
      // Animation & Transitions
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'camera-pulse': 'cameraPulse 1.5s ease-in-out infinite',
        'scan-progress': 'scanProgress 3s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
          '70%': { transform: 'translate3d(0, -4px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        },
        cameraPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        scanProgress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      
      // Responsive Breakpoints (Web + Mobile)
      screens: {
        'xs': '375px',   // Mobile small
        'sm': '640px',   // Mobile large
        'md': '768px',   // Tablet
        'lg': '1024px',  // Desktop
        'xl': '1280px',  // Large desktop
        '2xl': '1536px', // Extra large
        // Mobile-first breakpoints
        'mobile': '375px',
        'tablet': '768px',
        'desktop': '1024px',
      },
      
      // Touch Targets (WCAG Compliance)
      minHeight: {
        'touch': '44px', // Minimum touch target
        'touch-comfortable': '48px', // Comfortable touch
        'touch-large': '56px', // Large touch target
      },
      
      minWidth: {
        'touch': '44px',
        'touch-comfortable': '48px', 
        'touch-large': '56px',
      },
      
      // Z-index Scale
      zIndex: {
        'modal': '1000',
        'overlay': '900',
        'dropdown': '800',
        'header': '700',
        'footer': '600',
      },
      
      // Backdrop Blur
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
    },
  },
  
  plugins: [
    // Add Tailwind plugins
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    
    // Custom plugin for medical app utilities
    function({ addUtilities, addComponents, theme }) {
      // Medical component utilities
      addComponents({
        '.btn-medical': {
          '@apply px-6 py-3 rounded-lg font-medium transition-all duration-200 min-h-touch-comfortable': {},
          '@apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2': {},
        },
        '.btn-primary': {
          '@apply btn-medical bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700': {},
          '@apply shadow-md hover:shadow-lg active:shadow-sm': {},
        },
        '.btn-secondary': {
          '@apply btn-medical bg-medical-100 text-medical-700 hover:bg-medical-200 active:bg-medical-300': {},
          '@apply dark:bg-medical-800 dark:text-medical-200 dark:hover:bg-medical-700': {},
        },
        '.card-medical': {
          '@apply bg-white rounded-xl shadow-sm border border-medical-200': {},
          '@apply dark:bg-medical-800 dark:border-medical-700': {},
        },
        '.input-medical': {
          '@apply w-full px-4 py-3 rounded-lg border border-medical-300 focus:border-primary-500': {},
          '@apply focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-colors': {},
          '@apply dark:bg-medical-800 dark:border-medical-600 dark:text-white': {},
        },
        '.health-score-excellent': {
          '@apply bg-gradient-to-r from-emerald-500 to-teal-500 text-white': {},
        },
        '.health-score-good': {
          '@apply bg-gradient-to-r from-blue-500 to-cyan-500 text-white': {},
        },
        '.health-score-warning': {
          '@apply bg-gradient-to-r from-amber-500 to-orange-500 text-white': {},
        },
        '.health-score-critical': {
          '@apply bg-gradient-to-r from-red-500 to-pink-500 text-white': {},
        },
      });
      
      // Custom utilities
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.animate-camera-pulse': {
          'animation': 'cameraPulse 1.5s ease-in-out infinite',
        },
        '.animate-scan-progress': {
          'animation': 'scanProgress 3s ease-out forwards',
        },
      });
    },
  ],
};
