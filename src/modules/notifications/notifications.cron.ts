import { prisma } from '../../config/prisma';
import { notificationsService } from './notifications.service';
import { CyclesService } from '../cycles/cycles.service';

export class NotificationsCron {
  async processNotifications() {
    const now = new Date();
    const currentHour = now.getHours();
    
    // We assume the cron is triggered hourly.
    // We send evening check-in nudges around 7 PM (19:00) server time.
    const isEvening = currentHour === 19;
    
    // We send period reminders around 9 AM (9:00) server time.
    const isMorning = currentHour === 9;

    // Find all users who have push subscriptions
    const usersWithPush = await prisma.user.findMany({
      where: {
        pushSubscriptions: {
          some: {}
        },
        settings: {
          reminderNotificationsEnabled: true
        }
      },
      include: {
        settings: true,
      }
    });

    for (const user of usersWithPush) {
      try {
        const todayStr = now.toISOString().split('T')[0];

        // 1. Period Reminder (Morning)
        if (isMorning) {
          const predictionData = await CyclesService.getCyclePredictions(user.id);
          
          if (predictionData && predictionData.predictions) {
            const nextPeriodStart = predictionData.predictions.nextPeriodStart;
            
            // Calculate days until next period
            const diffTime = nextPeriodStart.getTime() - now.getTime();
            const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            const reminderDaysBefore = user.settings?.reminderPeriodDaysBefore || 2;

            if (daysUntil === reminderDaysBefore) {
              await notificationsService.sendNotification(user.id, {
                title: 'Gentle Reminder 🌙',
                body: `Your period is expected in ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}. Take care of yourself!`,
                url: '/today',
              });
            } else if (daysUntil === 0) {
              await notificationsService.sendNotification(user.id, {
                title: 'Period Expected Today 🌸',
                body: "Your period is expected today. Log it in the app if it arrives.",
                url: '/today',
              });
            }
          }
        }

        // 2. Daily Check-in Nudge (Evening)
        if (isEvening) {
          // Start of today and end of today
          const startOfToday = new Date(now);
          startOfToday.setHours(0, 0, 0, 0);
          
          const endOfToday = new Date(now);
          endOfToday.setHours(23, 59, 59, 999);

          const checkIn = await prisma.dailyCheckIn.findFirst({
            where: {
              userId: user.id,
              date: {
                gte: startOfToday,
                lte: endOfToday
              }
            }
          });

          // If no check-in today, send a gentle nudge
          if (!checkIn) {
            await notificationsService.sendNotification(user.id, {
              title: 'Check-in Time 🌷',
              body: 'Take a moment to log your mood and symptoms for today.',
              url: '/today',
            });
          }
        }
      } catch (error) {
        console.error(`Error processing notifications for user ${user.id}:`, error);
      }
    }
  }
}

export const notificationsCron = new NotificationsCron();
