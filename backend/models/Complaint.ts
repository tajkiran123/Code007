import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaint extends Document {
  userId: string;
  userName: string;
  text: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  text: { type: String, required: true },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);
