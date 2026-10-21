import { Response } from 'express';
import { InterviewReport } from '../models/InterviewReport';
import { AuthenticatedRequest } from '../types';
import { InterviewService } from '../services/interviewService';
import { isDbConnected } from '../config/db';
import { fallbackStore } from '../services/fallbackStore';

export class InterviewController {
  /**
   * Round 1: Check Eligibility (Guest or Auth)
   */
  public static checkEligibility(req: AuthenticatedRequest, res: Response): void {
    try {
      const { targetRole, candidateSkills } = req.body;
      const result = InterviewService.checkEligibility(
        targetRole || 'Full Stack Developer',
        Array.isArray(candidateSkills) ? candidateSkills : []
      );
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Round 2: Get Aptitude MCQs (GET or POST)
   */
  public static getAptitudeQuestions(_req: AuthenticatedRequest, res: Response): void {
    try {
      const questions = InterviewService.getAptitudeQuestions();
      res.status(200).json({
        success: true,
        data: {
          questions
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Round 2: Submit & Grade Aptitude Answers
   */
  public static submitAptitude(req: AuthenticatedRequest, res: Response): void {
    try {
      const payload = req.body.answers !== undefined ? req.body.answers : req.body.userAnswers;
      const result = InterviewService.evaluateAptitude(payload || []);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Universal Interactive Turn: Next Question for Technical and HR rounds
   */
  public static async nextQuestion(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { targetRole, roundType, questionIndex, candidateAnswer, conversationHistory } = req.body;
      const result = await InterviewService.processNextQuestion({
        targetRole: targetRole || 'Full Stack Developer',
        roundType: roundType === 'hr' ? 'hr' : 'technical',
        questionIndex: Number(questionIndex) || 1,
        candidateAnswer: candidateAnswer || '',
        conversationHistory: conversationHistory || []
      });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Round 3: Technical Turn (Direct alias)
   */
  public static async technicalTurn(req: AuthenticatedRequest, res: Response): Promise<void> {
    req.body.roundType = 'technical';
    return InterviewController.nextQuestion(req, res);
  }

  /**
   * Round 4: HR Turn (Direct alias)
   */
  public static async hrTurn(req: AuthenticatedRequest, res: Response): Promise<void> {
    req.body.roundType = 'hr';
    return InterviewController.nextQuestion(req, res);
  }

  /**
   * Final Scorecard Generation
   */
  public static generateReport(req: AuthenticatedRequest, res: Response): void {
    try {
      const { targetRole, difficulty, aptitudeScore, technicalTurns, hrTurns } = req.body;
      const report = InterviewService.generateComprehensiveReport({
        targetRole,
        difficulty,
        aptitudeScore,
        technicalTurns,
        hrTurns
      });
      res.status(200).json({ success: true, data: report });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Save Comprehensive Interview Report in MongoDB Atlas or Local Store
   */
  public static async saveReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'guest_user';
      const {
        targetRole,
        difficulty,
        eligibilityResult,
        aptitudeScore,
        technicalScore,
        hrScore,
        overallScore,
        communicationAssessment,
        strengths,
        weaknesses,
        skillGaps,
        improvementSuggestions,
        recommendedLearningResources,
        overallResult
      } = req.body;

      const reportPayload = {
        userId,
        targetRole: targetRole || 'Software Engineer',
        difficulty: difficulty || 'Fresher',
        eligibilityResult: eligibilityResult || { passed: true, missingSkills: [], weakAreas: [] },
        aptitudeScore: aptitudeScore || { overall: 80, quantitative: 80, logical: 80, verbal: 80, passed: true },
        technicalScore: technicalScore || 84,
        hrScore: hrScore || 88,
        overallScore: overallScore || 84,
        communicationAssessment: communicationAssessment || { clarityScore: 85, relevanceScore: 85, structureScore: 80, feedback: 'Strong communication and structured delivery.' },
        strengths: strengths || ['Core technical depth', 'Structured communication', 'Analytical reasoning'],
        weaknesses: weaknesses || ['Discussing edge-case trade-offs', 'Detailed time complexity explanations'],
        skillGaps: skillGaps || [],
        improvementSuggestions: improvementSuggestions || ['Practice articulating architectural trade-offs using the STAR framework.'],
        recommendedLearningResources: recommendedLearningResources || [],
        overallResult: overallResult || 'Passed'
      };

      // Always save to fallback store for guaranteed reliability
      const localReport = fallbackStore.saveReport(reportPayload);

      // Also persist to MongoDB Atlas if connected
      let atlasReport: any = null;
      if (isDbConnected && userId !== 'guest_user') {
        try {
          atlasReport = await InterviewReport.create(reportPayload);
        } catch (dbErr) {
          console.warn('[InterviewController.saveReport] Atlas save failed, saved locally:', dbErr);
        }
      }

      res.status(201).json({
        success: true,
        message: 'Mock interview report saved to your Skill2Hire profile.',
        data: atlasReport || localReport
      });
    } catch (error: any) {
      console.error('[InterviewController.saveReport Error]:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to save report.' });
    }
  }

  /**
   * List Past Reports for Logged-In User
   */
  public static async listReports(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(200).json({ success: true, data: [] });
        return;
      }

      let reports: any[] = [];
      if (isDbConnected) {
        try {
          reports = await InterviewReport.find({ userId }).sort({ createdAt: -1 });
        } catch (dbErr) {
          reports = fallbackStore.listReports(userId);
        }
      } else {
        reports = fallbackStore.listReports(userId);
      }

      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get Single Report by ID
   */
  public static async getReportById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      let report: any = null;
      if (isDbConnected) {
        try {
          report = await InterviewReport.findById(req.params.id);
        } catch (dbErr) {
          report = fallbackStore.getReportById(req.params.id);
        }
      } else {
        report = fallbackStore.getReportById(req.params.id);
      }

      if (!report) {
        res.status(404).json({ success: false, error: 'Interview report not found.' });
        return;
      }

      res.status(200).json({ success: true, data: report });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
