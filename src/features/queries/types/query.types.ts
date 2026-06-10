
// Query types are shared by pages, components, and services so the UI stays aligned
// with the backend response shape.
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
  attachmentUrl?: string;   // ← must exist
  latestReplyPreview?: string;
  matchedFaqIds?: string[];
  replyCount?: number;
  verifiedReplyId?: string;
}
// This is the editable form payload. Server-managed fields such as status,
// creator, timestamps, and reply count are intentionally excluded.
export interface QueryFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  attachment?: File | null;
}

export type QueryCreateInput = QueryFormData;
