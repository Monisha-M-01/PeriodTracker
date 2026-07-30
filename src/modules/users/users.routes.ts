import { Router } from 'express';
import { UsersController } from './users.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate';
import { updateSettingsSchema } from './users.schema';

const router = Router();

router.use(requireAuth);

router.get('/me', UsersController.getProfile);
router.patch('/me/settings', validate(updateSettingsSchema), UsersController.updateSettings);

export default router;
