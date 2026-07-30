"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymptomsController = void 0;
const symptoms_service_1 = require("./symptoms.service");
const response_util_1 = require("../../utils/response.util");
class SymptomsController {
    static async create(req, res, next) {
        try {
            const log = await symptoms_service_1.SymptomsService.logSymptom(req.user.userId, req.body);
            (0, response_util_1.sendResponse)(res, 201, log);
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const offset = parseInt(req.query.offset) || 0;
            const logs = await symptoms_service_1.SymptomsService.getSymptoms(req.user.userId, limit, offset);
            (0, response_util_1.sendResponse)(res, 200, logs);
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const log = await symptoms_service_1.SymptomsService.updateSymptom(req.user.userId, req.params.id, req.body);
            (0, response_util_1.sendResponse)(res, 200, log);
        }
        catch (error) {
            next(error);
        }
    }
    static async remove(req, res, next) {
        try {
            await symptoms_service_1.SymptomsService.deleteSymptom(req.user.userId, req.params.id);
            (0, response_util_1.sendResponse)(res, 200, { message: 'Symptom log deleted' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SymptomsController = SymptomsController;
