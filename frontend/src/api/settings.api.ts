import { apiClient } from './client';
import type { ApiResponse, UserSettings } from '../types';

export const getSettingsFn = async () => {
  const res = await apiClient.get<ApiResponse<{ settings: UserSettings }>>('/users/me');
  // Map the response to look like an ApiResponse<UserSettings> for the component
  return { 
    success: res.data.success, 
    data: res.data.data.settings, 
    error: res.data.error 
  };
};

export const updateSettingsFn = async (data: Partial<UserSettings>) => {
  const res = await apiClient.patch<ApiResponse<UserSettings>>('/users/me/settings', data);
  return res.data;
};

export const updateProfileFn = async (data: { name: string }) => {
  const res = await apiClient.patch<ApiResponse<any>>('/users/me', data);
  return res.data;
};
