/**
 * Validation helpers for FAQ create/input fields.
 * Returns an array of error strings; empty array means valid.
 */
import type { CreateFaqInput } from '../types/faq.js';
import { z } from 'zod';
import { zodErrors } from './authValidator.js';

const createFaqSchema = z.object({
  question: z.string().trim().min(10, 'question must be at least 10 characters long').max(300),
  answer: z.string().trim().min(20, 'answer must be at least 20 characters long').max(6000),
  category: z.string().trim().min(1, 'category is required and cannot be empty').max(80),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).optional(),
});

export function validateCreateFaqInput(
  input: Partial<CreateFaqInput>,
): string[] {
  const result = createFaqSchema.safeParse(input);
  return result.success ? [] : [zodErrors(result.error)];
}

/** Returns true when the given ID looks like a valid FAQ id (non-empty string). */
export function isValidFaqId(id: unknown): id is string {
  return typeof id === 'string' && id.trim().length > 0;
}
