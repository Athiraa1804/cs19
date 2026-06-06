import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import type { UserRole } from '../types/user.js';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserRecord>(
  {
    id: { type: String, default: () => randomUUID(), unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    role: { type: String, enum: ['intern', 'admin'], required: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const UserModel = mongoose.models.User ?? mongoose.model<UserRecord>('User', userSchema);
