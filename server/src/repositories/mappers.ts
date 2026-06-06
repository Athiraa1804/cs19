import type { FaqRecord } from '../models/Faq.js';
import type { QueryRecord } from '../models/Query.js';
import type { ReplyRecord } from '../models/Reply.js';
import type { UserRecord } from '../models/User.js';
import type { FAQ } from '../types/faq.js';
import type { Query } from '../types/query.js';
import type { Reply } from '../types/reply.js';
import type { PublicUser, User } from '../types/user.js';

export function mapUser(user: UserRecord): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    passwordHash: user.passwordHash,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function mapPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export function mapQuery(query: QueryRecord, replyCount?: number): Query {
  return {
    id: query.id,
    title: query.title,
    description: query.description,
    category: query.category,
    tags: query.tags,
    status: query.status,
    createdAt: query.createdAt.toISOString(),
    updatedAt: query.updatedAt.toISOString(),
    createdBy: query.createdBy,
    latestReplyPreview: query.latestReplyPreview,
    matchedFaqIds: query.matchedFaqIds,
    verifiedReplyId: query.verifiedReplyId,
    replyCount,
  };
}

export function mapReply(reply: ReplyRecord): Reply {
  return {
    id: reply.id,
    queryId: reply.queryId,
    body: reply.body,
    authorName: reply.authorName,
    authorRole: reply.authorRole,
    createdAt: reply.createdAt.toISOString(),
    isVerified: reply.isVerified,
  };
}

export function mapFaq(faq: FaqRecord): FAQ {
  return {
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    tags: faq.tags,
    helpfulCount: faq.helpfulCount,
    source: faq.source,
    createdAt: faq.createdAt.toISOString(),
    updatedAt: faq.updatedAt.toISOString(),
  };
}
