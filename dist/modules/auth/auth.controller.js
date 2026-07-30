"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const response_util_1 = require("../../utils/response.util");
const constants_1 = require("../../config/constants");
class AuthController {
    static async signup(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await auth_service_1.AuthService.signup(email, password);
            (0, response_util_1.sendResponse)(res, 201, user);
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.AuthService.login(email, password);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: constants_1.CONSTANTS.JWT.REFRESH_COOKIE_MAX_AGE,
            });
            (0, response_util_1.sendResponse)(res, 200, {
                user: result.user,
                accessToken: result.accessToken,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async refresh(req, res, next) {
        try {
            const token = req.cookies.refreshToken || req.body.refreshToken;
            if (!token) {
                return (0, response_util_1.sendResponse)(res, 401, null, 'Refresh token required');
            }
            const result = await auth_service_1.AuthService.refreshAccessToken(token);
            (0, response_util_1.sendResponse)(res, 200, result);
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            const token = req.cookies.refreshToken;
            if (token) {
                await auth_service_1.AuthService.logout(token);
                res.clearCookie('refreshToken');
            }
            (0, response_util_1.sendResponse)(res, 200, { message: 'Logged out successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
