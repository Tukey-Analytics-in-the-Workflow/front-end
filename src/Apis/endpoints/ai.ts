import apiClient from '../axios';
import type { AIQuery, AIDecisionResponse } from '../types';

/**
 * Get AI decision based on structured query
 * @param query - AI query object with time_period, region, top_products, and sales_trend
 * @returns Promise with AI decision response
 */
export const getAIDecision = async (query: AIQuery): Promise<AIDecisionResponse> => {
  const response = await apiClient.post<AIDecisionResponse>('/ai/decision', query);
  return response.data;
};

// Export types for use in components
export type { AIQuery, AIDecisionResponse };
