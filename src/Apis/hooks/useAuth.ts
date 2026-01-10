import { useMutation } from '@tanstack/react-query';
import { login, type LoginRequest, type LoginResponse } from '../endpoints/auth';
import { AxiosError } from 'axios';
import type { HTTPValidationError } from '../types';

interface UseLoginOptions {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: AxiosError<HTTPValidationError>) => void;
}

export const useLogin = (options?: UseLoginOptions) => {
  return useMutation<LoginResponse, AxiosError<HTTPValidationError>, LoginRequest>({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
