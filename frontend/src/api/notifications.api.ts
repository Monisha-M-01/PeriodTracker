import { apiClient } from './client';

export const subscribeToPush = async (subscription: PushSubscription) => {
  const response = await apiClient.post('/notifications/subscribe', subscription.toJSON());
  return response.data;
};

export const unsubscribeFromPush = async (endpoint: string) => {
  const response = await apiClient.post('/notifications/unsubscribe', { endpoint });
  return response.data;
};
