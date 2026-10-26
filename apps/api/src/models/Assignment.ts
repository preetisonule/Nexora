import mongoose, { Document, Schema } from 'mongoose';
import { AssignmentDifficulty, ExecutionMode } from '@compilo/shared';

export interface IAssignmentDocument extends Document {
  moduleId: mongoose.Types.ObjectId;
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
  hints: string[];
  referenceSolution?: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  passingScore: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignmentDocument>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Challenge'],
      default: 'Easy',
      index: true,
    },
    starterCode: { type: String, required: true },
    executionMode: {
      type: String,
      enum: ['stdio', 'function-harness'],
      default: 'stdio',
    },
    examples: [
      {
        input: { type: String, default: '' },
        output: { type: String, required: true },
        explanation: { type: String },
      },
    ],
    constraints: [{ type: String }],
    hints: [{ type: String }],
    referenceSolution: { type: String },
    timeLimitMs: { type: Number, default: 5000 },
    memoryLimitMb: { type: Number, default: 128 },
    passingScore: { type: Number, default: 100 },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

assignmentSchema.index({ moduleId: 1, slug: 1 }, { unique: true });

export const Assignment = mongoose.model<IAssignmentDocument>('Assignment', assignmentSchema);
