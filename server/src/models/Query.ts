import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import type { QueryStatus } from '../types/query.js';

export interface QueryRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: QueryStatus;
  createdBy: string;
  latestReplyPreview?: string;
  matchedFaqIds: string[];
  verifiedReplyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const querySchema = new mongoose.Schema<QueryRecord>(
  {
    id: { type: String, default: () => randomUUID(), unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['open', 'answered', 'resolved', 'verified', 'closed'],
      default: 'open',
      index: true,
    },
    createdBy: { type: String, required: true, index: true },
    latestReplyPreview: String,
    matchedFaqIds: { type: [String], default: [] },
    verifiedReplyId: String,
  },
  { timestamps: true, versionKey: false },
);

export const QueryModel = mongoose.models.Query ?? mongoose.model<QueryRecord>('Query', querySchema);
