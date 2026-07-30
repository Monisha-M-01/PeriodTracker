import { apiClient } from './client';
import type { ApiResponse, UserSettings } from '../types';

export const getSettingsFn = async () => {
  const res = await apiClient.get<ApiResponse<UserSettings>>('/users/settings');
  return res.data;
};

export const updateSettingsFn = async (data: Partial<UserSettings>) => {
  const res = await apiClient.put<ApiResponse<UserSettings>>('/users/settings', data);
  return res.data;
};
