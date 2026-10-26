import { z } from 'zod';

// ==========================================
// Roles & User
// ==========================================
export type UserRole = 'learner' | 'instructor' | 'admin' | 'superadmin';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ==========================================
// Course, Module, Lesson
// ==========================================
export interface ICourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  prerequisites: string[];
  learningObjectives: string[];
  estimatedDuration: string;
  published: boolean;
  moduleCount?: number;
  lessonCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IModuleCompletionRules {
  requireAllLessons: boolean;
  requireQuizzesPass: boolean;
  requireAssignmentsPass: boolean;
  requireModuleTestPass: boolean;
  passingScorePercent: number; // e.g. 70
}

export interface IModule {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  order: number;
  description: string;
  objectives: string[];
  prerequisiteModuleIds: string[];
  estimatedDuration: string;
  lessonIds?: string[];
  completionRules: IModuleCompletionRules;
  published: boolean;
  unlocked?: boolean;
  completed?: boolean;
  completedLessonsCount?: number;
  totalLessonsCount?: number;
  lessons?: ILessonSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface ICodeExample {
  title: string;
  code: string;
  expectedOutput: string;
  explanation: string;
  commonMistakes?: string[];
}

export interface IKnowledgeCheck {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface ILessonSummary {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  order: number;
  estimatedDuration: string;
  published: boolean;
  isCompleted?: boolean;
}

export interface ILesson {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  order: number;
  introduction: string;
  objectives: string[];
  readingContent: string; // Markdown or rich structured text
  videoReference?: string;
  codeExamples: ICodeExample[];
  commonMistakes: string[];
  comparisonWithOtherLanguages?: {
    language: 'Java' | 'Python' | 'JavaScript';
    differences: string;
  };
  keyTakeaways: string[];
  knowledgeCheck?: IKnowledgeCheck;
  estimatedDuration: string;
  prerequisites?: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Quizzes & Assessments
// ==========================================
export type QuestionType = 'single-select' | 'multiple-select' | 'true-false' | 'code-output';

export interface IQuestionOption {
  id: string;
  text: string;
}

export interface IQuestion {
  id: string;
  quizId: string;
  type: QuestionType;
  prompt: string;
  codeSnippet?: string;
  options: IQuestionOption[];
  points: number;
  order: number;
  // Answer fields (hidden from learners before submission)
  correctAnswers?: string[]; // IDs of correct options or string answer
  explanation?: string;
}

export interface IQuiz {
  id: string;
  moduleId?: string;
  lessonId?: string;
  isModuleTest?: boolean;
  title: string;
  instructions: string;
  questionCount?: number;
  passingScore: number; // percentage, e.g. 70
  maxAttempts: number;
  timeLimitMinutes?: number;
  published: boolean;
  questions?: IQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface IAssessmentAttempt {
  id: string;
  learnerId: string;
  assessmentId: string;
  isModuleTest: boolean;
  moduleId?: string;
  answers: {
    questionId: string;
    selectedOptionIds: string[];
  }[];
  score: number;
  passed: boolean;
  attemptNumber: number;
  startedAt: string;
  submittedAt: string;
  questionResults?: {
    questionId: string;
    isCorrect: boolean;
    userAnswers: string[];
    correctAnswers: string[];
    explanation?: string;
    pointsEarned: number;
    maxPoints: number;
  }[];
}

// ==========================================
// Assignments & Compiler
// ==========================================
export type AssignmentDifficulty = 'Easy' | 'Medium' | 'Challenge';
export type ExecutionMode = 'stdio' | 'function-harness';

export interface ITestCase {
  id: string;
  assignmentId: string;
  input: string;
  expectedOutput: string;
  hidden: boolean;
  points: number;
  comparisonMode: 'exact' | 'trimmed' | 'regex' | 'case-insensitive';
  order: number;
}

export interface IAssignment {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  description: string;
  difficulty: AssignmentDifficulty;
  starterCode: string;
  executionMode: ExecutionMode;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  hints?: string[];
  referenceSolution?: string; // Private
  timeLimitMs: number;
  memoryLimitMb: number;
  passingScore: number; // e.g. 100% or 80%
  published: boolean;
  visibleTestCases?: ITestCase[];
  totalTestCasesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ITestResult {
  testCaseId: string;
  passed: boolean;
  hidden: boolean;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  executionTimeMs?: number;
  error?: string;
}

export interface ISubmission {
  id: string;
  learnerId: string;
  assignmentId: string;
  sourceCode: string;
  executionStatus: 'success' | 'compile-error' | 'runtime-error' | 'timeout' | 'output-limit';
  passedTests: number;
  totalTests: number;
  score: number; // percentage
  passed: boolean;
  testResults: ITestResult[];
  submittedAt: string;
  executionMetadata?: {
    totalExecutionTimeMs: number;
  };
}

export interface ICodeRunRequest {
  code: string;
  stdin?: string;
  assignmentId?: string;
}

export interface ICodeRunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  compileError?: string;
  runtimeError?: string;
  timedOut: boolean;
}

// ==========================================
// Final Project
// ==========================================
export interface IFinalProjectSubmission {
  id: string;
  learnerId: string;
  courseId: string;
  repositoryUrl?: string;
  sourceCodeArchive?: string;
  documentationText: string;
  testInstructions: string;
  status: 'pending' | 'approved' | 'rejected';
  score?: number;
  reviewNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// ==========================================
// Progress & Certificates
// ==========================================
export interface ILessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

export interface IModuleProgress {
  moduleId: string;
  unlocked: boolean;
  completed: boolean;
  completedLessonsCount: number;
  totalLessonsCount: number;
  quizzesPassed: boolean;
  assignmentsPassed: boolean;
  moduleTestPassed: boolean;
  moduleTestScore?: number;
  completedAt?: string;
}

export interface ICourseProgress {
  courseId: string;
  enrolled: boolean;
  overallPercentage: number;
  completedModulesCount: number;
  totalModulesCount: number;
  currentModuleId?: string;
  currentLessonId?: string;
  modulesProgress: IModuleProgress[];
  certificateEligible: boolean;
  certificateId?: string;
  courseTitle?: string;
  courseSlug?: string;
}

export interface ICertificate {
  id: string;
  certificateId: string; // e.g. COMPILO-GO-2026-XXXXX
  learnerId: string;
  learnerName: string;
  courseId: string;
  courseTitle: string;
  courseLevel: string;
  issueDate: string;
  status: 'valid' | 'revoked';
  verificationUrl: string;
  verificationToken: string;
  revokedAt?: string;
  revocationReason?: string;
}

// ==========================================
// Admin Analytics & Audit Logs
// ==========================================
export interface IAdminMetrics {
  totalLearners: number;
  courseEnrollments: number;
  activeLearners: number;
  courseCompletionRate: number;
  averageAssessmentScore: number;
  totalSubmissions: number;
  assignmentPassRate: number;
  certificatesIssued: number;
  recentLearners: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    status: string;
  }[];
  recentSubmissions: {
    id: string;
    learnerName: string;
    assignmentTitle: string;
    passed: boolean;
    score: number;
    submittedAt: string;
  }[];
  moduleCompletionStats: {
    moduleNumber: number;
    moduleTitle: string;
    completedCount: number;
  }[];
  enrollmentTrend: {
    date: string;
    count: number;
  }[];
}

export interface IAuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  resourceType: string;
  resourceId: string;
  changeSummary: string;
  createdAt: string;
}

// ==========================================
// API Response Wrappers
// ==========================================
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
