import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  text: string;
  type: 'xp' | 'badge' | 'reward' | 'success';
  amount?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    text: { type: String, required: true },
    type: { type: String, enum: ['xp', 'badge', 'reward', 'success'], required: true },
    amount: { type: String },
    read: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
