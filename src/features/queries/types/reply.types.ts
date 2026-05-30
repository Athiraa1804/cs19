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

export interface ReplyCreateInput {
  queryId: string;
  body: string;
  authorName: string;
  authorRole: AuthorRole;
}