"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const env_1 = require("../config/env");
const logger_util_1 = require("../utils/logger.util");
const response_util_1 = require("../utils/response.util");
const errorHandler = (err, req, res, next) => {
    logger_util_1.logger.error(err.message, { stack: err.stack, path: req.path });
    const statusCode = err.statusCode || 500;
    const message = env_1.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Internal Server Error'
        : err.message || 'Internal Server Error';
    (0, response_util_1.sendResponse)(res, statusCode, null, message);
};
exports.errorHandler = errorHandler;
