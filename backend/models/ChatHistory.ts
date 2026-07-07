import mongoose, { Schema, Document } from 'mongoose';

export interface IChatHistory extends Document {
  userId: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const ChatHistorySchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    sender: { type: String, enum: ['user', 'ai'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

export default mongoose.models.ChatHistory || mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);
