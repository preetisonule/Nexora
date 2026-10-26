import mongoose, { Document, Schema } from 'mongoose';
import { IModuleCompletionRules } from '@compilo/shared';

export interface IModuleDocument extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  order: number;
  description: string;
  objectives: string[];
  prerequisiteModuleIds: mongoose.Types.ObjectId[];
  estimatedDuration: string;
  completionRules: IModuleCompletionRules;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const moduleSchema = new Schema<IModuleDocument>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    order: { type: Number, required: true, index: true },
    description: { type: String, required: true },
    objectives: [{ type: String }],
    prerequisiteModuleIds: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
    estimatedDuration: { type: String, default: '4 hours' },
    completionRules: {
      requireAllLessons: { type: Boolean, default: true },
      requireQuizzesPass: { type: Boolean, default: true },
      requireAssignmentsPass: { type: Boolean, default: true },
      requireModuleTestPass: { type: Boolean, default: true },
      passingScorePercent: { type: Number, default: 70 },
    },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

moduleSchema.index({ courseId: 1, order: 1 });
moduleSchema.index({ courseId: 1, slug: 1 }, { unique: true });

export const Module = mongoose.model<IModuleDocument>('Module', moduleSchema);
