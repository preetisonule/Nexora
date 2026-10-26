import { Response } from 'express';
import { FinalProjectSubmission } from '../models/FinalProjectSubmission';
import { Course } from '../models/Course';
import { AuditLog } from '../models/AuditLog';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class FinalProjectController {
  /** GET /projects — all capstone submissions for admin review (pending first). */
  public static async listSubmissions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { status } = req.query;
      const filter: any = {};
      if (status && ['pending', 'approved', 'rejected'].includes(String(status))) {
        filter.status = status;
      }

      const submissions = await FinalProjectSubmission.find(filter)
        .populate('learnerId', 'name email')
        .sort({ submittedAt: -1 });

      const order: Record<string, number> = { pending: 0, rejected: 1, approved: 2 };
      const data = submissions
        .map((s) => {
          const learner: any = s.learnerId;
          return {
            id: s._id.toString(),
            learnerId: learner?._id?.toString(),
            learnerName: learner?.name ?? 'Deleted user',
            learnerEmail: learner?.email ?? '',
            repositoryUrl: s.repositoryUrl,
            documentationText: s.documentationText,
            testInstructions: s.testInstructions,
            status: s.status,
            score: s.score,
            reviewNotes: s.reviewNotes,
            submittedAt: s.submittedAt?.toISOString(),
            reviewedAt: s.reviewedAt?.toISOString(),
          };
        })
        .sort((x, y) => order[x.status] - order[y.status]);

      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async submitProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const learnerId = req.user?._id;
      if (!learnerId) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
      }

      const defaultCourse = await Course.findOne({ published: true });
      if (!defaultCourse) {
        res.status(404).json({ success: false, error: 'Course not found' });
        return;
      }

      const { repositoryUrl, documentationText, testInstructions, sourceCodeArchive } = req.body;

      if (!documentationText || !String(documentationText).trim()) {
        res.status(400).json({ success: false, error: 'Project documentation is required.' });
        return;
      }
      if (repositoryUrl && !/^https?:\/\/\S+$/i.test(String(repositoryUrl).trim())) {
        res.status(400).json({ success: false, error: 'Repository URL must start with http:// or https://' });
        return;
      }

      // An approved project stays approved; resubmitting is only for pending / rejected work
      const existing = await FinalProjectSubmission.findOne({ learnerId, courseId: defaultCourse._id });
      if (existing?.status === 'approved') {
        res.status(400).json({ success: false, error: 'Your project is already approved.' });
        return;
      }

      const submission = await FinalProjectSubmission.findOneAndUpdate(
        { learnerId, courseId: defaultCourse._id },
        {
          learnerId,
          courseId: defaultCourse._id,
          repositoryUrl,
          documentationText,
          testInstructions: testInstructions || 'Not provided',
          sourceCodeArchive,
          status: 'pending',
          score: undefined,
          reviewNotes: undefined,
          submittedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      res.status(201).json({
        success: true,
        message: 'Final project submitted successfully. It will be reviewed by an instructor.',
        data: submission,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getMySubmission(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const learnerId = req.user?._id;
      const defaultCourse = await Course.findOne({ published: true });

      if (!defaultCourse) {
        res.status(404).json({ success: false, error: 'Course not found' });
        return;
      }

      const submission = await FinalProjectSubmission.findOne({
        learnerId,
        courseId: defaultCourse._id,
      });

      res.json({ success: true, data: submission });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async adminReview(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, score, reviewNotes } = req.body;

      if (!['approved', 'rejected'].includes(status)) {
        res.status(400).json({ success: false, error: 'Status must be "approved" or "rejected".' });
        return;
      }
      if (score !== undefined && score !== null && (typeof score !== 'number' || score < 0 || score > 100)) {
        res.status(400).json({ success: false, error: 'Score must be a number between 0 and 100.' });
        return;
      }

      const submission = await FinalProjectSubmission.findByIdAndUpdate(
        id,
        {
          status,
          score,
          reviewNotes,
          reviewedAt: new Date(),
          reviewedBy: req.user?._id,
        },
        { new: true }
      );

      if (!submission) {
        res.status(404).json({ success: false, error: 'Submission not found' });
        return;
      }

      await AuditLog.create({
        actorId: req.user?._id,
        actorName: req.user?.name,
        actorRole: req.user?.role,
        action: 'PROJECT_REVIEW',
        resourceType: 'FinalProjectSubmission',
        resourceId: id,
        changeSummary: `Reviewed final project: ${status}${score != null ? ` (Score: ${score})` : ''}`,
      });

      res.json({ success: true, data: submission });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
