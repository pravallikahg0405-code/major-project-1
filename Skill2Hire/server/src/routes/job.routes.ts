import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Job search & recommendations (Requires Registration/Login as per progressive auth rules)
router.post('/search', requireAuth, JobController.searchJobs);
router.get('/recommendations', requireAuth, JobController.getRecommendations);

// Bookmark management
router.post('/save', requireAuth, JobController.saveJob);
router.get('/saved', requireAuth, JobController.listSavedJobs);
router.delete('/saved/:id', requireAuth, JobController.deleteSavedJob);

export default router;
