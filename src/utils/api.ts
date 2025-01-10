import type { AxiosError, AxiosHeaders, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

import { renewToken } from './token';

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
  TooManyRequests = 429,
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
        const token: string | null = localStorage.getItem('token');
        // Ensure headers are initialized
        if (!config.headers) config.headers = {} as AxiosHeaders; // Initialize headers if undefined

        // Attach tokens if available
        if (token) config.headers.Authorization = `Bearer ${token}`;
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
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest || error.response?.status !== HttpStatus.Unauthorized || originalRequest.retryAttempt) {
      return Promise.reject(error);
    }

    originalRequest.retryAttempt = true;

    const token: string | null = localStorage.getItem('token');
    const newToken: string | null = await renewToken(token); // Renew the token

    if (newToken) {
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiOrigin(originalRequest); // Retry the original request with the new token
    }

    return Promise.reject(error); // Reject if renewal fails
  }
);

export { apiOrigin };
