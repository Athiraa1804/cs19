/**
 * Validation helpers for Query create/input fields.
 * Returns an array of error strings; empty array means valid.
 */
import type { CreateQueryInput } from '../types/query.js';

export function validateCreateQueryInput(
  input: Partial<CreateQueryInput>,
): string[] {
  const errors: string[] = [];

  if (!input.title || input.title.trim().length === 0) {
    errors.push('title is required and cannot be empty');
  } else if (input.title.trim().length < 10) {
    errors.push('title must be at least 10 characters long');
  }

  if (!input.description || input.description.trim().length === 0) {
    errors.push('description is required and cannot be empty');
  } else if (input.description.trim().length < 20) {
    errors.push('description must be at least 20 characters long');
  }

  if (!input.category || input.category.trim().length === 0) {
    errors.push('category is required and cannot be empty');
  }

  if (input.tags !== undefined && !Array.isArray(input.tags)) {
    errors.push('tags must be an array of strings');
  }

  return errors;
}

/** Returns true when the given ID looks like a non-empty string. */
export function isValidQueryId(id: unknown): id is string {
  return typeof id === 'string' && id.trim().length > 0;
}

/** Returns true when userId is a non-empty string. */
export function isValidUserId(userId: unknown): userId is string {
  return typeof userId === 'string' && userId.trim().length > 0;
}