import { Router } from 'express';
import { FeedbackController } from './feedback.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.post('/', FeedbackController.submitFeedback);
router.get('/', FeedbackController.getFeedbacks);

export default router;
