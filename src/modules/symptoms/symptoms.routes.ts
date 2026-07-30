import { Router } from 'express';
import { SymptomsController } from './symptoms.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate';
import { logSymptomSchema, updateSymptomSchema } from './symptoms.schema';

const router = Router();

router.use(requireAuth);

router.post('/', validate(logSymptomSchema), SymptomsController.create);
router.get('/', SymptomsController.list);
router.patch('/:id', validate(updateSymptomSchema), SymptomsController.update);
router.delete('/:id', SymptomsController.remove);

export default router;
