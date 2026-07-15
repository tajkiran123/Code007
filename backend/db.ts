import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workquest';

export const connectDB = async () => {
  try {
    // Disable buffering so queries fail fast when disconnected
    mongoose.set('bufferCommands', false);
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGODB_URI);
    console.log('🔌 Connected to MongoDB Atlas via Mongoose successfully.');
  } catch (error) {
    console.warn('⚠️ Mongoose connection warning (offline mode):', error);
  }
};
