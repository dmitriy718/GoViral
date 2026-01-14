import { Router } from 'express';
import { createWorkspace, getWorkspaces } from '../controllers/workspace.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createWorkspaceSchema } from '../schemas/workspace.schema';

const router = Router();

router.use(authenticate);

router.post('/', validate(createWorkspaceSchema), createWorkspace);
router.get('/', getWorkspaces);

export default router;
