import { apiClient } from './client';
import type { ApiResponse, User } from '../types';

export const loginFn = async (data: any) => {
  const res = await apiClient.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/login', data);
  return res.data;
};

export const signupFn = async (data: any) => {
  const res = await apiClient.post<ApiResponse<User>>('/auth/signup', data);
  return res.data;
};
