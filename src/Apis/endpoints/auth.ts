import apiClient from '../axios';
import type { HTTPValidationError } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
  user?: {
    email: string;
    name: string;
    role?: string;
    organization?: string;
    region?: string;
  };
  [key: string]: unknown;
}

/**
 * Login user
 * @param email - User email
 * @param password - User password
 * @returns Promise with login response containing access token
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', null, {
    params: {
      email,
      password,
    },
  });

  return response.data;
};

// Export types for use in components
export type { HTTPValidationError };
