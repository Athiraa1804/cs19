/**
 * Query domain types — mirrored from the frontend query interface.
 */
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
  attachmentUrl?: string;
  latestReplyPreview?: string;
  matchedFaqIds?: string[];
  replyCount?: number;
  verifiedReplyId?: string;
}

/** Query params for GET /api/queries */
export interface GetQueriesQuery {
  search?: string;
  category?: string;
  status?: QueryStatus;
 
}

/** Fields required to create a new query via POST /api/queries */
export interface CreateQueryInput {
  title: string;
  description: string;
  category: string;
  tags?: string[];
  attachmentUrl?: string;
}

/** Full input including the caller-supplied user id */
export interface CreateQueryInputFull extends CreateQueryInput {
  createdBy: string;
}