import { prisma } from '../../config/prisma';

export class UsersService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        isVerified: true,
        createdAt: true,
        settings: true,
      },
    });

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }
    return user;
  }

  static async updateProfile(userId: string, data: { name?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        createdAt: true,
      },
    });
    return user;
  }

  static async updateSettings(userId: string, data: any) {
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
    return settings;
  }
}
