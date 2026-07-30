import { apiClient } from './client';
import type { ApiResponse, PeriodLog } from '../types';

export const logPeriodFn = async (data: { startDate: string; endDate?: string | null; notes?: string }) => {
  const res = await apiClient.post<ApiResponse<PeriodLog>>('/period', data);
  return res.data;
};

export const updatePeriodFn = async (id: string, data: Partial<PeriodLog>) => {
  const res = await apiClient.patch<ApiResponse<PeriodLog>>(`/period/${id}`, data);
  return res.data;
};

export const getPeriodsFn = async () => {
  const res = await apiClient.get<ApiResponse<PeriodLog[]>>('/period?limit=100');
  return res.data;
};

export const deletePeriodFn = async (id: string) => {
  const res = await apiClient.delete<ApiResponse<{ message: string }>>(`/period/${id}`);
  return res.data;
};
