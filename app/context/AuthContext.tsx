import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  languagePreference?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null | ((prev: User | null) => User | null)) => void;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  uploadAvatar: (imageUri: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          fullName: session.user.user_metadata?.full_name,
          avatarUrl: session.user.user_metadata?.avatar_url,
          languagePreference: session.user.user_metadata?.language_preference,
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in with:', { email });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Sign in response:', { data, error });

    if (error) {
      console.error('Sign in error:', error);
      throw new Error(error.message);
    }

    if (data.user) {
      console.log('User signed in successfully:', data.user);
      const userData: User = {
        id: data.user.id,
        email: data.user.email!,
        fullName: data.user.user_metadata?.full_name,
        avatarUrl: data.user.user_metadata?.avatar_url,
        languagePreference: data.user.user_metadata?.language_preference || 'en',
      };
      setUser(userData);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('Attempting signup with:', { email, fullName });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: undefined, // Disable email confirmation for now
      },
    });

    console.log('Signup response:', { data, error });

    if (error) {
      console.error('Signup error:', error);
      throw new Error(error.message);
    }

    if (data.user) {
      console.log('User created successfully:', data.user);
      const userData: User = {
        id: data.user.id,
        email: data.user.email!,
        fullName: data.user.user_metadata?.full_name || fullName,
        avatarUrl: data.user.user_metadata?.avatar_url,
        languagePreference: data.user.user_metadata?.language_preference || 'en',
      };
      setUser(userData);
      
      // Check if email confirmation is required
      if (data.session) {
        console.log('User signed up and logged in immediately');
      } else {
        console.log('Email confirmation may be required');
        // For now, we'll still set the user even without session
      }
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.EXPO_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google sign in...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.EXPO_PUBLIC_APP_SCHEME}://auth/callback`,
        },
      });

      console.log('Google OAuth response:', { data, error });

      if (error) {
        console.error('Google OAuth error:', error);
        throw new Error(error.message);
      }

      // Note: OAuth flow will redirect, user data will be handled by session listener
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting to sign out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
        throw new Error(error.message);
      }
      
      console.log('Successfully signed out from Supabase');
      setUser(null);
      
      // Clear any stored tokens or user data
      try {
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('user_data');
        console.log('Cleared stored auth data');
      } catch (storageError) {
        console.warn('Error clearing stored auth data:', storageError);
      }
      
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      console.log('Updating profile with:', updates);
      
      if (!user) {
        throw new Error('No user logged in');
      }

      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.fullName,
          avatar_url: updates.avatarUrl,
          language_preference: updates.languagePreference,
        },
      });

      if (error) {
        console.error('Profile update error:', error);
        throw new Error(error.message);
      }

      console.log('Profile updated successfully:', data);
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const uploadAvatar = async (imageUri: string): Promise<string> => {
    try {
      console.log('Uploading avatar:', imageUri);
      
      if (!user) {
        throw new Error('No user logged in');
      }

      // Convert image to base64
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const fileExt = imageUri.split('.').pop() || 'jpg';
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (error) {
        console.error('Avatar upload error:', error);
        throw new Error(error.message);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const avatarUrl = urlData.publicUrl;
      console.log('Avatar uploaded successfully:', avatarUrl);

      // Update user profile with new avatar URL
      await updateProfile({ avatarUrl });

      return avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };

  const value = {
    user,
    setUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    signOut,
    updateProfile,
    uploadAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
