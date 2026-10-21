import { Router } from 'express';
import { ResumeController } from '../controllers/resume.controller';
import { TailorController } from '../controllers/tailor.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { uploadResume } from '../middleware/upload.middleware';
import { aiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Resume Upload & Parse (Public / Guest accessible)
router.post('/upload-parse', uploadResume.single('resumeFile'), TailorController.uploadAndParse);

// AI & ATS Utilities (Public / Guest accessible)
router.post('/ai-specializations', aiLimiter, ResumeController.suggestSpecializations);
router.post('/ai-improve-bullet', aiLimiter, ResumeController.improveBullet);
router.post('/ai-summary', aiLimiter, ResumeController.generateSummary);
router.post('/ai-skills', aiLimiter, ResumeController.suggestSkills);
router.post('/ats-analysis', ResumeController.calculateATS);

// Cloud Persistence (Requires Registration/Login)
router.post('/', requireAuth, ResumeController.saveResume);
router.get('/', requireAuth, ResumeController.listResumes);
router.get('/:id', requireAuth, ResumeController.getResumeById);
router.put('/:id', requireAuth, ResumeController.updateResume);
router.delete('/:id', requireAuth, ResumeController.deleteResume);

// Explicit Document Exports (Requires Registration/Login)
router.post('/export-pdf', requireAuth, ResumeController.exportPDF);
router.post('/export-docx', requireAuth, ResumeController.exportDOCX);

export default router;
