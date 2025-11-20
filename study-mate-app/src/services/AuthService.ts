import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { User } from '../entities/User';

// Define types for API responses
interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

// Define types for authentication
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
  academicLevel: string;
  institution?: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface ResetPasswordData {
  token: string;
  password: string;
}

class AuthService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to add auth token to requests
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        
        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token available');
            
            const response = await this.refreshToken(refreshToken);
            const { accessToken } = response.data;
            
            // Update the stored tokens
            localStorage.setItem('accessToken', accessToken);
            
            // Update the authorization header
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            
            // Retry the original request
            return this.api(originalRequest);
          } catch (error) {
            // If refresh fails, clear tokens and redirect to login
            this.clearAuth();
            window.location.href = '/login';
            return Promise.reject(error);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', credentials);
      this.setAuth(response.data);
      return { data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/register', userData);
      this.setAuth(response.data);
      return { data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      await this.api.post('/auth/logout');
      this.clearAuth();
      return {};
    } catch (error) {
      this.clearAuth();
      return this.handleError(error);
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    try {
      await this.api.post('/auth/forgot-password', { email });
      return {};
    } catch (error) {
      return this.handleError(error);
    }
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/reset-password', {
        token,
        password,
      });
      this.setAuth(response.data);
      return { data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async verifyEmail(token: string): Promise<ApiResponse<{ verified: boolean }>> {
    try {
      const response = await this.api.post<{ verified: boolean }>('/auth/verify-email', { token });
      return { data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async resendVerificationEmail(email: string): Promise<ApiResponse<void>> {
    try {
      await this.api.post('/auth/resend-verification', { email });
      return {};
    } catch (error) {
      return this.handleError(error);
    }
  }

  async refreshToken(refreshToken: string): Promise<AxiosResponse<{ accessToken: string }>> {
    const response = await axios.post<{ accessToken: string }>(
      `${this.baseURL}/auth/refresh-token`,
      { refreshToken }
    );
    return response;
  }

  // Helper methods
  private setAuth(authData: AuthResponse): void {
    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('user', JSON.stringify(authData.user));
  }

  clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  private handleError(error: any): ApiResponse<any> {
    if (axios.isAxiosError(error)) {
      return {
        error: {
          message: error.response?.data?.message || error.message,
          code: error.response?.data?.code,
          details: error.response?.data?.errors,
        },
      };
    }
    return { error: { message: 'An unexpected error occurred' } };
  }
}

export const authService = new AuthService();
export default authService;
