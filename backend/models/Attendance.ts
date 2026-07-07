import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  userId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'leave';
  createdAt: Date;
}

const AttendanceSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent', 'leave'], default: 'present' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
