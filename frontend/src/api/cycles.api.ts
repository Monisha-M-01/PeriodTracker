import { apiClient } from './client';
import type { ApiResponse, CyclePredictions } from '../types';

export const getPredictionsFn = async () => {
  const res = await apiClient.get<ApiResponse<CyclePredictions>>('/cycles/predictions');
  return res.data;
};
