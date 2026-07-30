export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

export interface User {
  id: string;
  email: string;
  isVerified: boolean;
}

export interface UserSettings {
  defaultCycleLength: number;
  defaultPeriodLength: number;
  reminderPeriodDaysBefore: number;
  reminderNotificationsEnabled: boolean;
  theme: string;
  hasCompletedOnboarding: boolean;
  periodStress?: string | null;
}

export interface DailyCheckIn {
  id: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface PeriodLog {
  id: string;
  startDate: string; // ISO DateTime string
  endDate: string | null;
  notes: string | null;
  flowIntensity: string | null;
}

export type SymptomCategory = 
  | 'CRAMPS' | 'MOOD' | 'FLOW' | 'HEADACHE' 
  | 'ACNE' | 'ENERGY' | 'DIGESTION' | 'OTHER';

export interface SymptomLog {
  id: string;
  date: string; // ISO DateTime string
  category: SymptomCategory;
  type: string;
  intensity: number | null; // 1-5 scale
  value: string | null;
  details: Record<string, any> | null;
  notes: string | null;
}

export interface CyclePredictions {
  history: {
    avgCycleLength: number;
    avgPeriodLength: number;
    lastPeriodStartDate: string;
  };
  predictions: {
    nextPeriodStart: string;
    nextPeriodEnd: string;
    ovulationDate: string;
    fertileWindowStart: string;
    fertileWindowEnd: string;
  } | null;
}
