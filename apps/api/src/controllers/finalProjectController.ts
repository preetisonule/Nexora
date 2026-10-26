import { Response } from 'express';
import { FinalProjectSubmission } from '../models/FinalProjectSubmission';
import { Course } from '../models/Course';
import { AuditLog } from '../models/AuditLog';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class FinalProjectController {
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

      const submission = await FinalProjectSubmission.findOneAndUpdate(
        { learnerId, courseId: defaultCourse._id },
        {
          learnerId,
          courseId: defaultCourse._id,
          repositoryUrl,
          documentationText,
          testInstructions,
          sourceCodeArchive,
          status: 'pending',
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
        changeSummary: `Reviewed final project: ${status} (Score: ${score})`,
      });

      res.json({ success: true, data: submission });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
