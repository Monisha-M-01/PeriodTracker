"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodController = void 0;
const period_service_1 = require("./period.service");
const response_util_1 = require("../../utils/response.util");
class PeriodController {
    static async create(req, res, next) {
        try {
            const log = await period_service_1.PeriodService.createLog(req.user.userId, req.body);
            (0, response_util_1.sendResponse)(res, 201, log);
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const offset = parseInt(req.query.offset) || 0;
            const logs = await period_service_1.PeriodService.getLogs(req.user.userId, limit, offset);
            (0, response_util_1.sendResponse)(res, 200, logs);
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const log = await period_service_1.PeriodService.updateLog(req.user.userId, req.params.id, req.body);
            (0, response_util_1.sendResponse)(res, 200, log);
        }
        catch (error) {
            next(error);
        }
    }
    static async remove(req, res, next) {
        try {
            await period_service_1.PeriodService.deleteLog(req.user.userId, req.params.id);
            (0, response_util_1.sendResponse)(res, 200, { message: 'Period log deleted' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PeriodController = PeriodController;
