import { useQuery } from '@tanstack/react-query';
import { checkHealth } from '../endpoints/health';
import type { HealthResponse } from '../types';
import { AxiosError } from 'axios';

export const useHealth = (enabled: boolean = true) => {
  return useQuery<HealthResponse, AxiosError>({
    queryKey: ['health'],
    queryFn: checkHealth,
    enabled,
    refetchInterval: 60000, // Check every minute
    retry: 1,
  });
};
