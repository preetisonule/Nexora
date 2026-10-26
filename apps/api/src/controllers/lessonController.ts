import { Response } from 'express';
import mongoose from 'mongoose';
import { Lesson } from '../models/Lesson';
import { Module } from '../models/Module';
import { LessonProgress } from '../models/LessonProgress';
import { AuditLog } from '../models/AuditLog';
import { ProgressService } from '../services/progressService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class LessonController {
  public static async getLessonById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const lesson = mongoose.isValidObjectId(id) ? await Lesson.findById(id) : null;
      if (!lesson) {
        res.status(404).json({ success: false, error: 'Lesson not found' });
        return;
      }

      const mod = await Module.findById(lesson.moduleId);
      if (!mod) {
        res.status(404).json({ success: false, error: 'Parent module not found' });
        return;
      }

      // Check if learner is allowed to view this module
      if (req.user && req.user.role === 'learner') {
        const isUnlocked = await ProgressService.isModuleUnlocked(req.user._id.toString(), mod);
        if (!isUnlocked) {
          res.status(403).json({
            success: false,
            error: `This lesson belongs to "${mod.title}", which is currently locked. Complete the previous module requirements to unlock it.`,
            isLocked: true,
          });
          return;
        }
      }

      // Fetch all lessons in module for previous / next navigation
      const siblingLessons = await Lesson.find({ moduleId: mod._id, published: true })
        .sort({ order: 1 })
        .select('_id title slug order');

      const currentIndex = siblingLessons.findIndex((l) => l._id.toString() === lesson._id.toString());
      const prevLesson = currentIndex > 0 ? siblingLessons[currentIndex - 1] : null;
      const nextLesson = currentIndex < siblingLessons.length - 1 ? siblingLessons[currentIndex + 1] : null;

      let isCompleted = false;
      if (req.user) {
        const lp = await LessonProgress.findOne({
          learnerId: req.user._id,
          lessonId: lesson._id,
          completed: true,
        });
        isCompleted = !!lp;
      }

      res.json({
        success: true,
        data: {
          id: lesson._id.toString(),
          moduleId: lesson.moduleId.toString(),
          moduleTitle: mod.title,
          moduleOrder: mod.order,
          title: lesson.title,
          slug: lesson.slug,
          order: lesson.order,
          introduction: lesson.introduction,
          objectives: lesson.objectives,
          readingContent: lesson.readingContent,
          videoReference: lesson.videoReference,
          codeExamples: lesson.codeExamples,
          commonMistakes: lesson.commonMistakes,
          comparisonWithOtherLanguages: lesson.comparisonWithOtherLanguages,
          keyTakeaways: lesson.keyTakeaways,
          knowledgeCheck: lesson.knowledgeCheck,
          estimatedDuration: lesson.estimatedDuration,
          published: lesson.published,
          isCompleted,
          navigation: {
            prevLessonId: prevLesson?._id.toString(),
            prevLessonTitle: prevLesson?.title,
            nextLessonId: nextLesson?._id.toString(),
            nextLessonTitle: nextLesson?.title,
          },
          moduleLessons: siblingLessons.map((l) => ({
            id: l._id.toString(),
            title: l.title,
            order: l.order,
          })),
          createdAt: lesson.createdAt.toISOString(),
          updatedAt: lesson.updatedAt.toISOString(),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async completeLesson(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const learnerId = req.user?._id;

      if (!learnerId) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
      }

      const lesson = await Lesson.findById(id);
      if (!lesson) {
        res.status(404).json({ success: false, error: 'Lesson not found' });
        return;
      }

      await LessonProgress.findOneAndUpdate(
        { learnerId, lessonId: lesson._id },
        {
          learnerId,
          lessonId: lesson._id,
          moduleId: lesson.moduleId,
          completed: true,
          completedAt: new Date(),
          lastVisitedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      // Recalculate module progress
      const updatedModuleProgress = await ProgressService.updateModuleProgress(
        learnerId.toString(),
        lesson.moduleId.toString()
      );

      res.json({
        success: true,
        message: 'Lesson marked as completed',
        data: {
          lessonId: lesson._id.toString(),
          completed: true,
          moduleProgress: updatedModuleProgress,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async createLesson(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const lesson = await Lesson.create(req.body);

      await AuditLog.create({
        actorId: req.user?._id,
        actorName: req.user?.name,
        actorRole: req.user?.role,
        action: 'LESSON_CREATE',
        resourceType: 'Lesson',
        resourceId: lesson._id.toString(),
        changeSummary: `Created lesson "${lesson.title}"`,
      });

      res.status(201).json({ success: true, data: lesson });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async updateLesson(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const lesson = await Lesson.findByIdAndUpdate(id, req.body, { new: true });
      if (!lesson) {
        res.status(404).json({ success: false, error: 'Lesson not found' });
        return;
      }

      await AuditLog.create({
        actorId: req.user?._id,
        actorName: req.user?.name,
        actorRole: req.user?.role,
        action: 'LESSON_UPDATE',
        resourceType: 'Lesson',
        resourceId: lesson._id.toString(),
        changeSummary: `Updated lesson "${lesson.title}"`,
      });

      res.json({ success: true, data: lesson });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async deleteLesson(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const lesson = await Lesson.findByIdAndDelete(id);
      if (!lesson) {
        res.status(404).json({ success: false, error: 'Lesson not found' });
        return;
      }

      await AuditLog.create({
        actorId: req.user?._id,
        actorName: req.user?.name,
        actorRole: req.user?.role,
        action: 'LESSON_DELETE',
        resourceType: 'Lesson',
        resourceId: id,
        changeSummary: `Deleted lesson "${lesson.title}"`,
      });

      res.json({ success: true, message: 'Lesson deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
