import { useQuery, useMutation } from '@tanstack/react-query';
import { listDashboards, getDashboardEmbedToken } from '../endpoints/dashboards';
import type { Dashboard, DashboardEmbedToken } from '../types';
import { AxiosError } from 'axios';

export const useDashboards = () => {
  return useQuery<Dashboard[], AxiosError>({
    queryKey: ['dashboards'],
    queryFn: listDashboards,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

interface UseDashboardEmbedTokenOptions {
  onSuccess?: (data: DashboardEmbedToken) => void;
  onError?: (error: AxiosError) => void;
}

export const useDashboardEmbedToken = (options?: UseDashboardEmbedTokenOptions) => {
  return useMutation<DashboardEmbedToken, AxiosError, string>({
    mutationFn: getDashboardEmbedToken,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
