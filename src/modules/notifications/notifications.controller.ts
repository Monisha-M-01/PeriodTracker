import { Request, Response } from 'express';
import { notificationsService } from './notifications.service';
import { notificationsCron } from './notifications.cron';
import { z } from 'zod';

const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export const subscribe = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const subscription = subscribeSchema.parse(req.body);

    await notificationsService.subscribeUser(userId, subscription);
    res.status(201).json({ message: 'Subscription saved successfully' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(400).json({ error: 'Invalid subscription data' });
  }
};

export const unsubscribe = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { endpoint } = req.body;

    if (!endpoint) {
       res.status(400).json({ error: 'Endpoint is required' });
       return;
    }

    await notificationsService.unsubscribeUser(userId, endpoint);
    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const runCron = async (req: Request, res: Response) => {
  // Ideally, secure this endpoint with a secret key passed in headers by cron-job.org
  // For simplicity, we execute it directly.
  try {
    // Fire and forget so we don't hold up the response
    notificationsCron.processNotifications().catch(console.error);
    res.status(200).json({ message: 'Cron job triggered' });
  } catch (error) {
    console.error('Error triggering cron:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
