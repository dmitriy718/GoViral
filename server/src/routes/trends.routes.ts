
import { Router } from 'express';
import { getTrends } from '../controllers/trends.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getTrends);

export default router;
