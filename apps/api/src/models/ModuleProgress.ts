import mongoose, { Document, Schema } from 'mongoose';

export interface IModuleProgressDocument extends Document {
  learnerId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  unlocked: boolean;
  completed: boolean;
  completedLessonsCount: number;
  totalLessonsCount: number;
  quizzesPassed: boolean;
  assignmentsPassed: boolean;
  moduleTestPassed: boolean;
  moduleTestScore?: number;
  completedAt?: Date;
  updatedAt: Date;
}

const moduleProgressSchema = new Schema<IModuleProgressDocument>(
  {
    learnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    unlocked: { type: Boolean, default: false, index: true },
    completed: { type: Boolean, default: false, index: true },
    completedLessonsCount: { type: Number, default: 0 },
    totalLessonsCount: { type: Number, default: 0 },
    quizzesPassed: { type: Boolean, default: false },
    assignmentsPassed: { type: Boolean, default: false },
    moduleTestPassed: { type: Boolean, default: false },
    moduleTestScore: { type: Number },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

moduleProgressSchema.index({ learnerId: 1, moduleId: 1 }, { unique: true });

export const ModuleProgress = mongoose.model<IModuleProgressDocument>(
  'ModuleProgress',
  moduleProgressSchema
);
