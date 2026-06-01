// ============================================================
// FAQ domain types — mirrors ENGINEERING_STANDARDS.md exactly
// ============================================================

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

// Search params for the service layer
export interface GetFaqsParams {
  search?: string;
  category?: string;
}