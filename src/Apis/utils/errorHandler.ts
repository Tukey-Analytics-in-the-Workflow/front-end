import { AxiosError } from 'axios';
import type { HTTPValidationError } from '../types';

/**
 * Extract error message from Axios error
 */
export const getErrorMessage = (error: AxiosError<HTTPValidationError>): string => {
  // Handle validation errors (422)
  if (error.response?.data?.detail) {
    const details = error.response.data.detail;
    if (Array.isArray(details) && details.length > 0) {
      return details[0].msg || 'Validation error occurred';
    }
    if (typeof details === 'string') {
      return details;
    }
  }

  // Handle HTTP status errors
  if (error.response) {
    switch (error.response.status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Forbidden. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 422:
        return 'Invalid input. Please check your data.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return error.response.data?.detail || `Error ${error.response.status}: ${error.response.statusText}`;
    }
  }

  // Handle network errors
  if (error.request) {
    return 'Network error. Please check your internet connection.';
  }

  // Handle other errors
  return error.message || 'An unexpected error occurred.';
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: AxiosError<HTTPValidationError>): boolean => {
  return error.response?.status === 422;
};

/**
 * Get validation errors as an array
 */
export const getValidationErrors = (error: AxiosError<HTTPValidationError>): string[] => {
  if (error.response?.data?.detail && Array.isArray(error.response.data.detail)) {
    return error.response.data.detail.map((err) => err.msg || 'Validation error');
  }
  return [];
};
