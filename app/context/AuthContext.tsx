import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiClient, User } from '../../lib/api-client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token and restore session
    const restoreSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('auth_token');
        if (storedToken) {
          apiClient.setAuthToken(storedToken);
          const response = await apiClient.getUserProfile();
          if (response.data) {
            setUser(response.data);
          } else {
            // Token is invalid, remove it
            await SecureStore.deleteItemAsync('auth_token');
            apiClient.setAuthToken(null);
          }
        }
      } catch (error) {
        console.error('Error restoring session:', error);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiClient.signIn(email, password);
      
      if (response.data) {
        setUser(response.data.user);
        // Store token securely
        await SecureStore.setItemAsync('auth_token', response.data.token);
        return { error: null };
      } else {
        return { error: response.error || 'Sign in failed' };
      }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign in failed' };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const response = await apiClient.signUp(email, password, fullName);
      
      if (response.data) {
        setUser(response.data.user);
        // Store token securely
        await SecureStore.setItemAsync('auth_token', response.data.token);
        return { error: null };
      } else {
        return { error: response.error || 'Sign up failed' };
      }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign up failed' };
    }
  };

  const signOut = async () => {
    try {
      await apiClient.signOut();
      await SecureStore.deleteItemAsync('auth_token');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await apiClient.resetPassword(email);
      return { error: response.error || null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Reset password failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default export for the provider
export default AuthProvider;
