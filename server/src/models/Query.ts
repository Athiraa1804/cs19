import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import type { QueryAttachment, QueryStatus } from '../types/query.js';

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
  attachmentUrl?: string;
  attachment?: QueryAttachment;
}

const attachmentSchema = new mongoose.Schema<QueryAttachment>(
  {
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { _id: false },
);

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
    attachmentUrl: String,
    attachment: { type: attachmentSchema, default: undefined },
  },
  { timestamps: true, versionKey: false },
);

export const QueryModel = mongoose.models.Query ?? mongoose.model<QueryRecord>('Query', querySchema);
