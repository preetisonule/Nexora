import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificateDocument extends Document {
  certificateId: string;
  learnerId: mongoose.Types.ObjectId;
  learnerName: string;
  courseId: mongoose.Types.ObjectId;
  courseTitle: string;
  courseLevel: string;
  issueDate: Date;
  status: 'valid' | 'revoked';
  verificationUrl: string;
  verificationToken: string;
  qrCodeDataUrl?: string;
  revokedAt?: Date;
  revocationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema = new Schema<ICertificateDocument>(
  {
    certificateId: { type: String, required: true, unique: true, index: true },
    learnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    learnerName: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    courseTitle: { type: String, required: true },
    courseLevel: { type: String, default: 'Beginner to Intermediate' },
    issueDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['valid', 'revoked'],
      default: 'valid',
      index: true,
    },
    verificationUrl: { type: String, required: true },
    verificationToken: { type: String, required: true, unique: true },
    qrCodeDataUrl: { type: String },
    revokedAt: { type: Date },
    revocationReason: { type: String },
  },
  { timestamps: true }
);

certificateSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });

export const Certificate = mongoose.model<ICertificateDocument>('Certificate', certificateSchema);
