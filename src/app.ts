import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import periodRoutes from './modules/period/period.routes';
import symptomRoutes from './modules/symptoms/symptoms.routes';
import cyclesRoutes from './modules/cycles/cycles.routes';
import checkinRoutes from './modules/checkins/checkins.routes';

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes will be registered here
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'UP' }, error: null });
});

// Register API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/period', periodRoutes);
app.use('/api/v1/symptoms', symptomRoutes);
app.use('/api/v1/cycles', cyclesRoutes);
app.use('/api/v1/checkins', checkinRoutes);

app.use(errorHandler);

export default app;
