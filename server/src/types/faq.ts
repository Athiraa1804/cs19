/**
 * FAQ domain types — mirrored from the frontend FAQ interface.
 * Every field is required except `tags` (may be empty array).
 */
export type FAQSource = 'existing' | 'crowd-sourced';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpfulCount: number;
  source: FAQSource;
  createdAt: string;
  updatedAt: string;
}

/** Query params accepted by GET /api/faqs */
export interface GetFaqsQuery {
  search?: string;
  category?: string;
}

/** Fields required to create a new FAQ via POST /api/faqs */
export interface CreateFaqInput {
  question: string;
  answer: string;
  category: string;
  tags?: string[];
}