import { Router } from 'express';
import { generatePost, createPost, getPosts } from '../controllers/post.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate); // Protect all post routes

router.post('/generate', generatePost as any);
router.post('/', createPost as any);
router.get('/', getPosts as any);

export default router;
