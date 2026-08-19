import { apiClient } from './client';
import type { ApiResponse, User } from '../types';

export const loginFn = async (data: any) => {
  const res = await apiClient.post<ApiResponse<{ user: User; accessToken: string; refreshToken?: string }>>('/auth/login', data);
  return res.data;
};

export const signupFn = async (data: any) => {
  const res = await apiClient.post<ApiResponse<User>>('/auth/signup', data);
  return res.data;
};

export const forgotPasswordFn = async (data: { email: string }) => {
  const res = await apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', data);
  return res.data;
};

export const resetPasswordFn = async (data: { token: string; password: string }) => {
  const res = await apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', data);
  return res.data;
};
