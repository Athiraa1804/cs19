import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import type { AuthorRole } from '../types/reply.js';

export interface ReplyRecord {
  id: string;
  queryId: string;
  body: string;
  authorName: string;
  authorRole: AuthorRole;
  authorId: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const replySchema = new mongoose.Schema<ReplyRecord>(
  {
    id: { type: String, default: () => randomUUID(), unique: true, index: true },
    queryId: { type: String, required: true, index: true },
    body: { type: String, required: true, trim: true },
    authorName: { type: String, required: true, trim: true },
    authorRole: { type: String, enum: ['intern', 'admin'], required: true },
    authorId: { type: String, required: true, index: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

export const ReplyModel = mongoose.models.Reply ?? mongoose.model<ReplyRecord>('Reply', replySchema);
