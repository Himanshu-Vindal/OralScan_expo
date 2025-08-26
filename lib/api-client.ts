import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

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

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      return {
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.error || 'Request failed',
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
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
    return this.makeRequest<ScanResult>('/api/gemini-analysis', {
      method: 'POST',
      body: JSON.stringify({
        imageData,
        userLocation,
        userLanguage,
        userId,
        questionnaireData,
      }),
    });
  }

  // Product Search API
  async searchProducts(
    query: string,
    region: string = 'India',
    limit: number = 25
  ): Promise<ApiResponse<{ products: ProductSearchResult[] }>> {
    return this.makeRequest<{ products: ProductSearchResult[] }>('/api/search-products', {
      method: 'POST',
      body: JSON.stringify({
        query,
        region,
        limit,
      }),
    });
  }

  // Image Validation API
  async validateImage(imageData: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/api/validate-image', {
      method: 'POST',
      body: JSON.stringify({
        imageData,
      }),
    });
  }

  // Authentication methods (if you have auth endpoints in Oralcan-main)
  async signIn(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.makeRequest<{ user: User; token: string }>('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.data?.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  async signUp(email: string, password: string, fullName?: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.makeRequest<{ user: User; token: string }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    
    if (response.data?.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  async signOut(): Promise<ApiResponse<any>> {
    const response = await this.makeRequest<any>('/api/auth/signout', {
      method: 'POST',
    });
    
    this.setAuthToken(null);
    return response;
  }

  async resetPassword(email: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Get user profile
  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/api/user/profile');
  }

  // Get user scans
  async getUserScans(userId: string): Promise<ApiResponse<ScanResult[]>> {
    return this.makeRequest<ScanResult[]>(`/api/user/${userId}/scans`);
  }
}

export const apiClient = new ApiClient();
