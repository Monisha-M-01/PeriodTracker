"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, statusCode, data = null, error = null) => {
    return res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300,
        data,
        error,
    });
};
exports.sendResponse = sendResponse;
