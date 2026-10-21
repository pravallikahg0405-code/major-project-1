import { Router } from 'express';
import { TailorController } from '../controllers/tailor.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { uploadResume } from '../middleware/upload.middleware';
import { aiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Upload & Tailoring Engine (Public / Guest accessible)
router.post('/upload-parse', uploadResume.single('resumeFile'), TailorController.uploadAndParse);
router.post('/generate', aiLimiter, TailorController.generateTailoredResume);
router.post('/analyze', aiLimiter, TailorController.generateTailoredResume);

// Persistence (Requires Registration/Login)
router.post('/', requireAuth, TailorController.saveTailored);
router.get('/', requireAuth, TailorController.listTailored);
router.get('/:id', requireAuth, TailorController.getTailoredById);

// Explicit Document Exports (Requires Registration/Login)
router.post('/export-pdf', requireAuth, TailorController.exportPDF);
router.post('/export-docx', requireAuth, TailorController.exportDOCX);

export default router;
