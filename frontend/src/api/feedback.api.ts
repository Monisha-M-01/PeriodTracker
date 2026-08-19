import { apiClient } from './client';

export interface FeedbackData {
  q1Rating: string;
  q1Text?: string;
  q2Rating: string;
  q2Text?: string;
  q3Rating: string;
  q3Text?: string;
  q4Rating: string;
  q4Text?: string;
  q5Rating: string;
  q5Text?: string;
  finalSuggestions?: string;
}

export const submitFeedbackFn = async (data: FeedbackData) => {
  const response = await apiClient.post('/feedback', data);
  return response.data;
};
