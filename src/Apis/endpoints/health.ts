import apiClient from '../axios';
import type { HealthResponse } from '../types';

/**
 * Check API health status
 * @returns Promise with health check response
 */
export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthResponse>('/health');
  return response.data;
};

// Export types for use in components
export type { HealthResponse };
