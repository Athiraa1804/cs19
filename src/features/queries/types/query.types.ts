export type QueryStatus = 'open' | 'answered' | 'resolved' | 'verified' | 'closed';

export interface Query {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: QueryStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  latestReplyPreview?: string;
  matchedFaqIds?: string[];
}

export interface QueryFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
}

export interface QueryCreateInput extends QueryFormData {
  createdBy: string;
}