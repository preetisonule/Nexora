import { Response } from 'express';
import mongoose from 'mongoose';
import { Assignment } from '../models/Assignment';
import { TestCase } from '../models/TestCase';
import { Submission } from '../models/Submission';
import { AuditLog } from '../models/AuditLog';
import { GoExecutionService } from '../services/goExecutionService';
import { TestEvaluationService } from '../services/testEvaluationService';
import { ProgressService } from '../services/progressService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class AssignmentController {
  public static async getAssignmentById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      let assignment = null;

      if (mongoose.isValidObjectId(id)) {
        assignment = await Assignment.findById(id);
      } else {
        assignment = (await Assignment.findOne({ slug: id })) || (await Assignment.findOne({ published: true }).sort({ createdAt: 1 }));
      }

      if (!assignment) {
        res.status(404).json({ success: false, error: 'Assignment not found' });
        return;
      }

      const isAdmin = req.user && ['admin', 'superadmin', 'instructor'].includes(req.user.role);

      // Fetch test cases
      const testCases = await TestCase.find({ assignmentId: assignment._id }).sort({ order: 1 });

      const visibleTestCases = testCases
        .filter((tc) => !tc.hidden || isAdmin)
        .map((tc) => ({
          id: tc._id.toString(),
          assignmentId: tc.assignmentId.toString(),
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          hidden: tc.hidden,
          points: tc.points,
          comparisonMode: tc.comparisonMode,
          order: tc.order,
        }));

      // Check user past submission
      let bestSubmission = null;
      if (req.user) {
        bestSubmission = await Submission.findOne({
          learnerId: req.user._id,
          assignmentId: assignment._id,
        }).sort({ score: -1, createdAt: -1 });
      }

      res.json({
        success: true,
        data: {
          id: assignment._id.toString(),
          moduleId: assignment.moduleId.toString(),
          title: assignment.title,
          slug: assignment.slug,
          description: assignment.description,
          difficulty: assignment.difficulty,
          starterCode: assignment.starterCode,
          executionMode: assignment.executionMode,
          examples: assignment.examples,
          constraints: assignment.constraints,
          hints: assignment.hints,
          ...(isAdmin && { referenceSolution: assignment.referenceSolution }),
          timeLimitMs: assignment.timeLimitMs,
          memoryLimitMb: assignment.memoryLimitMb,
          passingScore: assignment.passingScore,
          published: assignment.published,
          visibleTestCases,
          totalTestCasesCount: testCases.length,
          bestSubmission: bestSubmission
            ? {
                id: bestSubmission._id.toString(),
                passed: bestSubmission.passed,
                score: bestSubmission.score,
                passedTests: bestSubmission.passedTests,
                totalTests: bestSubmission.totalTests,
                sourceCode: bestSubmission.sourceCode,
                submittedAt: bestSubmission.submittedAt.toISOString(),
              }
            : null,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async runCode(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { code, stdin } = req.body;

      if (!code) {
        res.status(400).json({ success: false, error: 'Go source code is required' });
        return;
      }

      const result = await GoExecutionService.execute({ code, stdin });
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async submitSolution(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { sourceCode } = req.body;
      const learnerId = req.user?._id;

      if (!learnerId) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
      }

      let assignment = null;
      if (mongoose.isValidObjectId(id)) {
        assignment = await Assignment.findById(id);
      } else {
        assignment = (await Assignment.findOne({ slug: id })) || (await Assignment.findOne({ published: true }).sort({ createdAt: 1 }));
      }

      if (!assignment) {
        res.status(404).json({ success: false, error: 'Assignment not found' });
        return;
      }

      const testCases = await TestCase.find({ assignmentId: assignment._id }).sort({ order: 1 });

      // Run evaluation against all test cases
      const evalResult = await TestEvaluationService.evaluate(
        sourceCode,
        testCases,
        assignment.passingScore
      );

      // Persist submission
      const submission = await Submission.create({
        learnerId,
        assignmentId: assignment._id,
        sourceCode,
        executionStatus: evalResult.executionStatus,
        passedTests: evalResult.passedTests,
        totalTests: evalResult.totalTests,
        score: evalResult.score,
        passed: evalResult.passed,
        testResults: evalResult.testResults,
        submittedAt: new Date(),
        executionMetadata: {
          totalExecutionTimeMs: evalResult.totalExecutionTimeMs,
        },
      });

      // Update module progress if passed
      if (evalResult.passed) {
        await ProgressService.updateModuleProgress(
          learnerId.toString(),
          assignment.moduleId.toString()
        );
      }

      res.status(201).json({
        success: true,
        message: evalResult.passed ? 'Assignment passed!' : 'Submission received. Some test cases failed.',
        data: {
          submissionId: submission._id.toString(),
          score: evalResult.score,
          passed: evalResult.passed,
          passedTests: evalResult.passedTests,
          totalTests: evalResult.totalTests,
          executionStatus: evalResult.executionStatus,
          totalExecutionTimeMs: evalResult.totalExecutionTimeMs,
          testResults: evalResult.learnerTestResults,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getSubmissions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const learnerId = req.user?._id;

      let targetAssignmentId = id;
      if (!mongoose.isValidObjectId(id)) {
        const a = (await Assignment.findOne({ slug: id })) || (await Assignment.findOne({ published: true }));
        if (a) targetAssignmentId = a._id.toString();
      }

      const submissions = await Submission.find({
        assignmentId: targetAssignmentId,
        learnerId,
      })
        .sort({ submittedAt: -1 })
        .limit(20);

      res.json({
        success: true,
        data: submissions.map((s) => ({
          id: s._id.toString(),
          score: s.score,
          passed: s.passed,
          passedTests: s.passedTests,
          totalTests: s.totalTests,
          executionStatus: s.executionStatus,
          submittedAt: s.submittedAt.toISOString(),
        })),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async createAssignment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const assignment = await Assignment.create(req.body);
      res.status(201).json({ success: true, data: assignment });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async updateAssignment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const assignment = await Assignment.findByIdAndUpdate(id, req.body, { new: true });
      if (!assignment) {
        res.status(404).json({ success: false, error: 'Assignment not found' });
        return;
      }
      res.json({ success: true, data: assignment });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async deleteAssignment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await Assignment.findByIdAndDelete(id);
      await TestCase.deleteMany({ assignmentId: id });
      res.json({ success: true, message: 'Assignment deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async addTestCase(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const testCase = await TestCase.create(req.body);
      res.status(201).json({ success: true, data: testCase });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async deleteTestCase(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await TestCase.findByIdAndDelete(id);
      res.json({ success: true, message: 'Test case deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
