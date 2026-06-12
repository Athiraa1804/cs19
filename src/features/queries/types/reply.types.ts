// Reply author roles control presentation and admin-only actions in the discussion UI.
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
  // The backend derives author name, role, and user id from the authenticated session.
  body: string;
}
