import { Response } from 'express';
import mongoose from 'mongoose';
import { LessonProgress } from '../models/LessonProgress';
import { Module } from '../models/Module';
import { Lesson } from '../models/Lesson';
import { Course } from '../models/Course';
import { AuditLog } from '../models/AuditLog';
import { ProgressService } from '../services/progressService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class ModuleController {
  public static async getModules(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { courseId, slug } = req.query;
      let targetCourseId = courseId;

      if (!targetCourseId && slug) {
        const course = await Course.findOne({ slug });
        if (course) targetCourseId = course._id.toString();
      }

      if (!targetCourseId) {
        const defaultCourse = await Course.findOne({ published: true });
        if (defaultCourse) targetCourseId = defaultCourse._id.toString();
      }

      const query: any = { published: true };
      if (targetCourseId) {
        query.courseId = targetCourseId;
      }

      // If admin, show all modules including unpublished
      if (req.user && ['admin', 'superadmin'].includes(req.user.role)) {
        delete query.published;
      }

      const modules = await Module.find(query).sort({ order: 1 });

      const data = await Promise.all(
        modules.map(async (mod) => {
          const lessons = await Lesson.find({ moduleId: mod._id, published: true })
            .sort({ order: 1 })
            .select('_id title slug order estimatedDuration published');

          let isUnlocked = true;
          let isCompleted = false;
          let completedLessonsCount = 0;

          if (req.user) {
            const modProgress = await ProgressService.updateModuleProgress(
              req.user._id.toString(),
              mod._id.toString()
            );
            isUnlocked = modProgress.unlocked;
            isCompleted = modProgress.completed;
            completedLessonsCount = modProgress.completedLessonsCount;
          }

          return {
            id: mod._id.toString(),
            courseId: mod.courseId.toString(),
            title: mod.title,
            slug: mod.slug,
            order: mod.order,
            description: mod.description,
            objectives: mod.objectives,
            prerequisiteModuleIds: mod.prerequisiteModuleIds.map((p) => p.toString()),
            estimatedDuration: mod.estimatedDuration,
            completionRules: mod.completionRules,
            published: mod.published,
            unlocked: isUnlocked,
            completed: isCompleted,
            completedLessonsCount,
            totalLessonsCount: lessons.length,
            lessons: lessons.map((l) => ({
              id: l._id.toString(),
              moduleId: mod._id.toString(),
              title: l.title,
              slug: l.slug,
              order: l.order,
              estimatedDuration: l.estimatedDuration,
              published: l.published,
            })),
            createdAt: mod.createdAt.toISOString(),
            updatedAt: mod.updatedAt.toISOString(),
          };
        })
      );

      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getModuleById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const mod = mongoose.isValidObjectId(id) ? await Module.findById(id) : null;
      if (!mod) {
        res.status(404).json({ success: false, error: 'Module not found' });
        return;
      }

      // Progress for the logged-in user (admins are never locked)
      let isUnlocked = true;
      let isCompleted = false;
      let progress: any = null;
      let completedLessonIds: string[] = [];

      if (req.user) {
        progress = await ProgressService.updateModuleProgress(req.user._id.toString(), mod._id.toString());
        isCompleted = progress.completed;
        if (req.user.role === 'learner') isUnlocked = progress.unlocked;
        const done = await LessonProgress.find({ learnerId: req.user._id, moduleId: mod._id, completed: true }).select('lessonId');
        completedLessonIds = done.map((d) => d.lessonId.toString());
      }

      const lessons = await Lesson.find({ moduleId: mod._id, published: true })
        .sort({ order: 1 })
        .select('_id title slug order estimatedDuration published');

      res.json({
        success: true,
        data: {
          id: mod._id.toString(),
          courseId: mod.courseId.toString(),
          title: mod.title,
          slug: mod.slug,
          order: mod.order,
          description: mod.description,
          objectives: mod.objectives,
          prerequisiteModuleIds: mod.prerequisiteModuleIds.map((p) => p.toString()),
          estimatedDuration: mod.estimatedDuration,
          completionRules: mod.completionRules,
          published: mod.published,
          unlocked: isUnlocked,
          completed: isCompleted,
          progress,
          completedLessonIds,
          lessons: lessons.map((l) => ({
            id: l._id.toString(),
            moduleId: mod._id.toString(),
            title: l.title,
            slug: l.slug,
            order: l.order,
            estimatedDuration: l.estimatedDuration,
            published: l.published,
          })),
          createdAt: mod.createdAt.toISOString(),
          updatedAt: mod.updatedAt.toISOString(),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async createModule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const mod = await Module.create(req.body);

      await AuditLog.create({
        actorId: req.user?._id,
        actorName: req.user?.name,
        actorRole: req.user?.role,
        action: 'MODULE_CREATE',
        resourceType: 'Module',
        resourceId: mod._id.toString(),
        changeSummary: `Created module "${mod.title}" (Order: ${mod.order})`,
      });

      res.status(201).json({ success: true, data: mod });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async updateModule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const mod = await Module.findByIdAndUpdate(id, req.body, { new: true });
      if (!mod) {
        res.status(404).json({ success: false, error: 'Module not found' });
        return;
      }

      await AuditLog.create({
        actorId: req.user?._id,
        actorName: req.user?.name,
        actorRole: req.user?.role,
        action: 'MODULE_UPDATE',
        resourceType: 'Module',
        resourceId: mod._id.toString(),
        changeSummary: `Updated module "${mod.title}"`,
      });

      res.json({ success: true, data: mod });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async deleteModule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const mod = await Module.findByIdAndDelete(id);
      if (!mod) {
        res.status(404).json({ success: false, error: 'Module not found' });
        return;
      }

      await AuditLog.create({
        actorId: req.user?._id,
        actorName: req.user?.name,
        actorRole: req.user?.role,
        action: 'MODULE_DELETE',
        resourceType: 'Module',
        resourceId: id,
        changeSummary: `Deleted module "${mod.title}"`,
      });

      res.json({ success: true, message: 'Module deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async reorderModules(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { moduleOrders } = req.body as { moduleOrders: { id: string; order: number }[] };

      for (const item of moduleOrders) {
        await Module.findByIdAndUpdate(item.id, { order: item.order });
      }

      await AuditLog.create({
        actorId: req.user?._id,
        actorName: req.user?.name,
        actorRole: req.user?.role,
        action: 'MODULE_REORDER',
        resourceType: 'Module',
        resourceId: 'multiple',
        changeSummary: 'Reordered course modules',
      });

      res.json({ success: true, message: 'Modules reordered successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
