
import { Router } from 'express';
import { connectProvider, getConnectedProviders, initiateFacebookAuth, handleFacebookCallback } from '../controllers/social.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { connectProviderSchema } from '../schemas/social.schema';

const router = Router();

router.use(authenticate);
router.post('/connect', authenticate, validate(connectProviderSchema), connectProvider);
router.get('/', authenticate, getConnectedProviders);

// Facebook OAuth
router.get('/facebook/auth', authenticate, initiateFacebookAuth);
router.get('/facebook/callback', handleFacebookCallback); // No auth middleware, public callback

export default router;
