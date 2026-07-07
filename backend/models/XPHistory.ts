import mongoose, { Schema, Document } from 'mongoose';

export interface IXPHistory extends Document {
  userId: string;
  amount: number;
  source: string; // e.g. task_completion, streak_bonus
  timestamp: Date;
}

const XPHistorySchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    source: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

export default mongoose.models.XPHistory || mongoose.model<IXPHistory>('XPHistory', XPHistorySchema);
