import { useMutation } from '@tanstack/react-query';
import { getAIDecision } from '../endpoints/ai';
import type { AIQuery, AIDecisionResponse } from '../types';
import { AxiosError } from 'axios';

interface UseAIDecisionOptions {
  onSuccess?: (data: AIDecisionResponse, variables: AIQuery) => void;
  onError?: (error: AxiosError) => void;
}

export const useAIDecision = (options?: UseAIDecisionOptions) => {
  return useMutation<AIDecisionResponse, AxiosError, AIQuery>({
    mutationFn: getAIDecision,
    onSuccess: (data, variables) => {
      options?.onSuccess?.(data, variables);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
