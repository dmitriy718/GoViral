import express from 'express';
import { authenticate } from '../middleware/auth';
import { getProfile, updateProfile, verifyEmail, resendVerificationEmail } from '../controllers/user.controller';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../schemas/user.schema';

const router = express.Router();

router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, validate(updateProfileSchema), updateProfile);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', authenticate, resendVerificationEmail);

export default router;