import mongoose, { Document, Schema } from 'mongoose';
import { ITestResult } from '@compilo/shared';

export interface ISubmissionDocument extends Document {
  learnerId: mongoose.Types.ObjectId;
  assignmentId: mongoose.Types.ObjectId;
  sourceCode: string;
  executionStatus: 'success' | 'compile-error' | 'runtime-error' | 'timeout' | 'output-limit';
  passedTests: number;
  totalTests: number;
  score: number;
  passed: boolean;
  testResults: ITestResult[];
  submittedAt: Date;
  executionMetadata?: {
    totalExecutionTimeMs: number;
  };
}

const submissionSchema = new Schema<ISubmissionDocument>(
  {
    learnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
    sourceCode: { type: String, required: true },
    executionStatus: {
      type: String,
      enum: ['success', 'compile-error', 'runtime-error', 'timeout', 'output-limit'],
      default: 'success',
    },
    passedTests: { type: Number, required: true },
    totalTests: { type: Number, required: true },
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true, index: true },
    testResults: [
      {
        testCaseId: { type: String, required: true },
        passed: { type: Boolean, required: true },
        hidden: { type: Boolean, default: false },
        input: { type: String },
        expectedOutput: { type: String },
        actualOutput: { type: String },
        executionTimeMs: { type: Number },
        error: { type: String },
      },
    ],
    submittedAt: { type: Date, default: Date.now, index: true },
    executionMetadata: {
      totalExecutionTimeMs: { type: Number },
    },
  },
  { timestamps: true }
);

submissionSchema.index({ learnerId: 1, assignmentId: 1, createdAt: -1 });

export const Submission = mongoose.model<ISubmissionDocument>('Submission', submissionSchema);
