"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../../config/prisma");
const password_util_1 = require("../../utils/password.util");
const jwt_util_1 = require("../../utils/jwt.util");
const constants_1 = require("../../config/constants");
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    static async signup(email, password) {
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw { statusCode: 409, message: 'Email already in use' };
        }
        const passwordHash = await (0, password_util_1.hashPassword)(password);
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        const user = await prisma_1.prisma.user.create({
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
            isVerified: user.isVerified,
        };
    }
    static async login(email, password) {
        const user = await prisma_1.prisma.user.findUnique({ where: { email, deletedAt: null } });
        if (!user) {
            throw { statusCode: 401, message: 'Invalid credentials' };
        }
        const isValid = await (0, password_util_1.verifyPassword)(password, user.passwordHash);
        if (!isValid) {
            throw { statusCode: 401, message: 'Invalid credentials' };
        }
        const payload = { userId: user.id };
        const accessToken = (0, jwt_util_1.generateAccessToken)(payload);
        const refreshToken = (0, jwt_util_1.generateRefreshToken)(payload);
        await prisma_1.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + constants_1.CONSTANTS.JWT.REFRESH_COOKIE_MAX_AGE),
            }
        });
        return {
            user: { id: user.id, email: user.email },
            accessToken,
            refreshToken
        };
    }
    static async refreshAccessToken(token) {
        const dbToken = await prisma_1.prisma.refreshToken.findUnique({ where: { token } });
        if (!dbToken || dbToken.expiresAt < new Date()) {
            if (dbToken) {
                await prisma_1.prisma.refreshToken.delete({ where: { id: dbToken.id } });
            }
            throw { statusCode: 401, message: 'Invalid or expired refresh token' };
        }
        const payload = { userId: dbToken.userId };
        const accessToken = (0, jwt_util_1.generateAccessToken)(payload);
        return { accessToken };
    }
    static async logout(token) {
        await prisma_1.prisma.refreshToken.deleteMany({ where: { token } });
    }
}
exports.AuthService = AuthService;
