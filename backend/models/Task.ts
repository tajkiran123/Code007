import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  xp: number;
  assignedTo: string; // Employee ID
  assignedToName: string;
  assignedBy: string; // Manager ID
  status: 'todo' | 'in_progress' | 'in_review' | 'completed';
  qualityScore?: number;
  feedback?: string;
  estimatedHours: number;
  actualHours?: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'extreme'], default: 'medium' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    dueDate: { type: String, required: true },
    xp: { type: Number, required: true },
    assignedTo: { type: String, required: true, index: true },
    assignedToName: { type: String, required: true },
    assignedBy: { type: String, required: true },
    status: { type: String, enum: ['todo', 'in_progress', 'in_review', 'completed'], default: 'todo' },
    qualityScore: { type: Number },
    feedback: { type: String },
    estimatedHours: { type: Number, default: 4 },
    actualHours: { type: Number },
    commentsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
