import { Response } from 'express';
import { Course } from '../models/Course';
import { ProgressService } from '../services/progressService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class ProgressController {
  public static async getMyProgress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const learnerId = req.user?._id;
      if (!learnerId) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
      }

      // Default to Go course
      const course = await Course.findOne({ published: true });
      if (!course) {
        res.status(404).json({ success: false, error: 'No active course found' });
        return;
      }

      const progress = await ProgressService.getCourseProgress(
        learnerId.toString(),
        course._id.toString()
      );

      res.json({
        success: true,
        data: {
          ...progress,
          courseTitle: course.title,
          courseSlug: course.slug,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getCourseProgress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const learnerId = req.user?._id;
      const { courseId } = req.params;

      if (!learnerId) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
      }

      const progress = await ProgressService.getCourseProgress(learnerId.toString(), courseId);
      res.json({ success: true, data: progress });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
