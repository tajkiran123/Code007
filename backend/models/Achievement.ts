import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  userId: string;
  title: string;
  description: string;
  unlockedAt: Date;
}

const AchievementSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

export default mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);
