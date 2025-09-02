import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

// Define the available languages
type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ar' | 'zh' | 'ja';

// Language option interface
interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

// Define the shape of the context
interface LanguageContextType {
  language: Language;
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  languages: LanguageOption[];
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object (simplified version for mobile)
const translations = {
  en: {
    // App Title
    title: "OralScan AI",
    subtitle: "Your Personal Oral Health Assistant",
    description: "Get instant oral health analysis using just your smartphone camera. Detect plaque, gingivitis, and cavities in under 5 minutes.",
    
    // Navigation
    home: "Home",
    scan: "Scan",
    dashboard: "Dashboard",
    profile: "Profile",
    consultations: "Consultations",
    settings: "Settings",
    
    // Common Actions
    start: "Start",
    continue: "Continue",
    cancel: "Cancel",
    save: "Save",
    share: "Share",
    export: "Export",
    retry: "Retry",
    done: "Done",
    next: "Next",
    back: "Back",
    welcome: "Welcome",
    user: "User",
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    quickActions: "Quick Actions",
    quickScan: "Quick Scan",
    quickScanDesc: "Start scanning now",
    viewReports: "View Reports",
    viewReportsDesc: "Check your history",
    
    // Scan Related
    cta: "Start Free Scan",
    scan_instructions: "Scan Instructions",
    scan_camera_ready: "Camera Ready",
    scan_start_camera: "Start Camera",
    scan_capture_image: "Capture Image",
    scan_processing: "Processing...",
    scan_complete: "Scan Complete",
    scan_successful: "Scan Successful!",
    
    // Features
    features_title: "Why Choose OralScan AI?",
    feature_instant: "Instant Analysis",
    feature_instant_desc: "Get results in under 5 minutes",
    feature_privacy: "Privacy First",
    feature_privacy_desc: "Your health data stays secure",
    feature_tracking: "Progress Tracking",
    feature_tracking_desc: "Monitor improvements over time",
    feature_global: "Multi-Language",
    feature_global_desc: "Available in 8 languages",
    
    // Dashboard
    dashboard_welcome: "Welcome back! 👋",
    dashboard_total_scans: "Total Scans",
    dashboard_current_streak: "Current Streak",
    dashboard_average_score: "Average Score",
    dashboard_last_scan: "Last Scan",
    dashboard_take_new_scan: "Take New Scan",
    dashboard_recent_scans: "Recent Scans",
    dashboard_score: "Score",
    dashboard_issues_found: "issues found",
    
    // Results
    results_overall_score: "Overall Score",
    results_issues_found: "Issues Found",
    results_recommendations: "Recommendations",
    results_good_oral_health: "Good Oral Health",
    results_fair_oral_health: "Fair Oral Health",
    results_needs_attention: "Needs Attention",
    
    // Stats
    stats_users: "50K+ Users",
    stats_scans: "200K+ Scans",
    stats_accuracy: "94% Accuracy",
  },
  hi: {
    // App Title
    title: "ओरलस्कैन एआई",
    subtitle: "आपका व्यक्तिगत मौखिक स्वास्थ्य सहायक",
    description: "केवल अपने स्मार्टफोन कैमरे का उपयोग करके तुरंत मौखिक स्वास्थ्य विश्लेषण प्राप्त करें। 5 मिनट से कम में प्लाक, मसूड़े की सूजन और कैविटी का पता लगाएं।",
    
    // Navigation
    home: "होम",
    scan: "स्कैन",
    dashboard: "डैशबोर्ड",
    profile: "प्रोफाइल",
    consultations: "परामर्श",
    settings: "सेटिंग्स",
    
    // Common Actions
    start: "शुरू करें",
    continue: "जारी रखें",
    cancel: "रद्द करें",
    save: "सेव करें",
    share: "साझा करें",
    export: "निर्यात",
    retry: "पुनः प्रयास",
    done: "हो गया",
    next: "अगला",
    back: "वापस",
    
    // Scan Related
    cta: "मुफ्त स्कैन शुरू करें",
    scan_instructions: "स्कैन निर्देश",
    scan_camera_ready: "कैमरा तैयार",
    scan_start_camera: "कैमरा शुरू करें",
    scan_capture_image: "छवि कैप्चर करें",
    scan_processing: "प्रसंस्करण...",
    scan_complete: "स्कैन पूर्ण",
    scan_successful: "स्कैन सफल!",
    
    // Features
    features_title: "ओरलस्कैन एआई क्यों चुनें?",
    feature_instant: "तत्काल विश्लेषण",
    feature_instant_desc: "5 मिनट से कम में परिणाम प्राप्त करें",
    feature_privacy: "गोपनीयता प्राथमिकता",
    feature_privacy_desc: "आपका स्वास्थ्य डेटा सुरक्षित रहता है",
    feature_tracking: "प्रगति ट्रैकिंग",
    feature_tracking_desc: "समय के साथ सुधार की निगरानी करें",
    feature_global: "बहु-भाषा",
    feature_global_desc: "8 भाषाओं में उपलब्ध",
    
    // Dashboard
    dashboard_welcome: "वापसी पर स्वागत है! 👋",
    dashboard_total_scans: "कुल स्कैन",
    dashboard_current_streak: "वर्तमान स्ट्रीक",
    dashboard_average_score: "औसत स्कोर",
    dashboard_last_scan: "अंतिम स्कैन",
    dashboard_take_new_scan: "नया स्कैन लें",
    dashboard_recent_scans: "हाल के स्कैन",
    dashboard_score: "स्कोर",
    dashboard_issues_found: "समस्याएं मिलीं",
    
    // Results
    results_overall_score: "कुल स्कोर",
    results_issues_found: "मिली समस्याएं",
    results_recommendations: "सिफारिशें",
    results_good_oral_health: "अच्छा मौखिक स्वास्थ्य",
    results_fair_oral_health: "सामान्य मौखिक स्वास्थ्य",
    results_needs_attention: "ध्यान देने की आवश्यकता",
    
    // Stats
    stats_users: "50K+ उपयोगकर्ता",
    stats_scans: "200K+ स्कैन",
    stats_accuracy: "94% सटीकता",
  },
  // Add more languages as needed (simplified for now)
  es: { title: "OralScan AI", subtitle: "Tu Asistente Personal de Salud Oral" },
  fr: { title: "OralScan AI", subtitle: "Votre Assistant Personnel de Santé Orale" },
  de: { title: "OralScan AI", subtitle: "Ihr Persönlicher Mundgesundheits-Assistent" },
  ar: { title: "OralScan AI", subtitle: "مساعدك الشخصي لصحة الفم" },
  zh: { title: "OralScan AI", subtitle: "您的个人口腔健康助手" },
  ja: { title: "OralScan AI", subtitle: "あなたの個人的な口腔健康アシスタント" },
};

// Create the provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Initialize language from storage or device locale
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Try to get saved language from AsyncStorage
        const savedLanguage = await AsyncStorage.getItem('oralscan_language');
        if (savedLanguage && ['en', 'hi', 'es', 'fr', 'de', 'ar', 'zh', 'ja'].includes(savedLanguage)) {
          setLanguage(savedLanguage as Language);
        } else {
          // Use device locale as fallback with null safety
          const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
          if (['en', 'hi', 'es', 'fr', 'de', 'ar', 'zh', 'ja'].includes(deviceLocale)) {
            setLanguage(deviceLocale as Language);
          } else {
            // Default to English if device locale is not supported
            setLanguage('en');
          }
        }
      } catch (error) {
        console.error('Error initializing language:', error);
        // Fallback to English if there's any error
        setLanguage('en');
      }
    };

    initializeLanguage();
  }, []);

  // Update language and save to AsyncStorage
  const updateLanguage = async (newLanguage: Language) => {
    setLanguage(newLanguage);
    try {
      await AsyncStorage.setItem('oralscan_language', newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  // The translation function 't'
  const t = (key: string) => {
    const translation = translations[language]?.[key as keyof typeof translations[typeof language]];
    return translation || translations['en'][key as keyof typeof translations['en']] || key;
  };

  // Check if current language is RTL
  const isRTL = language === 'ar';

  // Available languages array
  const languages: LanguageOption[] = [
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
    <LanguageContext.Provider value={{ language, currentLanguage: language, setLanguage: updateLanguage, t, isRTL, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Default export for the provider
export default LanguageProvider;
