
import { Router } from 'express';
import { getDashboardStats, getDetailedReport } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { getDetailedReportSchema } from '../schemas/analytics.schema';

const router = Router();

router.use(authenticate);
router.get('/dashboard', getDashboardStats as any);
router.get('/report', validate(getDetailedReportSchema), getDetailedReport as any);

export default router;
