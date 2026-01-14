import express from 'express';
import { authenticate } from '../middleware/auth';
import { getProfile, updateProfile } from '../controllers/user.controller';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../schemas/user.schema';

const router = express.Router();

router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, validate(updateProfileSchema), updateProfile);

export default router;
