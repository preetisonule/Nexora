import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User';
import { Enrollment } from '../models/Enrollment';
import { Course } from '../models/Course';
import { config } from '../config';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(400).json({ success: false, error: 'An account with this email already exists.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: 'learner',
        status: 'active',
      });

      // Auto-enroll in the default Go course if published
      const defaultCourse = await Course.findOne({ published: true });
      if (defaultCourse) {
        await Enrollment.create({
          learnerId: user._id,
          courseId: defaultCourse._id,
          status: 'active',
        });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
        expiresIn: '7d',
      });

      res.cookie('compilo_token', token, COOKIE_OPTIONS);

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt.toISOString(),
          },
          token,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Registration failed' });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        res.status(401).json({ success: false, error: 'Invalid email or password.' });
        return;
      }

      if (user.status === 'suspended') {
        res.status(403).json({ success: false, error: 'Your account has been suspended. Please contact support.' });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ success: false, error: 'Invalid email or password.' });
        return;
      }

      const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
        expiresIn: '7d',
      });

      res.cookie('compilo_token', token, COOKIE_OPTIONS);

      res.json({
        success: true,
        message: 'Logged in successfully',
        data: {
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt.toISOString(),
          },
          token,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Login failed' });
    }
  }

  public static async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('compilo_token', {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
    });
    res.json({ success: true, message: 'Logged out successfully' });
  }

  public static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    res.json({
      success: true,
      data: {
        id: req.user._id.toString(),
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        status: req.user.status,
        createdAt: req.user.createdAt.toISOString(),
      },
    });
  }

  public static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        // Return 200 without leaking whether email exists
        res.json({
          success: true,
          message: 'If an account exists with this email, a reset link will be sent.',
        });
        return;
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      // Return token in dev mode for easy testability
      res.json({
        success: true,
        message: 'Password reset token generated.',
        data: config.nodeEnv === 'development' ? { resetToken } : undefined,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
      });

      if (!user) {
        res.status(400).json({ success: false, error: 'Password reset token is invalid or has expired.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ success: true, message: 'Password has been successfully reset. Please log in.' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
