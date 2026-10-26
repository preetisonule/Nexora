import mongoose from 'mongoose';
import { config } from './index';

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongodbUri);
    console.log(`[Database] MongoDB connected successfully to ${config.mongodbUri}`);
  } catch (error) {
    console.error('[Database] Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log('[Database] MongoDB disconnected');
};
