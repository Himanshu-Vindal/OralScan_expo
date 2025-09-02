import Constants from 'expo-constants';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || 'https://oralscan.careease.in';

// Debug logging
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment variables:', {
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
});

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  language_preference?: string;
}

export interface ScanResult {
  id: string;
  user_id: string;
  scan_date: string;
  overall_score: number;
  issues_detected: any;
  recommendations: any;
  image_urls: string[];
  ai_analysis: any;
  created_at: string;
}

export interface ProductSearchResult {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  image_url: string;
  link: string;
  source: string;
  rating?: number;
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;
  private readonly defaultTimeout = 30000; // 30 seconds

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.validateConfiguration();
  }

  private validateConfiguration() {
    if (!this.baseUrl) {
      throw new Error('API_BASE_URL is not configured. Please check your environment variables.');
    }
    
    try {
      new URL(this.baseUrl);
    } catch {
      throw new Error(`Invalid API_BASE_URL: ${this.baseUrl}. Please provide a valid URL.`);
    }
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private validateInput(data: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit & { timeout?: number } = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const timeout = options.timeout || this.defaultTimeout;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    console.log('Making API request:', { 
      url, 
      method: options.method || 'GET',
      hasAuth: !!this.authToken,
      timeout 
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        data = { message: text };
      }
      
      console.log('API response:', { 
        status: response.status, 
        ok: response.ok, 
        contentType,
        dataType: typeof data 
      });

      if (!response.ok) {
        const errorMessage = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
        return {
          error: errorMessage,
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('API request timeout:', { url, timeout });
          return {
            error: `Request timeout after ${timeout}ms`,
            status: 408,
          };
        }
        
        console.error('API request failed:', error.message);
        return {
          error: error.message,
          status: 0,
        };
      }
      
      console.error('Unknown API error:', error);
      return {
        error: 'Unknown network error',
        status: 0,
      };
    }
  }

  // AI Analysis API
  async analyzeOralHealth(
    imageData: string | string[],
    userLocation: string,
    userLanguage: string,
    userId?: string,
    questionnaireData?: any
  ): Promise<ApiResponse<ScanResult>> {
    try {
      this.validateInput({ imageData, userLocation, userLanguage }, ['imageData', 'userLocation', 'userLanguage']);
      
      return this.makeRequest<ScanResult>('/api/gemini-analysis', {
        method: 'POST',
        body: JSON.stringify({
          imageData,
          userLocation,
          userLanguage,
          userId,
          questionnaireData,
        }),
        timeout: 60000, // Extended timeout for AI analysis
      });
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Invalid input for oral health analysis',
        status: 400,
      };
    }
  }

  // Product Search API
  async searchProducts(
    query: string,
    region: string = 'India',
    limit: number = 25
  ): Promise<ApiResponse<{ products: ProductSearchResult[] }>> {
    try {
      this.validateInput({ query }, ['query']);
      
      if (limit < 1 || limit > 100) {
        throw new Error('Limit must be between 1 and 100');
      }
      
      return this.makeRequest<{ products: ProductSearchResult[] }>('/api/search-products', {
        method: 'POST',
        body: JSON.stringify({
          query: query.trim(),
          region,
          limit,
        }),
      });
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Invalid input for product search',
        status: 400,
      };
    }
  }

  // Image Validation API
  async validateImage(imageData: string): Promise<ApiResponse<any>> {
    try {
      this.validateInput({ imageData }, ['imageData']);
      
      return this.makeRequest<any>('/api/validate-image', {
        method: 'POST',
        body: JSON.stringify({
          imageData,
        }),
      });
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Invalid image data',
        status: 400,
      };
    }
  }

  // Authentication methods
  async signIn(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      this.validateInput({ email, password }, ['email', 'password']);
      
      const response = await this.makeRequest<{ user: User; token: string }>('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      
      if (response.data?.token) {
        this.setAuthToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Invalid sign in credentials',
        status: 400,
      };
    }
  }

  async signUp(email: string, password: string, fullName?: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      this.validateInput({ email, password }, ['email', 'password']);
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      const response = await this.makeRequest<{ user: User; token: string }>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password, 
          fullName: fullName?.trim() 
        }),
      });
      
      if (response.data?.token) {
        this.setAuthToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Invalid sign up data',
        status: 400,
      };
    }
  }

  async signOut(): Promise<ApiResponse<any>> {
    const response = await this.makeRequest<any>('/api/auth/signout', {
      method: 'POST',
    });
    
    this.setAuthToken(null);
    return response;
  }

  async resetPassword(email: string): Promise<ApiResponse<any>> {
    try {
      this.validateInput({ email }, ['email']);
      
      return this.makeRequest<any>('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Invalid email for password reset',
        status: 400,
      };
    }
  }

  // Get user profile
  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/api/user/profile');
  }

  // Get user scans
  async getUserScans(userId: string): Promise<ApiResponse<ScanResult[]>> {
    try {
      this.validateInput({ userId }, ['userId']);
      
      return this.makeRequest<ScanResult[]>(`/api/user/${userId}/scans`);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Invalid user ID',
        status: 400,
      };
    }
  }

  // Health check endpoint
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.makeRequest<{ status: string; timestamp: string }>('/api/health', {
      method: 'GET',
      timeout: 10000, // Shorter timeout for health checks
    });
  }
}

export const apiClient = new ApiClient();
