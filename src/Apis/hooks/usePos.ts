import { useMutation } from '@tanstack/react-query';
import { uploadPos } from '../endpoints/pos';
import type { UploadPosResponse, HTTPValidationError } from '../types';
import { AxiosError } from 'axios';

interface UseUploadPosOptions {
  onSuccess?: (data: UploadPosResponse) => void;
  onError?: (error: AxiosError<HTTPValidationError>) => void;
}

export const useUploadPos = (options?: UseUploadPosOptions) => {
  return useMutation<UploadPosResponse, AxiosError<HTTPValidationError>, File>({
    mutationFn: uploadPos,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
