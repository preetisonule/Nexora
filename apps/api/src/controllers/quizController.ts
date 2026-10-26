import { Response } from 'express';
import mongoose from 'mongoose';
import { Quiz } from '../models/Quiz';
import { Question } from '../models/Question';
import { AssessmentAttempt } from '../models/AssessmentAttempt';
import { AuditLog } from '../models/AuditLog';
import { ProgressService } from '../services/progressService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class QuizController {
  /** GET /quizzes?moduleId= — quizzes for a module (or all, for admins) with the learner's status. */
  public static async listQuizzes(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { moduleId } = req.query;
      const isAdmin = !!req.user && ['admin', 'superadmin', 'instructor'].includes(req.user.role);

      const filter: any = {};
      if (moduleId) {
        if (!mongoose.isValidObjectId(moduleId)) {
          res.json({ success: true, data: [] });
          return;
        }
        filter.moduleId = moduleId;
      }
      if (!isAdmin) filter.published = true;

      const quizzes = await Quiz.find(filter).populate('moduleId', 'title order').sort({ createdAt: 1 });

      const data = await Promise.all(
        quizzes.map(async (quiz) => {
          const questionCount = await Question.countDocuments({ quizId: quiz._id });
          let userStats = null;
          if (req.user) {
            const attempts = await AssessmentAttempt.find({ learnerId: req.user._id, assessmentId: quiz._id })
              .sort({ score: -1 })
              .select('score passed');
            userStats = {
              attemptsUsed: attempts.length,
              bestScore: attempts[0]?.score ?? null,
              passed: attempts.some((a) => a.passed),
            };
          }
          const mod: any = quiz.moduleId;
          return {
            id: quiz._id.toString(),
            moduleId: mod?._id?.toString() ?? mod?.toString(),
            moduleTitle: mod?.title,
            moduleOrder: mod?.order,
            isModuleTest: quiz.isModuleTest,
            title: quiz.title,
            instructions: quiz.instructions,
            passingScore: quiz.passingScore,
            maxAttempts: quiz.maxAttempts,
            timeLimitMinutes: quiz.timeLimitMinutes,
            published: quiz.published,
            questionCount,
            userStats,
          };
        })
      );

      // Sort by module order so admin lists read top to bottom
      data.sort((a, b) => (a.moduleOrder ?? 0) - (b.moduleOrder ?? 0) || Number(a.isModuleTest) - Number(b.isModuleTest));
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getQuizById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        res.status(404).json({ success: false, error: 'Quiz not found' });
        return;
      }
      const quiz = await Quiz.findById(id);
      if (!quiz) {
        res.status(404).json({ success: false, error: 'Quiz not found' });
        return;
      }

      const lockedMsg = await ProgressService.lockedMessage(req.user, quiz.moduleId);
      if (lockedMsg) {
        res.status(403).json({ success: false, error: lockedMsg, isLocked: true });
        return;
      }

      const questions = await Question.find({ quizId: quiz._id }).sort({ order: 1 });
      const isAdmin = req.user && ['admin', 'superadmin', 'instructor'].includes(req.user.role);

      // Previous attempts for this learner
      let attemptsCount = 0;
      let bestAttempt = null;

      if (req.user) {
        attemptsCount = await AssessmentAttempt.countDocuments({
          learnerId: req.user._id,
          assessmentId: quiz._id,
        });

        bestAttempt = await AssessmentAttempt.findOne({
          learnerId: req.user._id,
          assessmentId: quiz._id,
        }).sort({ score: -1 });
      }

      // Hide answer keys and explanations from learners before submission
      const sanitizedQuestions = questions.map((q) => {
        const base: any = {
          id: q._id.toString(),
          quizId: q.quizId.toString(),
          type: q.type,
          prompt: q.prompt,
          codeSnippet: q.codeSnippet,
          options: q.options,
          points: q.points,
          order: q.order,
        };

        if (isAdmin) {
          base.correctAnswers = q.correctAnswers;
          base.explanation = q.explanation;
        }

        return base;
      });

      res.json({
        success: true,
        data: {
          id: quiz._id.toString(),
          moduleId: quiz.moduleId?.toString(),
          lessonId: quiz.lessonId?.toString(),
          isModuleTest: quiz.isModuleTest,
          title: quiz.title,
          instructions: quiz.instructions,
          passingScore: quiz.passingScore,
          maxAttempts: quiz.maxAttempts,
          timeLimitMinutes: quiz.timeLimitMinutes,
          published: quiz.published,
          questions: sanitizedQuestions,
          userStats: {
            attemptsUsed: attemptsCount,
            attemptsRemaining: Math.max(0, quiz.maxAttempts - attemptsCount),
            bestScore: bestAttempt?.score ?? null,
            passed: bestAttempt?.passed ?? false,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async submitAttempt(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const learnerId = req.user?._id;

      if (!learnerId) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
      }

      const quiz = mongoose.isValidObjectId(id) ? await Quiz.findById(id) : null;
      if (!quiz) {
        res.status(404).json({ success: false, error: 'Quiz not found' });
        return;
      }

      const lockedMsg = await ProgressService.lockedMessage(req.user, quiz.moduleId);
      if (lockedMsg) {
        res.status(403).json({ success: false, error: lockedMsg, isLocked: true });
        return;
      }

      // Check max attempts
      const attemptsCount = await AssessmentAttempt.countDocuments({
        learnerId,
        assessmentId: quiz._id,
      });

      if (quiz.maxAttempts > 0 && attemptsCount >= quiz.maxAttempts) {
        res.status(400).json({
          success: false,
          error: `Maximum attempts limit (${quiz.maxAttempts}) reached for this assessment.`,
        });
        return;
      }

      const { answers = [] } = (req.body || {}) as {
        answers?: { questionId: string; selectedOptionIds: string[] }[];
      };
      const answerMap = new Map(answers.map((a) => [a.questionId, a.selectedOptionIds || []]));

      // Score against every question in the quiz, so unanswered questions count as wrong
      const questions = await Question.find({ quizId: quiz._id }).sort({ order: 1 });

      let totalPoints = 0;
      let earnedPoints = 0;

      const questionResults = questions.map((question) => {
        const ans = { questionId: question._id.toString(), selectedOptionIds: answerMap.get(question._id.toString()) || [] };
        totalPoints += question.points;

        // Check if selected options match correct answers
        const userSet = new Set(ans.selectedOptionIds);
        const correctSet = new Set(question.correctAnswers);

        const isCorrect =
          userSet.size === correctSet.size &&
          [...userSet].every((val) => correctSet.has(val));

        const pointsEarned = isCorrect ? question.points : 0;
        earnedPoints += pointsEarned;

        return {
          questionId: question._id.toString(),
          isCorrect,
          userAnswers: ans.selectedOptionIds,
          correctAnswers: question.correctAnswers,
          explanation: question.explanation,
          pointsEarned,
          maxPoints: question.points,
        };
      });

      const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
      const passed = score >= quiz.passingScore;

      const attempt = await AssessmentAttempt.create({
        learnerId,
        assessmentId: quiz._id,
        isModuleTest: quiz.isModuleTest,
        moduleId: quiz.moduleId,
        answers: questionResults.map((r) => ({
          questionId: r.questionId,
          selectedOptionIds: r.userAnswers,
        })),
        score,
        passed,
        attemptNumber: attemptsCount + 1,
        startedAt: new Date(),
        submittedAt: new Date(),
        questionResults,
      });

      // Recalculate module progress if linked to a module
      if (quiz.moduleId) {
        await ProgressService.updateModuleProgress(learnerId.toString(), quiz.moduleId.toString());
      }

      res.status(201).json({
        success: true,
        message: passed ? 'Assessment passed!' : 'Assessment submitted. Review your answers below.',
        data: {
          attemptId: attempt._id.toString(),
          score,
          passed,
          passingScore: quiz.passingScore,
          attemptNumber: attempt.attemptNumber,
          attemptsRemaining: Math.max(0, quiz.maxAttempts - (attemptsCount + 1)),
          questionResults,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getAttemptResults(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const attempt = await AssessmentAttempt.findById(id);

      if (!attempt) {
        res.status(404).json({ success: false, error: 'Attempt not found' });
        return;
      }

      if (
        req.user &&
        req.user.role === 'learner' &&
        attempt.learnerId.toString() !== req.user._id.toString()
      ) {
        res.status(403).json({ success: false, error: 'Unauthorized to view this attempt' });
        return;
      }

      res.json({ success: true, data: attempt });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async createQuiz(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const quiz = await Quiz.create(req.body);
      res.status(201).json({ success: true, data: quiz });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async updateQuiz(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const quiz = await Quiz.findByIdAndUpdate(id, req.body, { new: true });
      if (!quiz) {
        res.status(404).json({ success: false, error: 'Quiz not found' });
        return;
      }
      res.json({ success: true, data: quiz });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async deleteQuiz(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await Quiz.findByIdAndDelete(id);
      await Question.deleteMany({ quizId: id });
      res.json({ success: true, message: 'Quiz deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async addQuestion(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const question = await Question.create(req.body);
      res.status(201).json({ success: true, data: question });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async updateQuestion(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const question = await Question.findByIdAndUpdate(id, req.body, { new: true });
      if (!question) {
        res.status(404).json({ success: false, error: 'Question not found' });
        return;
      }
      res.json({ success: true, data: question });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async deleteQuestion(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await Question.findByIdAndDelete(id);
      res.json({ success: true, message: 'Question deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
