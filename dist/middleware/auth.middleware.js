"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const prisma_1 = require("../config/prisma");
const requireAuth = async (req, res, next) => {
    try {
        let user = await prisma_1.prisma.user.findFirst();
        if (!user) {
            user = await prisma_1.prisma.user.create({
                data: {
                    email: 'demo@example.com',
                    passwordHash: 'dummy',
                    isVerified: true
                }
            });
        }
        req.user = { userId: user.id };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.requireAuth = requireAuth;
