import { Router } from 'express';
import { getAllArticles, getArticleById } from '../controllers/article.controller';

const router = Router();

router.get('/', getAllArticles);
router.get('/:id', getArticleById);

export default router;
