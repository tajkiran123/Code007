import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  date: string; // YYYY-MM-DD
  totalXpGained: number;
  tasksCompletedCount: number;
  activeUsersCount: number;
  createdAt: Date;
}

const AnalyticsSchema: Schema = new Schema(
  {
    date: { type: String, required: true, unique: true },
    totalXpGained: { type: Number, default: 0 },
    tasksCompletedCount: { type: Number, default: 0 },
    activeUsersCount: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
