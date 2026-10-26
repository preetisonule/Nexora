import mongoose, { Document, Schema } from 'mongoose';

export interface ILessonProgressDocument extends Document {
  learnerId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  completed: boolean;
  completedAt?: Date;
  timeSpentSeconds: number;
  lastVisitedAt: Date;
}

const lessonProgressSchema = new Schema<ILessonProgressDocument>(
  {
    learnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    completed: { type: Boolean, default: false, index: true },
    completedAt: { type: Date },
    timeSpentSeconds: { type: Number, default: 0 },
    lastVisitedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

lessonProgressSchema.index({ learnerId: 1, lessonId: 1 }, { unique: true });
lessonProgressSchema.index({ learnerId: 1, moduleId: 1 });

export const LessonProgress = mongoose.model<ILessonProgressDocument>('LessonProgress', lessonProgressSchema);
