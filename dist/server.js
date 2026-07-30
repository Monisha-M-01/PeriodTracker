"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_util_1 = require("./utils/logger.util");
const PORT = env_1.env.PORT || 3000;
app_1.default.listen(PORT, () => {
    logger_util_1.logger.info(`Server listening on port ${PORT} in ${env_1.env.NODE_ENV} mode`);
});
