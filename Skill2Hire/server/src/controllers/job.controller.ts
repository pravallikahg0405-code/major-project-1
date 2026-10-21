import { Response } from 'express';
import { JobPreference } from '../models/JobPreference';
import { SavedJob } from '../models/SavedJob';
import { AuthenticatedRequest } from '../types';
import { JobAggregatorService } from '../services/jobAggregator.service';
import { isDbConnected } from '../config/db';
import { fallbackStore } from '../services/fallbackStore';

export class JobController {
  /**
   * Search Live Jobs & Rank with Skill2Hire Compatibility (Auth required)
   */
  public static async searchJobs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, error: 'Please log in to search for jobs.' });
        return;
      }

      const { role, location, workMode, experienceLevel, skills } = req.body;

      // Safely save preference if Atlas is connected
      if (isDbConnected) {
        try {
          await JobPreference.findOneAndUpdate(
            { userId: req.user.id },
            {
              userId: req.user.id,
              targetRole: role || 'Software Developer',
              preferredLocation: location || '',
              workMode: workMode || 'Any',
              experienceLevel: experienceLevel || 'Fresher',
              skills: Array.isArray(skills) ? skills : []
            },
            { upsert: true, new: true }
          );
        } catch (dbErr) {
          // Non-critical, continue
        }
      }

      const results = await JobAggregatorService.searchJobs({
        role,
        location,
        workMode,
        experienceLevel,
        skills
      });

      res.status(200).json({
        success: true,
        message: 'Jobs fetched successfully.',
        data: results
      });
    } catch (error: any) {
      console.error('[JobController.searchJobs Error]:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch job suggestions.' });
    }
  }

  /**
   * Get Recommendations based on user profile (Auth required)
   */
  public static async getRecommendations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      let pref: any = null;
      if (isDbConnected) {
        try {
          pref = await JobPreference.findOne({ userId: req.user.id });
        } catch (e) {
          pref = null;
        }
      }

      const results = await JobAggregatorService.searchJobs({
        role: pref?.targetRole || 'Software Engineer',
        location: pref?.preferredLocation || '',
        workMode: pref?.workMode || 'Any',
        experienceLevel: pref?.experienceLevel || 'Fresher',
        skills: pref?.skills || []
      });

      res.status(200).json({ success: true, data: results });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Bookmark a Job (Dual Atlas + local store failover)
   */
  public static async saveJob(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      const {
        jobId,
        title,
        company,
        location,
        workMode,
        salary,
        description,
        source,
        applicationUrl,
        skills,
        matchPercentage,
        matchingSkills,
        missingSkills,
        matchReason
      } = req.body;

      const jobPayload = {
        userId: req.user.id,
        jobId,
        title,
        company,
        location,
        workMode,
        salary,
        description,
        source,
        applicationUrl,
        skills,
        matchPercentage,
        matchingSkills,
        missingSkills,
        matchReason
      };

      const localSaved = fallbackStore.saveJob(jobPayload);

      let atlasSaved: any = null;
      if (isDbConnected) {
        try {
          atlasSaved = await SavedJob.findOneAndUpdate(
            { userId: req.user.id, jobId },
            jobPayload,
            { upsert: true, new: true }
          );
        } catch (dbErr) {
          console.warn('[JobController.saveJob] Atlas save failed, saved locally:', dbErr);
        }
      }

      res.status(201).json({
        success: true,
        message: 'Job bookmarked to your dashboard.',
        data: atlasSaved || localSaved
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * List Saved Jobs for Logged-In User
   */
  public static async listSavedJobs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      let savedJobs: any[] = [];
      if (isDbConnected) {
        try {
          savedJobs = await SavedJob.find({ userId: req.user.id }).sort({ savedAt: -1 });
        } catch (dbErr) {
          savedJobs = fallbackStore.listSavedJobs(req.user.id);
        }
      } else {
        savedJobs = fallbackStore.listSavedJobs(req.user.id);
      }

      res.status(200).json({ success: true, data: savedJobs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Remove Saved Job
   */
  public static async deleteSavedJob(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      if (isDbConnected) {
        try {
          await SavedJob.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        } catch (dbErr) {
          // Ignored
        }
      }

      fallbackStore.deleteSavedJob(req.params.id, req.user.id);

      res.status(200).json({ success: true, message: 'Saved job removed from dashboard.' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
