import mongoose, { Document, Schema } from 'mongoose';

export interface ITestCaseDocument extends Document {
  assignmentId: mongoose.Types.ObjectId;
  input: string;
  expectedOutput: string;
  hidden: boolean;
  points: number;
  comparisonMode: 'exact' | 'trimmed' | 'regex' | 'case-insensitive';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const testCaseSchema = new Schema<ITestCaseDocument>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
    input: { type: String, default: '' },
    expectedOutput: { type: String, required: true },
    hidden: { type: Boolean, default: false, index: true },
    points: { type: Number, default: 10 },
    comparisonMode: {
      type: String,
      enum: ['exact', 'trimmed', 'regex', 'case-insensitive'],
      default: 'trimmed',
    },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

testCaseSchema.index({ assignmentId: 1, order: 1 });

export const TestCase = mongoose.model<ITestCaseDocument>('TestCase', testCaseSchema);
