import { Router } from 'express';
import { CyclesController } from './cycles.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate';
import { getPredictionsSchema } from './cycles.schema';

const router = Router();

router.use(requireAuth);

router.get('/predictions', validate(getPredictionsSchema), CyclesController.getPredictions);

export default router;
