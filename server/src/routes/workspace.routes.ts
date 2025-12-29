import { Router } from 'express';
import { createWorkspace, getWorkspaces } from '../controllers/workspace.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createWorkspace);
router.get('/', getWorkspaces);

export default router;
