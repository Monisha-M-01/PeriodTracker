import { apiClient } from './client';
import type { ApiResponse, SymptomLog } from '../types';

export const logSymptomFn = async (data: any) => {
  const res = await apiClient.post<ApiResponse<SymptomLog>>('/symptoms', data);
  return res.data;
};

export const getSymptomsFn = async () => {
  const res = await apiClient.get<ApiResponse<SymptomLog[]>>('/symptoms?limit=500');
  return res.data;
};
