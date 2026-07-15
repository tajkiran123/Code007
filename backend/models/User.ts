import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'Admin' | 'Manager' | 'Employee';
  department: string;
  employeeId: string;
  phone?: string;
  avatar?: string;
  xp: number;
  level: number;
  rank?: number;
  status: 'active' | 'inactive' | 'on_leave';
  attendance: number; // percentage
  performanceScore: number; // 0-10 scale
  burnoutScore: number; // percentage
  completedTasksCount: number;
  pendingTasksCount: number;
  commitsCount: number;
  location?: string;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  streak: number;
  themeColor: 'cyan' | 'purple' | 'emerald' | 'amber';
  skipsLeft: number;
  streakFreezeActive: boolean;
  salary?: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Manager', 'Employee'], default: 'Employee' },
    department: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true, index: true },
    phone: { type: String },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    rank: { type: Number },
    status: { type: String, enum: ['active', 'inactive', 'on_leave'], default: 'active' },
    attendance: { type: Number, default: 95 },
    performanceScore: { type: Number, default: 8.5 },
    burnoutScore: { type: Number, default: 15 },
    completedTasksCount: { type: Number, default: 0 },
    pendingTasksCount: { type: Number, default: 0 },
    commitsCount: { type: Number, default: 0 },
    location: { type: String, default: 'San Francisco, CA' },
    joinedAt: { type: Date, default: Date.now },
    streak: { type: Number, default: 5 },
    themeColor: { type: String, enum: ['cyan', 'purple', 'emerald', 'amber'], default: 'cyan' },
    skipsLeft: { type: Number, default: 1 },
    streakFreezeActive: { type: Boolean, default: false },
    salary: { type: String, default: '$115,000' }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
