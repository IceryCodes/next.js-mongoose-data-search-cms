import type { CreateAxiosDefaults } from 'axios';
import axios from 'axios';

export enum ThrowErrorMessage {
  GidRequired = 'Gid is required',
  DateRequired = 'Date is required',
  TokenExpired = 'Token is expired',
}

export enum HttpStatus {
  Ok = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

const axiosBaseConfig: CreateAxiosDefaults = {
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const apiOrigin = axios.create({ ...axiosBaseConfig, baseURL: process.env.NEXT_PUBLIC_API_BASE_URL });

export { apiOrigin };
