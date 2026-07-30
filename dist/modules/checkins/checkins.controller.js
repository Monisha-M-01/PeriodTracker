"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInsController = void 0;
const prisma_1 = require("../../config/prisma");
const response_util_1 = require("../../utils/response.util");
class CheckInsController {
    static async upsert(req, res, next) {
        try {
            const { userId } = req.user;
            const { date, mood, stress, diet, note, answers, moodString, symptoms, workouts, dietDetails } = req.body;
            // We store just the date part for uniqueness (ignore time)
            const dateOnly = new Date(date);
            dateOnly.setUTCHours(0, 0, 0, 0);
            const checkIn = await prisma_1.prisma.dailyCheckIn.upsert({
                where: {
                    userId_date: {
                        userId,
                        date: dateOnly
                    }
                },
                update: {
                    mood, stress, diet, note, answers,
                    moodString, symptoms, workouts, dietDetails
                },
                create: {
                    userId,
                    date: dateOnly,
                    mood, stress, diet, note, answers,
                    moodString, symptoms, workouts, dietDetails
                }
            });
            return (0, response_util_1.sendResponse)(res, 200, checkIn);
        }
        catch (error) {
            next(error);
        }
    }
    static async getToday(req, res, next) {
        try {
            const { userId } = req.user;
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            const checkIn = await prisma_1.prisma.dailyCheckIn.findUnique({
                where: {
                    userId_date: {
                        userId,
                        date: today
                    }
                }
            });
            return (0, response_util_1.sendResponse)(res, 200, checkIn);
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const { userId } = req.user;
            const { from, to } = req.query;
            let dateFilter = {};
            if (from)
                dateFilter.gte = new Date(from);
            if (to)
                dateFilter.lte = new Date(to);
            const checkIns = await prisma_1.prisma.dailyCheckIn.findMany({
                where: {
                    userId,
                    ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
                },
                orderBy: {
                    date: 'desc'
                }
            });
            return (0, response_util_1.sendResponse)(res, 200, checkIns);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CheckInsController = CheckInsController;
