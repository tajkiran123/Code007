import mongoose, { Schema, Document } from 'mongoose';

export interface IPerformanceLog extends Document {
  userId: string;
  score: number; // Quality Score (1-10)
  feedback?: string;
  taskId?: string;
  date: Date;
}

const PerformanceLogSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    score: { type: Number, required: true },
    feedback: { type: String },
    taskId: { type: String },
    date: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

export default mongoose.models.PerformanceLog || mongoose.model<IPerformanceLog>('PerformanceLog', PerformanceLogSchema);
