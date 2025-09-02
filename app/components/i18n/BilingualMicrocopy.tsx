import React from 'react';
import { Text, View } from 'react-native';

/**
 * Bilingual Microcopy for OralScan App
 * English and Hindi translations for all UI elements
 */

export interface Translations {
  // Onboarding & Welcome
  welcome: {
    title: string;
    subtitle: string;
    getStarted: string;
    signIn: string;
    features: {
      camera: {
        title: string;
        description: string;
      };
      insights: {
        title: string;
        description: string;
      };
      tracking: {
        title: string;
        description: string;
      };
    };
  };

  // Camera & Scanning
  camera: {
    permissionTitle: string;
    permissionMessage: string;
    enableCamera: string;
    scanInstructions: string;
    hints: {
      openMouth: string;
      moveCloser: string;
      moveFarther: string;
      betterLighting: string;
      reduceBrightLight: string;
      holdSteady: string;
      perfect: string;
      position: string;
    };
    controls: {
      torch: string;
      autoCapture: string;
      manualCapture: string;
      retake: string;
    };
    quality: {
      mouth: string;
      distance: string;
      lighting: string;
      focus: string;
    };
  };

  // Analysis & Results
  analysis: {
    qualityCheck: string;
    analyzing: string;
    aiAnalysis: string;
    processingSteps: {
      preprocessing: string;
      detecting: string;
      analyzing: string;
      insights: string;
      finalizing: string;
    };
    results: {
      healthScore: string;
      basedOnAI: string;
      keyInsights: string;
      recommendations: string;
      areasToWatch: string;
      nextSteps: string;
      saveResults: string;
      share: string;
      capturedImage: string;
    };
    categories: {
      excellent: string;
      good: string;
      fair: string;
      poor: string;
    };
  };

  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    healthScore: string;
    lastScan: string;
    totalScans: string;
    avgScore: string;
    streak: string;
    recentScans: string;
    noScansYet: string;
    takeFirstScan: string;
  };

  // Profile & Settings
  profile: {
    title: string;
    personalInfo: string;
    theme: string;
    darkMode: string;
    language: string;
    notifications: string;
    privacy: string;
    help: string;
    signOut: string;
    editProfile: string;
  };

  // Common Actions
  common: {
    save: string;
    cancel: string;
    continue: string;
    back: string;
    close: string;
    retry: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };

  // Error Messages
  errors: {
    cameraPermission: string;
    imageCapture: string;
    analysisFailure: string;
    networkError: string;
    qualityTooLow: string;
    tryAgain: string;
  };

  // Success Messages
  success: {
    scanCompleted: string;
    resultsSaved: string;
    profileUpdated: string;
    settingsSaved: string;
  };
}

export const translations: Record<'en' | 'hi', Translations> = {
  en: {
    welcome: {
      title: "Welcome to OralScan",
      subtitle: "AI-powered oral health analysis at your fingertips",
      getStarted: "Get Started",
      signIn: "Sign In",
      features: {
        camera: {
          title: "Smart Camera Analysis",
          description: "Advanced AI analyzes your oral health in seconds"
        },
        insights: {
          title: "Personalized Insights",
          description: "Get tailored recommendations for better oral care"
        },
        tracking: {
          title: "Track Progress",
          description: "Monitor your oral health journey over time"
        }
      }
    },

    camera: {
      permissionTitle: "Camera Permission Required",
      permissionMessage: "OralScan needs camera access to analyze your oral health",
      enableCamera: "Enable Camera",
      scanInstructions: "Position your face in the oval and open your mouth",
      hints: {
        openMouth: "Open your mouth wider",
        moveCloser: "Move a bit closer",
        moveFarther: "Move a bit further away",
        betterLighting: "Find better lighting",
        reduceBrightLight: "Reduce bright light",
        holdSteady: "Hold steady",
        perfect: "Perfect! Hold still...",
        position: "Position your face in the oval"
      },
      controls: {
        torch: "Flash",
        autoCapture: "Auto Capture",
        manualCapture: "Take Photo",
        retake: "Retake"
      },
      quality: {
        mouth: "Mouth",
        distance: "Distance",
        lighting: "Light",
        focus: "Focus"
      }
    },

    analysis: {
      qualityCheck: "Quality Check",
      analyzing: "Analyzing image quality...",
      aiAnalysis: "AI Analysis",
      processingSteps: {
        preprocessing: "Preprocessing image...",
        detecting: "Detecting oral features...",
        analyzing: "Analyzing dental health...",
        insights: "Generating insights...",
        finalizing: "Finalizing report..."
      },
      results: {
        healthScore: "Health Score",
        basedOnAI: "Based on AI analysis",
        keyInsights: "Key Insights",
        recommendations: "Recommendations",
        areasToWatch: "Areas to Watch",
        nextSteps: "Next Steps",
        saveResults: "Save Results",
        share: "Share",
        capturedImage: "Captured Image"
      },
      categories: {
        excellent: "Excellent",
        good: "Good",
        fair: "Fair",
        poor: "Needs Attention"
      }
    },

    dashboard: {
      title: "Dashboard",
      subtitle: "Your oral health overview",
      healthScore: "Health Score",
      lastScan: "Last scan",
      totalScans: "Total Scans",
      avgScore: "Avg Score",
      streak: "Streak",
      recentScans: "Recent Scans",
      noScansYet: "No scans yet",
      takeFirstScan: "Take Your First Scan"
    },

    profile: {
      title: "Profile",
      personalInfo: "Personal Information",
      theme: "Theme",
      darkMode: "Dark Mode",
      language: "Language",
      notifications: "Notifications",
      privacy: "Privacy",
      help: "Help & Support",
      signOut: "Sign Out",
      editProfile: "Edit Profile"
    },

    common: {
      save: "Save",
      cancel: "Cancel",
      continue: "Continue",
      back: "Back",
      close: "Close",
      retry: "Retry",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Information"
    },

    errors: {
      cameraPermission: "Camera permission is required to scan",
      imageCapture: "Failed to capture image. Please try again.",
      analysisFailure: "Analysis failed. Please check your connection.",
      networkError: "Network error. Please check your internet connection.",
      qualityTooLow: "Image quality is too low. Please retake the photo.",
      tryAgain: "Please try again"
    },

    success: {
      scanCompleted: "Scan completed successfully!",
      resultsSaved: "Results saved to your history",
      profileUpdated: "Profile updated successfully",
      settingsSaved: "Settings saved"
    }
  },

  hi: {
    welcome: {
      title: "OralScan में आपका स्वागत है",
      subtitle: "AI-संचालित मौखिक स्वास्थ्य विश्लेषण आपकी उंगलियों पर",
      getStarted: "शुरू करें",
      signIn: "साइन इन करें",
      features: {
        camera: {
          title: "स्मार्ट कैमरा विश्लेषण",
          description: "उन्नत AI सेकंडों में आपके मौखिक स्वास्थ्य का विश्लेषण करता है"
        },
        insights: {
          title: "व्यक्तिगत अंतर्दृष्टि",
          description: "बेहतर मौखिक देखभाल के लिए अनुकूलित सुझाव प्राप्त करें"
        },
        tracking: {
          title: "प्रगति ट्रैक करें",
          description: "समय के साथ अपनी मौखिक स्वास्थ्य यात्रा की निगरानी करें"
        }
      }
    },

    camera: {
      permissionTitle: "कैमरा अनुमति आवश्यक",
      permissionMessage: "OralScan को आपके मौखिक स्वास्थ्य का विश्लेषण करने के लिए कैमरा एक्सेस की आवश्यकता है",
      enableCamera: "कैमरा सक्षम करें",
      scanInstructions: "अपना चेहरा ओवल में रखें और अपना मुंह खोलें",
      hints: {
        openMouth: "अपना मुंह और चौड़ा खोलें",
        moveCloser: "थोड़ा और पास आएं",
        moveFarther: "थोड़ा और दूर जाएं",
        betterLighting: "बेहतर रोशनी खोजें",
        reduceBrightLight: "तेज रोशनी कम करें",
        holdSteady: "स्थिर रहें",
        perfect: "परफेक्ट! स्थिर रहें...",
        position: "अपना चेहरा ओवल में रखें"
      },
      controls: {
        torch: "फ्लैश",
        autoCapture: "ऑटो कैप्चर",
        manualCapture: "फोटो लें",
        retake: "दोबारा लें"
      },
      quality: {
        mouth: "मुंह",
        distance: "दूरी",
        lighting: "रोशनी",
        focus: "फोकस"
      }
    },

    analysis: {
      qualityCheck: "गुणवत्ता जांच",
      analyzing: "छवि गुणवत्ता का विश्लेषण कर रहे हैं...",
      aiAnalysis: "AI विश्लेषण",
      processingSteps: {
        preprocessing: "छवि को प्रीप्रोसेस कर रहे हैं...",
        detecting: "मौखिक विशेषताओं का पता लगा रहे हैं...",
        analyzing: "दंत स्वास्थ्य का विश्लेषण कर रहे हैं...",
        insights: "अंतर्दृष्टि तैयार कर रहे हैं...",
        finalizing: "रिपोर्ट को अंतिम रूप दे रहे हैं..."
      },
      results: {
        healthScore: "स्वास्थ्य स्कोर",
        basedOnAI: "AI विश्लेषण के आधार पर",
        keyInsights: "मुख्य अंतर्दृष्टि",
        recommendations: "सुझाव",
        areasToWatch: "ध्यान देने योग्य क्षेत्र",
        nextSteps: "अगले कदम",
        saveResults: "परिणाम सहेजें",
        share: "साझा करें",
        capturedImage: "कैप्चर की गई छवि"
      },
      categories: {
        excellent: "उत्कृष्ट",
        good: "अच्छा",
        fair: "ठीक",
        poor: "ध्यान की आवश्यकता"
      }
    },

    dashboard: {
      title: "डैशबोर्ड",
      subtitle: "आपके मौखिक स्वास्थ्य का अवलोकन",
      healthScore: "स्वास्थ्य स्कोर",
      lastScan: "अंतिम स्कैन",
      totalScans: "कुल स्कैन",
      avgScore: "औसत स्कोर",
      streak: "लगातार",
      recentScans: "हाल के स्कैन",
      noScansYet: "अभी तक कोई स्कैन नहीं",
      takeFirstScan: "अपना पहला स्कैन लें"
    },

    profile: {
      title: "प्रोफाइल",
      personalInfo: "व्यक्तिगत जानकारी",
      theme: "थीम",
      darkMode: "डार्क मोड",
      language: "भाषा",
      notifications: "सूचनाएं",
      privacy: "गोपनीयता",
      help: "सहायता और समर्थन",
      signOut: "साइन आउट",
      editProfile: "प्रोफाइल संपादित करें"
    },

    common: {
      save: "सहेजें",
      cancel: "रद्द करें",
      continue: "जारी रखें",
      back: "वापस",
      close: "बंद करें",
      retry: "पुनः प्रयास करें",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता",
      warning: "चेतावनी",
      info: "जानकारी"
    },

    errors: {
      cameraPermission: "स्कैन करने के लिए कैमरा अनुमति आवश्यक है",
      imageCapture: "छवि कैप्चर करने में विफल। कृपया पुनः प्रयास करें।",
      analysisFailure: "विश्लेषण विफल। कृपया अपना कनेक्शन जांचें।",
      networkError: "नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।",
      qualityTooLow: "छवि गुणवत्ता बहुत कम है। कृपया फोटो दोबारा लें।",
      tryAgain: "कृपया पुनः प्रयास करें"
    },

    success: {
      scanCompleted: "स्कैन सफलतापूर्वक पूरा हुआ!",
      resultsSaved: "परिणाम आपके इतिहास में सहेजे गए",
      profileUpdated: "प्रोफाइल सफलतापूर्वक अपडेट हुआ",
      settingsSaved: "सेटिंग्स सहेजी गईं"
    }
  }
};

// Translation Hook
export function useTranslation(language: 'en' | 'hi' = 'en') {
  return translations[language];
}

// Bilingual Text Component
interface BilingualTextProps {
  enText: string;
  hiText: string;
  language: 'en' | 'hi';
  className?: string;
}

export function BilingualText({ enText, hiText, language, className = '' }: BilingualTextProps) {
  return (
    <Text className={className}>
      {language === 'en' ? enText : hiText}
    </Text>
  );
}

// Language Selector Component
interface LanguageSelectorProps {
  currentLanguage: 'en' | 'hi';
  onLanguageChange: (language: 'en' | 'hi') => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <View className="flex-row bg-medical-100 dark:bg-medical-800 rounded-xl p-1">
      <TouchableOpacity
        onPress={() => onLanguageChange('en')}
        className={`
          flex-1 py-2 px-4 rounded-lg
          ${currentLanguage === 'en' 
            ? 'bg-white dark:bg-medical-700 shadow-sm' 
            : 'bg-transparent'
          }
        `}
      >
        <Text className={`
          text-center font-medium
          ${currentLanguage === 'en'
            ? 'text-medical-900 dark:text-medical-100'
            : 'text-medical-600 dark:text-medical-400'
          }
        `}>
          English
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => onLanguageChange('hi')}
        className={`
          flex-1 py-2 px-4 rounded-lg
          ${currentLanguage === 'hi' 
            ? 'bg-white dark:bg-medical-700 shadow-sm' 
            : 'bg-transparent'
          }
        `}
      >
        <Text className={`
          text-center font-medium
          ${currentLanguage === 'hi'
            ? 'text-medical-900 dark:text-medical-100'
            : 'text-medical-600 dark:text-medical-400'
          }
        `}>
          हिंदी
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Usage Examples
export function TranslationExamples() {
  const t = useTranslation('en');
  
  return (
    <View className="p-6 space-y-4">
      <Text className="text-2xl font-bold text-medical-900 dark:text-medical-100">
        {t.welcome.title}
      </Text>
      
      <Text className="text-medical-600 dark:text-medical-400">
        {t.welcome.subtitle}
      </Text>
      
      <BilingualText
        enText="Take your first scan"
        hiText="अपना पहला स्कैन लें"
        language="hi"
        className="text-primary-500 font-medium"
      />
    </View>
  );
}

/**
 * Cultural Considerations for Hindi Translation:
 * 
 * 1. Medical terminology uses commonly understood Hindi words
 * 2. Formal tone maintained throughout for healthcare context
 * 3. Action words use imperative form appropriate for app instructions
 * 4. Technical terms (AI, scan) kept in English as commonly used
 * 5. Numbers and percentages displayed in international format
 * 6. Date/time formats can be localized separately
 */

export const CulturalNotes = {
  hindi: {
    medicalTerms: "Uses accessible Hindi medical vocabulary",
    tone: "Formal and respectful, appropriate for healthcare",
    techTerms: "AI, scan, app kept in English as commonly used",
    numbers: "International format maintained for consistency",
    instructions: "Clear imperative form for user actions"
  },
  
  accessibility: {
    screenReader: "Both languages tested with screen readers",
    fontSupport: "Devanagari script properly supported",
    textDirection: "LTR maintained for both languages"
  }
};
