import { Response } from 'express';
import { Quiz } from '../models/Quiz';
import { Question } from '../models/Question';
import { AssessmentAttempt } from '../models/AssessmentAttempt';
import { AuditLog } from '../models/AuditLog';
import { ProgressService } from '../services/progressService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class QuizController {
  public static async getQuizById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const quiz = await Quiz.findById(id);
      if (!quiz) {
        res.status(404).json({ success: false, error: 'Quiz not found' });
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

      const quiz = await Quiz.findById(id);
      if (!quiz) {
        res.status(404).json({ success: false, error: 'Quiz not found' });
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

      const { answers } = req.body as {
        answers: { questionId: string; selectedOptionIds: string[] }[];
      };

      const questions = await Question.find({ quizId: quiz._id });
      const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

      let totalPoints = 0;
      let earnedPoints = 0;

      const questionResults = answers.map((ans) => {
        const question = questionMap.get(ans.questionId);
        if (!question) {
          return {
            questionId: ans.questionId,
            isCorrect: false,
            userAnswers: ans.selectedOptionIds,
            correctAnswers: [],
            explanation: '',
            pointsEarned: 0,
            maxPoints: 0,
          };
        }

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
          questionId: question._id,
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
        answers: answers.map((a) => ({
          questionId: a.questionId,
          selectedOptionIds: a.selectedOptionIds,
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
