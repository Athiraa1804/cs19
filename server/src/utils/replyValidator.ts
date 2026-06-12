/**
 * Validation helpers for Reply input fields.
 * Returns an array of error strings; empty array means valid.
 */
import { z } from 'zod';
import { zodErrors } from './authValidator.js';

const createReplySchema = z.object({
  body: z.string().trim().min(5, 'body must be at least 5 characters long').max(2000),
  authorName: z.string().trim().min(1, 'authorName is required').max(80),
  authorRole: z.enum(['intern', 'admin']),
});

export function validateCreateReplyInput(input: Partial<{ body: string; authorName: string; authorRole: string }>): string[] {
  const result = createReplySchema.safeParse(input);
  return result.success ? [] : [zodErrors(result.error)];
}

/** Returns true when queryId looks valid. */
export function isValidQueryId(id: unknown): id is string {
  return typeof id === 'string' && id.trim().length > 0;
}

/** Returns true when replyId looks valid. */
export function isValidReplyId(id: unknown): id is string {
  return typeof id === 'string' && id.trim().length > 0;
}
