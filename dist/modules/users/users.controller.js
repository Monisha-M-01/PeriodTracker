"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const users_service_1 = require("./users.service");
const response_util_1 = require("../../utils/response.util");
class UsersController {
    static async getProfile(req, res, next) {
        try {
            const userId = req.user.userId;
            const profile = await users_service_1.UsersService.getProfile(userId);
            (0, response_util_1.sendResponse)(res, 200, profile);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateSettings(req, res, next) {
        try {
            const userId = req.user.userId;
            const settings = await users_service_1.UsersService.updateSettings(userId, req.body);
            (0, response_util_1.sendResponse)(res, 200, settings);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UsersController = UsersController;
