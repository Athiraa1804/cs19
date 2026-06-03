/**
 * Validation helpers for Reply input fields.
 * Returns an array of error strings; empty array means valid.
 */
import type { AuthorRole } from '../types/reply.js';

export function validateCreateReplyInput(input: Partial<{ body: string; authorName: string; authorRole: string }>): string[] {
  const errors: string[] = [];

  if (!input.authorName || input.authorName.trim().length === 0) {
    errors.push('authorName is required');
  }

  if (!input.body || input.body.trim().length === 0) {
    errors.push('body is required');
  } else if (input.body.trim().length < 5) {
    errors.push('body must be at least 5 characters long');
  }

  const validRoles: AuthorRole[] = ['intern', 'admin'];
  if (!input.authorRole || !validRoles.includes(input.authorRole as AuthorRole)) {
    errors.push('authorRole must be "intern" or "admin"');
  }

  return errors;
}

/** Returns true when queryId looks valid. */
export function isValidQueryId(id: unknown): id is string {
  return typeof id === 'string' && id.trim().length > 0;
}

/** Returns true when replyId looks valid. */
export function isValidReplyId(id: unknown): id is string {
  return typeof id === 'string' && id.trim().length > 0;
}