import type { QueryFormData } from '../types/query.types';

export interface ValidationErrors {
  title?: string;
  description?: string;
  category?: string;
}

export function validateQueryForm(data: QueryFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  const trimmedTitle = data.title.trim();
  const trimmedDesc = data.description.trim();

  if (!trimmedTitle) {
    errors.title = 'Title is required';
  } else if (trimmedTitle.length < 10) {
    errors.title = 'Title must be at least 10 characters';
  } else if (trimmedTitle.length > 200) {
    errors.title = 'Title must be 200 characters or less';
  }

  if (!trimmedDesc) {
    errors.description = 'Description is required';
  } else if (trimmedDesc.length < 20) {
    errors.description = 'Description must be at least 20 characters';
  } else if (trimmedDesc.length > 2000) {
    errors.description = 'Description must be 2000 characters or less';
  }

  if (!data.category) {
    errors.category = 'Please select a category';
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}