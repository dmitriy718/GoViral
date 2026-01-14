import { Router } from 'express';
import { createProject, getProjects } from '../controllers/project.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createProjectSchema } from '../schemas/project.schema';

const router = Router();

router.use(authenticate);

router.post('/', validate(createProjectSchema), createProject);
router.get('/', getProjects);

export default router;
