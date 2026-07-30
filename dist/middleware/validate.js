"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const response_util_1 = require("../utils/response.util");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const zodError = error;
                const message = zodError.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
                return (0, response_util_1.sendResponse)(res, 400, null, message);
            }
            next(error);
        }
    };
};
exports.validate = validate;
