import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollmentDocument extends Document {
  learnerId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  status: 'active' | 'completed' | 'dropped';
  enrolledAt: Date;
  lastActivityAt: Date;
  completedAt?: Date;
}

const enrollmentSchema = new Schema<IEnrollmentDocument>(
  {
    learnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    status: {
      type: String,
      enum: ['active', 'completed', 'dropped'],
      default: 'active',
      index: true,
    },
    enrolledAt: { type: Date, default: Date.now },
    lastActivityAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

enrollmentSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });

export const Enrollment = mongoose.model<IEnrollmentDocument>('Enrollment', enrollmentSchema);
