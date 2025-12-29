import { Router } from 'express';
import { reportError } from '../controllers/error.controller';

const router = Router();

// Public route - anyone should be able to report a crash (even if auth fails)
router.post('/report', reportError);

export default router;
