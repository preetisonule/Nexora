import mongoose, { Document, Schema } from 'mongoose';
import { ICodeExample, IKnowledgeCheck } from '@compilo/shared';

export interface ILessonDocument extends Document {
  moduleId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  order: number;
  introduction: string;
  objectives: string[];
  readingContent: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILessonDocument>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    order: { type: Number, required: true, index: true },
    introduction: { type: String, required: true },
    objectives: [{ type: String }],
    readingContent: { type: String, required: true },
    videoReference: { type: String },
    codeExamples: [
      {
        title: { type: String, required: true },
        code: { type: String, required: true },
        expectedOutput: { type: String, required: true },
        explanation: { type: String, required: true },
        commonMistakes: [{ type: String }],
      },
    ],
    commonMistakes: [{ type: String }],
    comparisonWithOtherLanguages: {
      language: { type: String, enum: ['Java', 'Python', 'JavaScript'] },
      differences: { type: String },
    },
    keyTakeaways: [{ type: String }],
    knowledgeCheck: {
      question: { type: String },
      options: [{ type: String }],
      correctOptionIndex: { type: Number },
      explanation: { type: String },
    },
    estimatedDuration: { type: String, default: '30 mins' },
    prerequisites: [{ type: String }],
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

lessonSchema.index({ moduleId: 1, order: 1 });
lessonSchema.index({ moduleId: 1, slug: 1 }, { unique: true });

export const Lesson = mongoose.model<ILessonDocument>('Lesson', lessonSchema);
