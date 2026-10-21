import { Router } from 'express';
import { NewsController } from '../controllers/news.controller';

const router = Router();

// Tech News is 100% public (No auth required anywhere)
router.get('/', NewsController.getFeed);
router.get('/:id', NewsController.getArticleById);

export default router;
