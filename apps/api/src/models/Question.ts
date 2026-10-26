import mongoose, { Document, Schema } from 'mongoose';
import { QuestionType } from '@compilo/shared';

export interface IQuestionDocument extends Document {
  quizId: mongoose.Types.ObjectId;
  type: QuestionType;
  prompt: string;
  codeSnippet?: string;
  options: { id: string; text: string }[];
  correctAnswers: string[];
  explanation: string;
  points: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestionDocument>(
  {
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    type: {
      type: String,
      enum: ['single-select', 'multiple-select', 'true-false', 'code-output'],
      required: true,
    },
    prompt: { type: String, required: true },
    codeSnippet: { type: String },
    options: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
      },
    ],
    correctAnswers: [{ type: String, required: true }],
    explanation: { type: String, required: true },
    points: { type: Number, default: 10 },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

questionSchema.index({ quizId: 1, order: 1 });

export const Question = mongoose.model<IQuestionDocument>('Question', questionSchema);
