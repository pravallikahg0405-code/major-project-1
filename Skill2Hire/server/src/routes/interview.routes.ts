import { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// Round 1: Eligibility Assessment (Supports both client route aliases)
router.post('/eligibility-check', optionalAuth, InterviewController.checkEligibility);
router.post('/check-eligibility', optionalAuth, InterviewController.checkEligibility);

// Round 2: Aptitude Questions & Evaluation (Supports both GET and POST)
router.get('/aptitude-questions', optionalAuth, InterviewController.getAptitudeQuestions);
router.post('/aptitude-questions', optionalAuth, InterviewController.getAptitudeQuestions);
router.post('/aptitude-evaluate', optionalAuth, InterviewController.submitAptitude);
router.post('/aptitude-submit', optionalAuth, InterviewController.submitAptitude);

// Round 3 & 4: Interactive Turns
router.post('/next-question', optionalAuth, InterviewController.nextQuestion);
router.post('/technical-turn', optionalAuth, InterviewController.technicalTurn);
router.post('/hr-turn', optionalAuth, InterviewController.hrTurn);

// Final Scorecard Generation
router.post('/generate-report', optionalAuth, InterviewController.generateReport);

// Scorecard Reports Persistence
router.post('/reports', optionalAuth, InterviewController.saveReport);
router.get('/reports', optionalAuth, InterviewController.listReports);
router.get('/reports/:id', optionalAuth, InterviewController.getReportById);

export default router;
