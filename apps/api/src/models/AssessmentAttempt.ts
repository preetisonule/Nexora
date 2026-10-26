import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessmentAttemptDocument extends Document {
  learnerId: mongoose.Types.ObjectId;
  assessmentId: mongoose.Types.ObjectId;
  isModuleTest: boolean;
  moduleId?: mongoose.Types.ObjectId;
  answers: {
    questionId: mongoose.Types.ObjectId;
    selectedOptionIds: string[];
  }[];
  score: number;
  passed: boolean;
  attemptNumber: number;
  startedAt: Date;
  submittedAt: Date;
  questionResults: {
    questionId: mongoose.Types.ObjectId;
    isCorrect: boolean;
    userAnswers: string[];
    correctAnswers: string[];
    explanation?: string;
    pointsEarned: number;
    maxPoints: number;
  }[];
}

const assessmentAttemptSchema = new Schema<IAssessmentAttemptDocument>(
  {
    learnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    isModuleTest: { type: Boolean, default: false, index: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', index: true },
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        selectedOptionIds: [{ type: String }],
      },
    ],
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true, index: true },
    attemptNumber: { type: Number, default: 1 },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date, default: Date.now },
    questionResults: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        isCorrect: { type: Boolean, required: true },
        userAnswers: [{ type: String }],
        correctAnswers: [{ type: String }],
        explanation: { type: String },
        pointsEarned: { type: Number, required: true },
        maxPoints: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

assessmentAttemptSchema.index({ learnerId: 1, assessmentId: 1, attemptNumber: -1 });

export const AssessmentAttempt = mongoose.model<IAssessmentAttemptDocument>(
  'AssessmentAttempt',
  assessmentAttemptSchema
);
