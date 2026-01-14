import { Router } from 'express';
import { reportError } from '../controllers/error.controller';
import { validate } from '../middleware/validate';
import { reportErrorSchema } from '../schemas/error.schema';
import { rateLimit } from '../middleware/rateLimit';

const router = Router();

// Public route - anyone should be able to report a crash (even if auth fails)
router.post(
  '/report',
  rateLimit({ windowMs: 60 * 1000, max: 20 }),
  validate(reportErrorSchema),
  reportError
);

export default router;
