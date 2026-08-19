import { prisma } from '../../config/prisma';
import { hashPassword, verifyPassword } from '../../utils/password.util';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.util';
import { CONSTANTS } from '../../config/constants';
import crypto from 'crypto';

export class AuthService {
  static async signup(email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw { statusCode: 409, message: 'Email already in use' };
    }

    const passwordHash = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        verificationToken,
        settings: {
          create: {} // create default settings
        }
      }
    });

    // TODO: Send verification email using stub
    console.log(`[STUB EMAIL] To: ${email} | Verify Token: ${verificationToken}`);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
    };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email, deletedAt: null } });
    if (!user) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const payload = { userId: user.id };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + CONSTANTS.JWT.REFRESH_COOKIE_MAX_AGE),
      }
    });

    return {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken
    };
  }

  static async refreshAccessToken(token: string) {
    const dbToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!dbToken || dbToken.expiresAt < new Date()) {
      if (dbToken) {
        await prisma.refreshToken.delete({ where: { id: dbToken.id } });
      }
      throw { statusCode: 401, message: 'Invalid or expired refresh token' };
    }

    const payload = { userId: dbToken.userId };
    const accessToken = generateAccessToken(payload);

    return { accessToken, refreshToken: dbToken.token };
  }

  static async logout(token: string) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email, deletedAt: null } });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      }
    });

    const { emailService } = await import('../../services/email.service');
    await emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { gt: new Date() },
        deletedAt: null,
      }
    });

    if (!user) {
      throw { statusCode: 400, message: 'Invalid or expired password reset token' };
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      }
    });
  }
}
