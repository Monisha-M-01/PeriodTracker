import { Router } from 'express';
import { PeriodController } from './period.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate';
import { createPeriodLogSchema, updatePeriodLogSchema } from './period.schema';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createPeriodLogSchema), PeriodController.create);
router.get('/', PeriodController.list);
router.patch('/:id', validate(updatePeriodLogSchema), PeriodController.update);
router.delete('/:id', PeriodController.remove);

export default router;
