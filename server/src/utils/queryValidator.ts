/**
 * Validation helpers for Query create/input fields.
 * Returns an array of error strings; empty array means valid.
 */
import type { CreateQueryInput } from '../types/query.js';
import { z } from 'zod';
import { zodErrors } from './authValidator.js';

export const queryStatusSchema = z.enum(['open', 'answered', 'resolved', 'verified', 'closed']);

const createQuerySchema = z.object({
  title: z.string().trim().min(10, 'title must be at least 10 characters long').max(140),
  description: z.string().trim().min(20, 'description must be at least 20 characters long').max(4000),
  category: z.string().trim().min(1, 'category is required and cannot be empty').max(80),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).optional(),
});

export function validateCreateQueryInput(
  input: Partial<CreateQueryInput>,
): string[] {
  const result = createQuerySchema.safeParse(input);
  return result.success ? [] : [zodErrors(result.error)];
}

/** Returns true when the given ID looks like a non-empty string. */
export function isValidQueryId(id: unknown): id is string {
  return typeof id === 'string' && id.trim().length > 0;
}

/** Returns true when userId is a non-empty string. */
export function isValidUserId(userId: unknown): userId is string {
  return typeof userId === 'string' && userId.trim().length > 0;
}
