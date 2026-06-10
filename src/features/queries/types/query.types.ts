
// Query types are shared by pages, components, and services so the UI stays aligned
// with the backend response shape.
export type QueryStatus = 'open' | 'answered' | 'resolved' | 'verified' | 'closed';

export interface QueryAttachment {
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
}

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
  attachmentUrl?: string;
  latestReplyPreview?: string;
  matchedFaqIds?: string[];
  replyCount?: number;
  verifiedReplyId?: string;
  attachment?: QueryAttachment;
}
// This is the editable form payload. Server-managed fields such as status,
// creator, timestamps, and reply count are intentionally excluded.
export interface QueryFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  attachment?: File;
}

export type QueryCreateInput = QueryFormData;
