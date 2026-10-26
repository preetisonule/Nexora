import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizDocument extends Document {
  moduleId?: mongoose.Types.ObjectId;
  lessonId?: mongoose.Types.ObjectId;
  isModuleTest: boolean;
  title: string;
  instructions: string;
  passingScore: number;
  maxAttempts: number;
  timeLimitMinutes?: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const quizSchema = new Schema<IQuizDocument>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', index: true },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', index: true },
    isModuleTest: { type: Boolean, default: false, index: true },
    title: { type: String, required: true, trim: true },
    instructions: { type: String, default: 'Select the best answers for each question.' },
    passingScore: { type: Number, default: 70 },
    maxAttempts: { type: Number, default: 3 },
    timeLimitMinutes: { type: Number },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model<IQuizDocument>('Quiz', quizSchema);
