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

  // for MVP reasons
  if (email === 'admin@example.org' && password === 'test') {
    return {
      access_token: '<sample_access_token>',
      token_type: 'Bearer',
      user: {
        email: 'admin@example.org',
        name: 'Admin User',
        role: 'admin',
        organization: 'Example Org',
        region: 'Global'
      }
    }
  }

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
