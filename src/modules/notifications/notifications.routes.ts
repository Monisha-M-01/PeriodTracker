import { Router } from 'express';
import { subscribe, unsubscribe, runCron } from './notifications.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.post('/subscribe', requireAuth, subscribe);
router.post('/unsubscribe', requireAuth, unsubscribe);
router.post('/cron', runCron);

export default router;
