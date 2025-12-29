import { Router } from 'express';
import { addCompetitor, getCompetitors } from '../controllers/competitor.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', addCompetitor);
router.get('/', getCompetitors);

export default router;
