/**
 * Validation helpers for FAQ create/input fields.
 * Returns an array of error strings; empty array means valid.
 */
import type { CreateFaqInput } from '../types/faq.js';

export function validateCreateFaqInput(
  input: Partial<CreateFaqInput>,
): string[] {
  const errors: string[] = [];

  if (!input.question || input.question.trim().length === 0) {
    errors.push('question is required and cannot be empty');
  } else if (input.question.trim().length < 10) {
    errors.push('question must be at least 10 characters long');
  }

  if (!input.answer || input.answer.trim().length === 0) {
    errors.push('answer is required and cannot be empty');
  } else if (input.answer.trim().length < 20) {
    errors.push('answer must be at least 20 characters long');
  }

  if (!input.category || input.category.trim().length === 0) {
    errors.push('category is required and cannot be empty');
  }

  if (input.tags !== undefined && !Array.isArray(input.tags)) {
    errors.push('tags must be an array of strings');
  }

  return errors;
}

/** Returns true when the given ID looks like a valid FAQ id (non-empty string). */
export function isValidFaqId(id: unknown): id is string {
  return typeof id === 'string' && id.trim().length > 0;
}