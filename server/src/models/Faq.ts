import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import type { FAQSource } from '../types/faq.js';

export interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpfulCount: number;
  source: FAQSource;
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new mongoose.Schema<FaqRecord>(
  {
    id: { type: String, default: () => randomUUID(), unique: true, index: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    tags: { type: [String], default: [] },
    helpfulCount: { type: Number, default: 0, min: 0 },
    source: { type: String, enum: ['existing', 'crowd-sourced'], default: 'crowd-sourced' },
  },
  { timestamps: true, versionKey: false },
);

export const FaqModel = mongoose.models.FAQ ?? mongoose.model<FaqRecord>('FAQ', faqSchema);
