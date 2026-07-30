import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';
import { prisma } from '../../config/prisma';
import * as passwordUtil from '../../utils/password.util';
import * as jwtUtil from '../../utils/jwt.util';

vi.mock('../../config/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

vi.mock('../../utils/password.util', () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
}));

vi.mock('../../utils/jwt.util', () => ({
  generateAccessToken: vi.fn(),
  generateRefreshToken: vi.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signup', () => {
    it('should throw an error if email is already in use', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: '1' } as any);

      await expect(AuthService.signup('test@example.com', 'password')).rejects.toEqual({
        statusCode: 409,
        message: 'Email already in use',
      });
    });

    it('should create a new user and return user details', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
      vi.mocked(passwordUtil.hashPassword).mockResolvedValueOnce('hashedPassword');
      vi.mocked(prisma.user.create).mockResolvedValueOnce({
        id: '123',
        email: 'test@example.com',
        isVerified: false,
      } as any);

      const result = await AuthService.signup('test@example.com', 'password');

      expect(prisma.user.create).toHaveBeenCalled();
      expect(result).toEqual({
        id: '123',
        email: 'test@example.com',
        isVerified: false,
      });
    });
  });

  describe('login', () => {
    it('should throw error if user not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
      await expect(AuthService.login('test@example.com', 'password')).rejects.toEqual({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    });

    it('should login and return tokens', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: '123',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
      } as any);
      vi.mocked(passwordUtil.verifyPassword).mockResolvedValueOnce(true);
      vi.mocked(jwtUtil.generateAccessToken).mockReturnValueOnce('access_token');
      vi.mocked(jwtUtil.generateRefreshToken).mockReturnValueOnce('refresh_token');

      const result = await AuthService.login('test@example.com', 'password');

      expect(result).toEqual({
        user: { id: '123', email: 'test@example.com' },
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
      expect(prisma.refreshToken.create).toHaveBeenCalled();
    });
  });
});
