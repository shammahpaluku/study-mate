import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { authService, ApiResponse } from '../../services/AuthService';
import { User } from '../../entities/User';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<ApiResponse<any>>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    academicLevel: string;
    institution?: string;
  }) => Promise<ApiResponse<any>>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<ApiResponse<any>>;
  resetPassword: (token: string, password: string) => Promise<ApiResponse<any>>;
  verifyEmail: (token: string) => Promise<ApiResponse<any>>;
  resendVerificationEmail: (email: string) => Promise<ApiResponse<any>>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      const currentUser = authService.getCurrentUser();
      const isAuthenticated = authService.isAuthenticated();
      
      if (isAuthenticated && currentUser) {
        setUser(currentUser);
      } else if (isAuthenticated) {
        // Token exists but no user data - fetch user data
        // This would typically be an API call to /me or similar endpoint
        // For now, we'll just clear the auth state
        authService.clearAuth();
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      authService.clearAuth();
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  // Check if user is authenticated on initial load
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Handle protected routes
  useEffect(() => {
    if (!isInitialized) return;
    
    const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/resend-verification'];
    const isPublicPath = publicPaths.some(path => location.pathname.startsWith(path));
    
    if (!authService.isAuthenticated() && !isPublicPath) {
      navigate('/login', { replace: true, state: { from: location } });
    } else if (authService.isAuthenticated() && isPublicPath) {
      // Redirect to dashboard if user is logged in and tries to access auth pages
      navigate('/dashboard', { replace: true });
    }
  }, [isInitialized, location, navigate]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      if (response.data) {
        setUser(response.data.user);
        
        // Redirect based on email verification status
        if (response.data.user.isVerified) {
          const redirectTo = location.state?.from?.pathname || '/dashboard';
          navigate(redirectTo, { replace: true });
        } else {
          navigate('/verify-email', { replace: true });
        }
        
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      
      toast({
        title: 'Login failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    academicLevel: string;
    institution?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      
      if (response.data) {
        setUser(response.data.user);
        navigate('/verify-email', { replace: true });
        
        toast({
          title: 'Registration successful',
          description: 'Please check your email to verify your account.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
      
      toast({
        title: 'Registration failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await authService.forgotPassword(email);
      
      toast({
        title: 'Email sent',
        description: 'Check your email for a link to reset your password.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      return response;
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await authService.resetPassword(token, password);
      
      if (response.data) {
        setUser(response.data.user);
        navigate('/dashboard', { replace: true });
        
        toast({
          title: 'Password reset successful',
          description: 'Your password has been updated.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      
      return response;
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const response = await authService.verifyEmail(token);
      
      if (response.data?.verified && user) {
        setUser({ ...user, isVerified: true });
        
        toast({
          title: 'Email verified',
          description: 'Your email has been successfully verified!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        navigate('/dashboard', { replace: true });
      }
      
      return response;
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const response = await authService.resendVerificationEmail(email);
      
      toast({
        title: 'Verification email sent',
        description: 'Please check your email for the verification link.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      return response;
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      // Optionally update the user data in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isInitialized,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerificationEmail,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
