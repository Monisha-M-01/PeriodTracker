"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const period_routes_1 = __importDefault(require("./modules/period/period.routes"));
const symptoms_routes_1 = __importDefault(require("./modules/symptoms/symptoms.routes"));
const cycles_routes_1 = __importDefault(require("./modules/cycles/cycles.routes"));
const checkins_routes_1 = __importDefault(require("./modules/checkins/checkins.routes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes will be registered here
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, data: { status: 'UP' }, error: null });
});
// Register API Routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/users', users_routes_1.default);
app.use('/api/v1/period', period_routes_1.default);
app.use('/api/v1/symptoms', symptoms_routes_1.default);
app.use('/api/v1/cycles', cycles_routes_1.default);
app.use('/api/v1/checkins', checkins_routes_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
