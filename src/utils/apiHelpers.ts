import type { AxiosError } from 'axios';

/**
 * Extracts a user-friendly error message from an API error response.
 * Handles the standardized backend format: { success, message, errors }
 * as well as legacy formats (raw strings, { error }, ModelState).
 */
export function extractApiError(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const axiosError = error as AxiosError<{
    success?: boolean;
    message?: string;
    errors?: string[];
    error?: string;
    title?: string;
  }>;

  const data = axiosError?.response?.data;

  if (!data) {
    return axiosError?.message || fallback;
  }

  // Standardized format: { success: false, message, errors }
  if (typeof data === 'object') {
    // If errors array exists, join them
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.join('. ');
    }
    // Message field
    if (data.message && typeof data.message === 'string' && data.message.length > 0) {
      return data.message;
    }
    // Legacy { error } format
    if (data.error && typeof data.error === 'string') {
      return data.error;
    }
    // ProblemDetails format
    if (data.title && typeof data.title === 'string') {
      return data.title;
    }
  }

  // Raw string response
  if (typeof data === 'string' && (data as string).length > 0) {
    return data;
  }

  return fallback;
}

/**
 * Extracts field-level validation errors from the API response.
 * Maps backend ModelState errors to form field names.
 */
export function extractFieldErrors(error: unknown): Record<string, string> {
  const axiosError = error as AxiosError<{
    errors?: Record<string, string[]> | string[];
  }>;

  const errors = axiosError?.response?.data?.errors;
  if (!errors || Array.isArray(errors)) return {};

  const fieldErrors: Record<string, string> = {};
  for (const [key, messages] of Object.entries(errors)) {
    if (Array.isArray(messages) && messages.length > 0) {
      // Convert PascalCase backend field name to camelCase
      const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
      fieldErrors[camelKey] = messages[0];
    }
  }
  return fieldErrors;
}
