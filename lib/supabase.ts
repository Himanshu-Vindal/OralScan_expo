import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Enhanced debugging and validation
const debugSupabaseConfig = () => {
  console.log('🔧 Supabase Configuration Debug:');
  console.log('URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'Missing');
  console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Missing');
  console.log('Environment:', __DEV__ ? 'Development' : 'Production');
};

// Create supabase client with proper error handling
let supabaseClient;

// Validate environment variables with detailed error reporting
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration. Please check your environment variables:');
  console.error('EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  
  if (__DEV__) {
    console.warn('⚠️ Using fallback configuration in development mode');
  }
  
  // Provide fallback values to prevent crashes
  const fallbackUrl = supabaseUrl || 'https://placeholder.supabase.co';
  const fallbackKey = supabaseAnonKey || 'placeholder-key';
  
  supabaseClient = createClient(fallbackUrl, fallbackKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
} else {
  if (__DEV__) {
    debugSupabaseConfig();
  }
  
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

export const supabase = supabaseClient;

// Enhanced error handling utilities
export const handleSupabaseError = (error: any, context?: string) => {
  const errorMessage = error?.message || 'Unknown error occurred';
  const errorCode = error?.code || 'UNKNOWN_ERROR';
  
  console.error(`🚨 Supabase Error${context ? ` in ${context}` : ''}:`, {
    message: errorMessage,
    code: errorCode,
    details: error,
  });
  
  // Return user-friendly error messages
  switch (errorCode) {
    case 'PGRST301':
      return 'Database connection error. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return errorMessage.includes('fetch') 
        ? 'Network error. Please check your connection.' 
        : errorMessage;
  }
};

// Connection test utility
export const testSupabaseConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      return { success: false, error: handleSupabaseError(error, 'connection test') };
    }
    
    console.log('✅ Supabase connection test successful');
    return { success: true };
  } catch (error) {
    console.error('❌ Supabase connection test error:', error);
    return { success: false, error: 'Failed to connect to database' };
  }
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          language_preference: string
          notification_preferences: any
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          language_preference?: string
          notification_preferences?: any
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          language_preference?: string
          notification_preferences?: any
        }
      }
      scans: {
        Row: {
          id: string
          user_id: string
          scan_date: string
          overall_score: number
          issues_detected: any
          recommendations: any
          image_urls: string[]
          ai_analysis: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          scan_date?: string
          overall_score: number
          issues_detected: any
          recommendations: any
          image_urls: string[]
          ai_analysis: any
        }
        Update: {
          overall_score?: number
          issues_detected?: any
          recommendations?: any
          ai_analysis?: any
        }
      }
      products: {
        Row: {
          id: string
          name: string
          brand: string
          category: string
          description: string
          price: number
          currency: string
          image_url: string
          ingredients: string[]
          benefits: string[]
          suitable_for: string[]
          availability_regions: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          brand: string
          category: string
          description: string
          price: number
          currency: string
          image_url: string
          ingredients: string[]
          benefits: string[]
          suitable_for: string[]
          availability_regions: string[]
        }
        Update: {
          name?: string
          description?: string
          price?: number
          image_url?: string
          ingredients?: string[]
          benefits?: string[]
          suitable_for?: string[]
          availability_regions?: string[]
        }
      }
      consultations: {
        Row: {
          id: string
          user_id: string
          dentist_id: string
          scan_id: string | null
          appointment_date: string
          status: string
          consultation_type: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          dentist_id: string
          scan_id?: string | null
          appointment_date: string
          status?: string
          consultation_type: string
          notes?: string | null
        }
        Update: {
          appointment_date?: string
          status?: string
          notes?: string | null
        }
      }
      dentists: {
        Row: {
          id: string
          full_name: string
          specialization: string
          experience_years: number
          rating: number
          consultation_fee: number
          available_slots: any
          languages: string[]
          location: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          specialization: string
          experience_years: number
          rating?: number
          consultation_fee: number
          available_slots: any
          languages: string[]
          location: string
          image_url?: string | null
        }
        Update: {
          full_name?: string
          specialization?: string
          experience_years?: number
          rating?: number
          consultation_fee?: number
          available_slots?: any
          languages?: string[]
          location?: string
          image_url?: string | null
        }
      }
    }
  }
}
