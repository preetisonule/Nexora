import { Response } from 'express';
import { User } from '../models/User';
import { Enrollment } from '../models/Enrollment';
import { AssessmentAttempt } from '../models/AssessmentAttempt';
import { Submission } from '../models/Submission';
import { Certificate } from '../models/Certificate';
import { Module } from '../models/Module';
import { ModuleProgress } from '../models/ModuleProgress';
import { AuditLog } from '../models/AuditLog';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { IAdminMetrics } from '@compilo/shared';

export class AdminController {
  public static async getDashboardMetrics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const totalLearners = await User.countDocuments({ role: 'learner' });
      const courseEnrollments = await Enrollment.countDocuments();
      const activeLearners = await Enrollment.countDocuments({ status: 'active' });

      const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
      const courseCompletionRate =
        courseEnrollments > 0 ? Math.round((completedEnrollments / courseEnrollments) * 100) : 0;

      // Assessment average
      const avgScoreAgg = await AssessmentAttempt.aggregate([
        { $group: { _id: null, avgScore: { $avg: '$score' } } },
      ]);
      const averageAssessmentScore =
        avgScoreAgg.length > 0 ? Math.round(avgScoreAgg[0].avgScore) : 0;

      // Submissions metrics
      const totalSubmissions = await Submission.countDocuments();
      const passedSubmissions = await Submission.countDocuments({ passed: true });
      const assignmentPassRate =
        totalSubmissions > 0 ? Math.round((passedSubmissions / totalSubmissions) * 100) : 0;

      const certificatesIssued = await Certificate.countDocuments({ status: 'valid' });

      // Recent learners
      const recentLearners = await User.find({ role: 'learner' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('_id name email status createdAt');

      // Recent submissions
      const recentSubs = await Submission.find()
        .sort({ submittedAt: -1 })
        .limit(6)
        .populate('learnerId', 'name')
        .populate('assignmentId', 'title');

      // Module completion stats
      const modules = await Module.find().sort({ order: 1 });
      const moduleCompletionStats = await Promise.all(
        modules.map(async (m) => {
          const completedCount = await ModuleProgress.countDocuments({
            moduleId: m._id,
            completed: true,
          });
          return {
            moduleNumber: m.order,
            moduleTitle: m.title,
            completedCount,
          };
        })
      );

      // Enrollment trend mock/live days
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const enrollmentTrend = days.map((day, idx) => ({
        date: day,
        count: Math.max(1, Math.round(totalLearners * (0.1 + idx * 0.05))),
      }));

      const metrics: IAdminMetrics = {
        totalLearners,
        courseEnrollments,
        activeLearners,
        courseCompletionRate,
        averageAssessmentScore,
        totalSubmissions,
        assignmentPassRate,
        certificatesIssued,
        recentLearners: recentLearners.map((u) => ({
          id: u._id.toString(),
          name: u.name,
          email: u.email,
          status: u.status,
          createdAt: u.createdAt.toISOString(),
        })),
        recentSubmissions: recentSubs.map((s: any) => ({
          id: s._id.toString(),
          learnerName: s.learnerId?.name || 'Learner',
          assignmentTitle: s.assignmentId?.title || 'Assignment',
          passed: s.passed,
          score: s.score,
          submittedAt: s.submittedAt.toISOString(),
        })),
        moduleCompletionStats,
        enrollmentTrend,
      };

      res.json({ success: true, data: metrics });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { search, role, page = '1', limit = '20' } = req.query as any;
      const query: any = {};

      if (role && role !== 'all') {
        query.role = role;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const p = parseInt(page, 10);
      const l = parseInt(limit, 10);

      const total = await User.countDocuments(query);
      const users = await User.find(query)
        .sort({ createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l)
        .select('-passwordHash');

      res.json({
        success: true,
        data: {
          users: users.map((u) => ({
            id: u._id.toString(),
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.status,
            createdAt: u.createdAt.toISOString(),
          })),
          pagination: {
            page: p,
            limit: l,
            total,
            totalPages: Math.ceil(total / l),
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async updateUserRole(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // Prevent ordinary admins from promoting to superadmin
      if (role === 'superadmin' && req.user?.role !== 'superadmin') {
        res.status(403).json({ success: false, error: 'Only superadmins can assign superadmin role.' });
        return;
      }

      const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      await AuditLog.create({
        actorId: req.user?._id,
        actorName: req.user?.name,
        actorRole: req.user?.role,
        action: 'USER_ROLE_UPDATE',
        resourceType: 'User',
        resourceId: id,
        changeSummary: `Changed role of ${user.email} to ${role}`,
      });

      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async toggleUserStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-passwordHash');
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      await AuditLog.create({
        actorId: req.user?._id,
        actorName: req.user?.name,
        actorRole: req.user?.role,
        action: 'USER_STATUS_UPDATE',
        resourceType: 'User',
        resourceId: id,
        changeSummary: `Changed status of ${user.email} to ${status}`,
      });

      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getCertificates(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const certificates = await Certificate.find().sort({ issueDate: -1 });
      res.json({ success: true, data: certificates });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async revokeCertificate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const cert = await Certificate.findByIdAndUpdate(
        id,
        {
          status: 'revoked',
          revokedAt: new Date(),
          revocationReason: reason || 'Revoked by administrator',
        },
        { new: true }
      );

      if (!cert) {
        res.status(404).json({ success: false, error: 'Certificate not found' });
        return;
      }

      await AuditLog.create({
        actorId: req.user?._id,
        actorName: req.user?.name,
        actorRole: req.user?.role,
        action: 'CERTIFICATE_REVOKE',
        resourceType: 'Certificate',
        resourceId: id,
        changeSummary: `Revoked certificate ${cert.certificateId}. Reason: ${reason}`,
      });

      res.json({ success: true, message: 'Certificate revoked successfully', data: cert });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getAuditLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(50);
      res.json({ success: true, data: logs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
