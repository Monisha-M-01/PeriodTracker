import { Router } from 'express';
import { CheckInsController } from './checkins.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate';
import { upsertCheckInSchema, getCheckInSchema } from './checkins.schema';

const router = Router();

router.use(requireAuth);

router.post('/', validate(upsertCheckInSchema), CheckInsController.upsert);
router.get('/today', CheckInsController.getToday);
router.get('/', validate(getCheckInSchema), CheckInsController.list);

export default router;
