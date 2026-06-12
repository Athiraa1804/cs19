/**
 * Reply domain types — mirrored from the frontend reply interface.
 */
export type AuthorRole = 'intern' | 'admin';

export interface Reply {
  id: string;
  queryId: string;
  body: string;
  authorName: string;
  authorRole: AuthorRole;
  createdAt: string;
  isVerified: boolean;
}

/** Fields required to create a reply via POST /api/queries/:queryId/replies */
export interface CreateReplyInput {
  body: string;
  authorName: string;
  authorRole: AuthorRole;
  authorId?: string;
}
