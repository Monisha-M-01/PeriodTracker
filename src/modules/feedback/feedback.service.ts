import { prisma } from '../../config/prisma';

export class FeedbackService {
  static async createFeedback(userId: string, data: any) {
    return prisma.feedback.create({
      data: {
        userId,
        q1Rating: data.q1Rating,
        q1Text: data.q1Text,
        q2Rating: data.q2Rating,
        q2Text: data.q2Text,
        q3Rating: data.q3Rating,
        q3Text: data.q3Text,
        q4Rating: data.q4Rating,
        q4Text: data.q4Text,
        q5Rating: data.q5Rating,
        q5Text: data.q5Text,
        finalSuggestions: data.finalSuggestions,
      },
    });
  }

  static async getFeedbacks() {
    return prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
  }
}
