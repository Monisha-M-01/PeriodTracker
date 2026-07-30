import { apiClient } from './client';
import type { ApiResponse } from '../types';

export interface DailyCheckIn {
  id: string;
  userId: string;
  date: string;
  mood?: number;
  stress?: number;
  diet?: number;
  note?: string;
  answers?: string;
  moodString?: string;
  symptoms?: string;
  workouts?: string;
  dietDetails?: string;
  sleepBedtime?: string;
  sleepWakeTime?: string;
  sleepDurationMinutes?: number;
  sleepQuality?: string;
  createdAt: string;
  updatedAt: string;
}

export type UpsertCheckInPayload = {
  date: string;
  mood?: number;
  stress?: number;
  diet?: number;
  note?: string;
  answers?: string;
  moodString?: string;
  symptoms?: string;
  workouts?: string;
  dietDetails?: string;
  sleepBedtime?: string;
  sleepWakeTime?: string;
  sleepDurationMinutes?: number;
  sleepQuality?: string;
}

export const upsertCheckInFn = async (data: UpsertCheckInPayload) => {
  const res = await apiClient.post<ApiResponse<DailyCheckIn>>('/checkins', data);
  return res.data;
};

export const getTodayCheckInFn = async () => {
  const res = await apiClient.get<ApiResponse<DailyCheckIn | null>>('/checkins/today');
  return res.data;
};

export const getCheckInsFn = async (from: string, to: string) => {
  const res = await apiClient.get<ApiResponse<DailyCheckIn[]>>(`/checkins?from=${from}&to=${to}`);
  return res.data;
};
