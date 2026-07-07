import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  code: string;
  managerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    managerId: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema);
