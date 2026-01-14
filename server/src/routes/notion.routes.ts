import { Router } from 'express';
import { connectNotion, syncNotion } from '../controllers/notion.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { connectNotionSchema } from '../schemas/notion.schema';

const router = Router();

router.use(authenticate);
router.post('/connect', validate(connectNotionSchema), connectNotion);
router.post('/sync', syncNotion);

export default router;
