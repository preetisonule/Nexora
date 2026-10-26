import mongoose, { Document, Schema } from 'mongoose';

export interface IFinalProjectSubmissionDocument extends Document {
  learnerId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  repositoryUrl?: string;
  sourceCodeArchive?: string;
  documentationText: string;
  testInstructions: string;
  status: 'pending' | 'approved' | 'rejected';
  score?: number;
  reviewNotes?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
}

const finalProjectSubmissionSchema = new Schema<IFinalProjectSubmissionDocument>(
  {
    learnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    repositoryUrl: { type: String, trim: true },
    sourceCodeArchive: { type: String },
    documentationText: { type: String, required: true },
    testInstructions: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    score: { type: Number },
    reviewNotes: { type: String },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

finalProjectSubmissionSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });

export const FinalProjectSubmission = mongoose.model<IFinalProjectSubmissionDocument>(
  'FinalProjectSubmission',
  finalProjectSubmissionSchema
);
