import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../types';
import { isDbConnected } from '../config/db';
import { fallbackStore } from '../services/fallbackStore';

export class AuthController {
  /**
   * User Registration (Zero-failure design: Atlas + local failover)
   */
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const { fullName, email, password, targetRole, skills } = req.body;

      if (!fullName || !email || !password) {
        res.status(400).json({ success: false, error: 'Full name, email, and password are required.' });
        return;
      }

      const cleanEmail = email.toLowerCase().trim();

      // Check if user already exists
      let existingUser = null;
      if (isDbConnected) {
        try {
          existingUser = await User.findOne({ email: cleanEmail });
        } catch (dbErr) {
          console.warn('[AuthController.register] Atlas lookup failed, using local store:', dbErr);
          existingUser = fallbackStore.findUserByEmail(cleanEmail);
        }
      } else {
        existingUser = fallbackStore.findUserByEmail(cleanEmail);
      }

      if (existingUser) {
        res.status(400).json({ success: false, error: 'An account with this email already exists. Please log in.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const userSkills = Array.isArray(skills) ? skills : [];
      const userRole = targetRole || 'Software Engineer';

      let createdUser: any = null;

      // Always persist in local fallbackStore for instant failover reliability
      const localUser = fallbackStore.createUser({
        fullName: fullName.trim(),
        email: cleanEmail,
        passwordHash,
        targetRole: userRole,
        skills: userSkills
      });

      // Also persist to MongoDB Atlas if connected
      if (isDbConnected) {
        try {
          createdUser = await User.create({
            fullName: fullName.trim(),
            email: cleanEmail,
            passwordHash,
            targetRole: userRole,
            skills: userSkills
          });
        } catch (atlasErr) {
          console.warn('[AuthController.register] Atlas save failed, saved locally:', atlasErr);
          createdUser = null;
        }
      }

      const userId = (createdUser?._id || localUser.id).toString();

      const token = generateToken({
        id: userId,
        email: cleanEmail,
        fullName: fullName.trim()
      });

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        data: {
          token,
          user: {
            id: userId,
            fullName: fullName.trim(),
            email: cleanEmail,
            targetRole: userRole,
            skills: userSkills
          }
        }
      });
    } catch (error: any) {
      console.error('[AuthController.register Error]:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to register account.' });
    }
  }

  /**
   * User Login (Zero-failure design: Atlas + local failover)
   */
  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email and password are required.' });
        return;
      }

      const cleanEmail = email.toLowerCase().trim();
      let user: any = null;

      // 1. Try finding in Atlas if connected
      if (isDbConnected) {
        try {
          user = await User.findOne({ email: cleanEmail });
        } catch (dbErr) {
          console.warn('[AuthController.login] Atlas query failed, checking local store:', dbErr);
          user = null;
        }
      }

      // 2. Fall back to local store if not found in Atlas or Atlas offline
      if (!user) {
        const local = fallbackStore.findUserByEmail(cleanEmail);
        if (local) {
          user = {
            id: local.id,
            _id: local.id,
            fullName: local.fullName,
            email: local.email,
            passwordHash: local.passwordHash,
            targetRole: local.targetRole,
            skills: local.skills
          };
        }
      }

      if (!user) {
        res.status(401).json({ success: false, error: 'Invalid email or password.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, error: 'Invalid email or password.' });
        return;
      }

      const userId = (user._id || user.id).toString();

      const token = generateToken({
        id: userId,
        email: user.email,
        fullName: user.fullName
      });

      res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        data: {
          token,
          user: {
            id: userId,
            fullName: user.fullName,
            email: user.email,
            targetRole: user.targetRole,
            skills: user.skills || []
          }
        }
      });
    } catch (error: any) {
      console.error('[AuthController.login Error]:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to log in.' });
    }
  }

  /**
   * Get Current User Profile
   */
  public static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      let user: any = null;

      if (isDbConnected) {
        try {
          user = await User.findById(req.user.id).select('-passwordHash');
        } catch (dbErr) {
          user = null;
        }
      }

      if (!user) {
        const local = fallbackStore.findUserById(req.user.id);
        if (local) {
          user = {
            id: local.id,
            _id: local.id,
            fullName: local.fullName,
            email: local.email,
            targetRole: local.targetRole,
            skills: local.skills
          };
        }
      }

      if (!user) {
        // Return profile from token payload if still not found
        user = {
          id: req.user.id,
          _id: req.user.id,
          fullName: req.user.fullName || 'Candidate',
          email: req.user.email,
          targetRole: 'Software Engineer',
          skills: []
        };
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Logout acknowledgment
   */
  public static logout(_req: Request, res: Response): void {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  }
}
