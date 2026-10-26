import mongoose, { Document, Schema } from 'mongoose';

export interface ICourseDocument extends Document {
  title: string;
  slug: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  prerequisites: string[];
  learningObjectives: string[];
  estimatedDuration: string;
  published: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourseDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    prerequisites: [{ type: String }],
    learningObjectives: [{ type: String }],
    estimatedDuration: { type: String, default: '40 hours' },
    published: { type: Boolean, default: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourseDocument>('Course', courseSchema);
