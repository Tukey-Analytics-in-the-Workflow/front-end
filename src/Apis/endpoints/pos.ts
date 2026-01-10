import apiClient from '../axios';
import type { UploadPosResponse, HTTPValidationError } from '../types';

/**
 * Upload POS data file
 * @param file - File to upload (binary)
 * @returns Promise with upload response
 */
export const uploadPos = async (file: File): Promise<UploadPosResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<UploadPosResponse>('/pos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Export types for use in components
export type { UploadPosResponse, HTTPValidationError };
