import { Router } from 'express';
import { addCompetitor, getCompetitors } from '../controllers/competitor.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { addCompetitorSchema } from '../schemas/competitor.schema';

const router = Router();

router.use(authenticate);

router.post('/', validate(addCompetitorSchema), addCompetitor);
router.get('/', getCompetitors);

export default router;
