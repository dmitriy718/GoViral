import { Router } from 'express';
import { generatePost, createPost, getPosts } from '../controllers/post.controller';
import { authenticate } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { validate } from '../middleware/validate';
import { createPostSchema, generatePostSchema } from '../schemas/post.schema';

const router = Router();

router.post(
    '/generate',
    authenticate,
    rateLimit({
        windowMs: 60 * 1000,
        max: 10,
        keyGenerator: (req) => {
            const authReq = req as any;
            return authReq.user?.uid || req.ip;
        }
    }),
    validate(generatePostSchema),
    generatePost as any
);

router.use(authenticate); // Protect all post routes

router.post('/', validate(createPostSchema), createPost as any);
router.get('/', getPosts as any);

export default router;
