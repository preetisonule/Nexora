import mongoose from 'mongoose';
import { Module, IModuleDocument } from '../models/Module';
import { Lesson } from '../models/Lesson';
import { LessonProgress } from '../models/LessonProgress';
import { Quiz } from '../models/Quiz';
import { AssessmentAttempt } from '../models/AssessmentAttempt';
import { Assignment } from '../models/Assignment';
import { Submission } from '../models/Submission';
import { ModuleProgress } from '../models/ModuleProgress';
import { FinalProjectSubmission } from '../models/FinalProjectSubmission';
import { ICourseProgress, IModuleProgress } from '@compilo/shared';

export class ProgressService {
  /**
   * Recalculates and updates the learner's progress for a single module.
   */
  public static async updateModuleProgress(
    learnerId: string,
    moduleId: string
  ): Promise<IModuleProgress> {
    const mod = await Module.findById(moduleId);
    if (!mod) {
      throw new Error('Module not found');
    }

    const totalLessons = await Lesson.countDocuments({ moduleId, published: true });
    const completedLessons = await LessonProgress.countDocuments({
      learnerId,
      moduleId,
      completed: true,
    });

    // Check module test
    const moduleTest = await Quiz.findOne({ moduleId, isModuleTest: true, published: true });
    let moduleTestPassed = false;
    let moduleTestScore: number | undefined;

    if (moduleTest) {
      const bestAttempt = await AssessmentAttempt.findOne({
        learnerId,
        assessmentId: moduleTest._id,
        passed: true,
      }).sort({ score: -1 });

      if (bestAttempt) {
        moduleTestPassed = true;
        moduleTestScore = bestAttempt.score;
      }
    } else {
      // If no module test exists, consider it passed
      moduleTestPassed = true;
    }

    // Check quizzes
    const quizzes = await Quiz.find({ moduleId, isModuleTest: false, published: true });
    let quizzesPassed = true;
    for (const quiz of quizzes) {
      const passedAttempt = await AssessmentAttempt.findOne({
        learnerId,
        assessmentId: quiz._id,
        passed: true,
      });
      if (!passedAttempt) {
        quizzesPassed = false;
        break;
      }
    }

    // Check assignments
    const assignments = await Assignment.find({ moduleId, published: true });
    let assignmentsPassed = true;
    for (const assignment of assignments) {
      const passedSub = await Submission.findOne({
        learnerId,
        assignmentId: assignment._id,
        passed: true,
      });
      if (!passedSub) {
        assignmentsPassed = false;
        break;
      }
    }

    // Determine completion according to module completion rules
    const rules = mod.completionRules;
    const lessonsSatisfied = !rules.requireAllLessons || completedLessons >= totalLessons;
    const quizzesSatisfied = !rules.requireQuizzesPass || quizzesPassed;
    const assignmentsSatisfied = !rules.requireAssignmentsPass || assignmentsPassed;
    const testSatisfied = !rules.requireModuleTestPass || moduleTestPassed;

    const isCompleted = lessonsSatisfied && quizzesSatisfied && assignmentsSatisfied && testSatisfied;

    // Check unlock status
    const isUnlocked = await this.isModuleUnlocked(learnerId, mod);

    const updated = await ModuleProgress.findOneAndUpdate(
      { learnerId, moduleId },
      {
        learnerId,
        moduleId,
        unlocked: isUnlocked,
        completed: isCompleted,
        completedLessonsCount: completedLessons,
        totalLessonsCount: totalLessons,
        quizzesPassed,
        assignmentsPassed,
        moduleTestPassed,
        moduleTestScore,
        completedAt: isCompleted ? new Date() : undefined,
      },
      { upsert: true, new: true }
    );

    return {
      moduleId: mod._id.toString(),
      unlocked: isUnlocked,
      completed: isCompleted,
      completedLessonsCount: completedLessons,
      totalLessonsCount: totalLessons,
      quizzesPassed,
      assignmentsPassed,
      moduleTestPassed,
      moduleTestScore,
      completedAt: updated.completedAt?.toISOString(),
    };
  }

  /**
   * Evaluates if a module is unlocked for the learner.
   * Module 1 (order 1) is unlocked by default.
   * Subsequent modules unlock when all prerequisite modules are completed.
   */
  public static async isModuleUnlocked(learnerId: string, mod: IModuleDocument): Promise<boolean> {
    if (mod.order === 1) {
      return true;
    }

    // If explicit prerequisites are specified
    if (mod.prerequisiteModuleIds && mod.prerequisiteModuleIds.length > 0) {
      for (const prereqId of mod.prerequisiteModuleIds) {
        const prereqProgress = await ModuleProgress.findOne({
          learnerId,
          moduleId: prereqId,
          completed: true,
        });
        if (!prereqProgress) {
          return false;
        }
      }
      return true;
    }

    // Default sequential unlock: Previous module in the course must be completed
    const prevModule = await Module.findOne({
      courseId: mod.courseId,
      order: mod.order - 1,
      published: true,
    });

    if (!prevModule) {
      return true;
    }

    const prevProgress = await ModuleProgress.findOne({
      learnerId,
      moduleId: prevModule._id,
      completed: true,
    });

    return !!prevProgress;
  }

  /**
   * Computes full course progress for a learner.
   */
  public static async getCourseProgress(learnerId: string, courseId: string): Promise<ICourseProgress> {
    const modules = await Module.find({ courseId, published: true }).sort({ order: 1 });
    const modulesProgressList: IModuleProgress[] = [];

    let completedModulesCount = 0;
    let currentModuleId: string | undefined;
    let currentLessonId: string | undefined;

    for (const mod of modules) {
      const progress = await this.updateModuleProgress(learnerId, mod._id.toString());
      modulesProgressList.push(progress);

      if (progress.completed) {
        completedModulesCount++;
      } else if (!currentModuleId && progress.unlocked) {
        currentModuleId = mod._id.toString();

        // Find next incomplete lesson
        const lessons = await Lesson.find({ moduleId: mod._id, published: true }).sort({ order: 1 });
        for (const les of lessons) {
          const lp = await LessonProgress.findOne({ learnerId, lessonId: les._id, completed: true });
          if (!lp) {
            currentLessonId = les._id.toString();
            break;
          }
        }
      }
    }

    // If all unlocked modules are complete, set current to first incomplete or last
    if (!currentModuleId && modules.length > 0) {
      currentModuleId = modules[modules.length - 1]._id.toString();
    }

    const totalModulesCount = modules.length;
    const overallPercentage =
      totalModulesCount > 0 ? Math.round((completedModulesCount / totalModulesCount) * 100) : 0;

    // Check certificate eligibility
    const eligibility = await this.checkCertificateEligibility(learnerId, courseId);

    return {
      courseId,
      enrolled: true,
      overallPercentage,
      completedModulesCount,
      totalModulesCount,
      currentModuleId,
      currentLessonId,
      modulesProgress: modulesProgressList,
      certificateEligible: eligibility.eligible,
      certificateId: eligibility.certificateId,
    };
  }

  /**
   * Validates if learner is eligible for course certificate.
   */
  public static async checkCertificateEligibility(
    learnerId: string,
    courseId: string
  ): Promise<{ eligible: boolean; reason?: string; certificateId?: string }> {
    const modules = await Module.find({ courseId, published: true }).sort({ order: 1 });
    if (modules.length === 0) {
      return { eligible: false, reason: 'Course has no modules' };
    }

    // 1. All modules must be completed
    for (const mod of modules) {
      const mp = await ModuleProgress.findOne({
        learnerId,
        moduleId: mod._id,
        completed: true,
      });
      if (!mp) {
        return { eligible: false, reason: `Module "${mod.title}" is not yet completed` };
      }
    }

    // 2. Final Project must be submitted and approved
    const project = await FinalProjectSubmission.findOne({
      learnerId,
      courseId,
      status: 'approved',
    });
    if (!project) {
      return { eligible: false, reason: 'Final Project has not been approved' };
    }

    return { eligible: true };
  }
}
