import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { signupSchema, loginSchema } from './auth.schema';
import { authLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/signup', authLimiter, validate(signupSchema), AuthController.signup);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

export default router;
