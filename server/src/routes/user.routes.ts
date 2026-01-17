import express from 'express';
import { authenticate } from '../middleware/auth';
import { getProfile, updateProfile, verifyEmail, resendVerificationEmail } from '../controllers/user.controller';
import { validate } from '../middleware/validate';
import { updateProfileSchema, verifyEmailSchema } from '../schemas/user.schema';
import { rateLimit } from '../middleware/rateLimit';

const router = express.Router();

const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
});

router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, validate(updateProfileSchema), updateProfile);
router.post('/verify-email', authRateLimit, validate(verifyEmailSchema), verifyEmail);
router.post('/resend-verification', authenticate, authRateLimit, resendVerificationEmail);

export default router;