import type { AxiosError, AxiosHeaders, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

// Extend InternalAxiosRequestConfig to include retryAttempt
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  retryAttempt?: boolean; // Optional property to track retry state
}

// Your existing error message enums
export enum ThrowErrorMessage {
  GidRequired = 'Gid is required',
  DateRequired = 'Date is required',
  TokenExpired = 'Token is expired',
}

export enum HttpStatus {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  InternalServerError = 500,
}

// Custom error logging
export const logApiError = ({ error, message }: { error: unknown; message: string }) => {
  if (axios.isAxiosError(error) && error.response) {
    console.error(`${HttpStatus[error.response.status]}: ${message}`);
  } else {
    console.error(`Unexpected error: ${error}`);
  }
};

// Base Axios configuration
const axiosBaseConfig: CreateAxiosDefaults = {
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create Axios instance
const apiOrigin = axios.create({ ...axiosBaseConfig, baseURL: process.env.NEXT_PUBLIC_API_BASE_URL });

// Helper function to check if running in the browser
const isBrowser = typeof window !== 'undefined';

// Global flag for enabling/disabling Axios automatic error logging based on environment
const enableAxiosLogs = process.env.NODE_ENV !== 'production'; // Enable logs in development, disable in production

// Request interceptor to attach token from sessionStorage
apiOrigin.interceptors.request.use(
  (config: CustomAxiosRequestConfig): CustomAxiosRequestConfig => {
    try {
      if (isBrowser) {
        const token = sessionStorage.getItem('token'); // Get token from sessionStorage in the browser

        // Ensure headers are initialized
        if (!config.headers) {
          config.headers = {} as AxiosHeaders; // Initialize headers if undefined
        }

        // Attach token if available
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config; // Return the modified config
    } catch (error) {
      console.error('Request Interceptor Error:', error);
      throw error; // Re-throw the error to fail the request if there's an issue
    }
  },
  (error: AxiosError) => {
    if (enableAxiosLogs) {
      console.error('Request Error:', error);
    }
    return Promise.reject(error); // Reject the request promise in case of error
  }
);

// Response interceptor to handle token renewal and suppress automatic error logs in production
apiOrigin.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig; // Cast to extended config

    // Check if originalRequest exists and is defined before retrying
    if (!originalRequest || error.response?.status !== HttpStatus.Unauthorized || originalRequest.retryAttempt) {
      if (enableAxiosLogs) {
        console.error('Response Error:', error); // Only log in dev
      }
      return Promise.reject(error); // Reject if original request is undefined or retry logic isn't applicable
    }

    originalRequest.retryAttempt = true; // Mark retry to avoid infinite loops

    try {
      // Token renewal logic - assuming `/api/renew-token` is your renewal API
      const renewResponse = await axios.post('/api/renew-token');
      const newToken = renewResponse.data.token;

      // Store the new token in sessionStorage only in the browser
      if (isBrowser) {
        sessionStorage.setItem('token', newToken);
      }

      // Ensure headers are initialized
      if (!originalRequest.headers) {
        originalRequest.headers = {} as AxiosHeaders; // Initialize headers if undefined
      }

      // Update original request's Authorization header with the new token
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      // Retry the original request with the new token
      return apiOrigin(originalRequest);
    } catch (error) {
      const message: string = 'Token Renewal Error';
      logApiError({ error, message });

      return Promise.reject(error); // Reject if token renewal fails
    }
  }
);

export { apiOrigin };
