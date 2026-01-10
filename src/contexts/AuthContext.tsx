import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginAPI, type LoginResponse } from '@/Apis/endpoints/auth';
import { getErrorMessage } from '@/Apis/utils/errorHandler';
import { AxiosError } from 'axios';
import type { HTTPValidationError } from '@/Apis/types';

export type UserRole = 'admin' | 'user';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  organization: string;
  region: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  // signup: (data: SignupData) => Promise<boolean>; // Commented out - signup disabled
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
}

// interface SignupData {
//   name: string;
//   email: string;
//   password: string;
//   organization: string;
//   role?: UserRole;
//   region?: string;
// }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('tukey_user');
    const storedToken = localStorage.getItem('tukey_auth_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('tukey_user');
        localStorage.removeItem('tukey_auth_token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await loginAPI(email, password);
      
      // Store token
      if (response.access_token) {
        localStorage.setItem('tukey_auth_token', response.access_token);
      }

      // Transform API response to User format
      const userData: User = {
        email: response.user?.email || email,
        name: response.user?.name || email.split('@')[0],
        role: (response.user?.role as UserRole) || 'user',
        organization: response.user?.organization || 'Tukey Organization',
        region: response.user?.region || 'North America',
      };

      setUser(userData);
      localStorage.setItem('tukey_user', JSON.stringify(userData));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      const axiosError = error as AxiosError<HTTPValidationError>;
      const errorMessage = getErrorMessage(axiosError);
      return { success: false, error: errorMessage };
    }
  };

  // const signup = async (data: SignupData): Promise<boolean> => {
  //   const newUser: User = {
  //     email: data.email,
  //     name: data.name,
  //     role: data.role || 'user',
  //     organization: data.organization,
  //     region: data.region || 'North America',
  //   };
  //   setUser(newUser);
  //   localStorage.setItem('tukey_user', JSON.stringify(newUser));
  //   return true;
  // };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tukey_user');
    localStorage.removeItem('tukey_auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        // signup, // Commented out - signup disabled
        logout,
        isAdmin: user?.role === 'admin',
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
