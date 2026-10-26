import { Request, Response } from 'express';
import { Course } from '../models/Course';
import { Module } from '../models/Module';
import { Lesson } from '../models/Lesson';
import { AuditLog } from '../models/AuditLog';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class CourseController {
  public static async getAllCourses(req: Request, res: Response): Promise<void> {
    try {
      const courses = await Course.find({ published: true });
      const coursesWithCounts = await Promise.all(
        courses.map(async (c) => {
          const moduleCount = await Module.countDocuments({ courseId: c._id, published: true });
          const lessonCount = await Lesson.countDocuments({
            moduleId: { $in: await Module.find({ courseId: c._id }).distinct('_id') },
            published: true,
          });
          return {
            id: c._id.toString(),
            title: c.title,
            slug: c.slug,
            description: c.description,
            level: c.level,
            prerequisites: c.prerequisites,
            learningObjectives: c.learningObjectives,
            estimatedDuration: c.estimatedDuration,
            published: c.published,
            moduleCount,
            lessonCount,
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
          };
        })
      );

      res.json({ success: true, data: coursesWithCounts });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getCourseBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const course = await Course.findOne({ slug });
      if (!course) {
        res.status(404).json({ success: false, error: 'Course not found' });
        return;
      }

      const moduleCount = await Module.countDocuments({ courseId: course._id, published: true });
      const lessonCount = await Lesson.countDocuments({
        moduleId: { $in: await Module.find({ courseId: course._id }).distinct('_id') },
        published: true,
      });

      res.json({
        success: true,
        data: {
          id: course._id.toString(),
          title: course.title,
          slug: course.slug,
          description: course.description,
          level: course.level,
          prerequisites: course.prerequisites,
          learningObjectives: course.learningObjectives,
          estimatedDuration: course.estimatedDuration,
          published: course.published,
          moduleCount,
          lessonCount,
          createdAt: course.createdAt.toISOString(),
          updatedAt: course.updatedAt.toISOString(),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async createCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const course = await Course.create({
        ...req.body,
        createdBy: req.user?._id,
      });

      await AuditLog.create({
        actorId: req.user?._id,
        actorName: req.user?.name,
        actorRole: req.user?.role,
        action: 'COURSE_CREATE',
        resourceType: 'Course',
        resourceId: course._id.toString(),
        changeSummary: `Created course "${course.title}"`,
      });

      res.status(201).json({ success: true, data: course });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async updateCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const course = await Course.findByIdAndUpdate(id, req.body, { new: true });
      if (!course) {
        res.status(404).json({ success: false, error: 'Course not found' });
        return;
      }

      await AuditLog.create({
        actorId: req.user?._id,
        actorName: req.user?.name,
        actorRole: req.user?.role,
        action: 'COURSE_UPDATE',
        resourceType: 'Course',
        resourceId: course._id.toString(),
        changeSummary: `Updated course "${course.title}"`,
      });

      res.json({ success: true, data: course });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async deleteCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const course = await Course.findByIdAndDelete(id);
      if (!course) {
        res.status(404).json({ success: false, error: 'Course not found' });
        return;
      }

      await AuditLog.create({
        actorId: req.user?._id,
        actorName: req.user?.name,
        actorRole: req.user?.role,
        action: 'COURSE_DELETE',
        resourceType: 'Course',
        resourceId: id,
        changeSummary: `Deleted course "${course.title}"`,
      });

      res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
