"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CyclesController = void 0;
const cycles_service_1 = require("./cycles.service");
const response_util_1 = require("../../utils/response.util");
class CyclesController {
    static async getPredictions(req, res, next) {
        try {
            const { date } = req.query;
            const predictions = await cycles_service_1.CyclesService.getCyclePredictions(req.user.userId, date);
            (0, response_util_1.sendResponse)(res, 200, predictions);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CyclesController = CyclesController;
