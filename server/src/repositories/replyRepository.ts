/**
 * Reply Repository — in-memory data access layer.
 * In future this will be replaced by real database calls.
 */
import type { Reply, CreateReplyInput } from '../types/reply.js';
import { seedReplies } from '../data/reply.data.js';

class ReplyRepository {
  /** All replies (seed + runtime-added). Mutable array. */
  private replies: Reply[] = [...seedReplies];

  /**
   * Returns all replies for a given query, sorted oldest-first (chronological order).
   */
  findByQueryId(queryId: string): Reply[] {
    return this.replies
      .filter((r) => r.queryId === queryId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  /**
   * Returns a single reply by id, or undefined if not found.
   */
  findById(id: string): Reply | undefined {
    return this.replies.find((r) => r.id === id);
  }

  /** Adds a new reply and returns it. */
  create(input: CreateReplyInput & { queryId: string }): Reply {
    const reply: Reply = {
      id: `r-${Date.now()}`,
      queryId: input.queryId,
      body: input.body.trim(),
      authorName: input.authorName.trim(),
      authorRole: input.authorRole,
      createdAt: new Date().toISOString(),
      isVerified: false,
    };
    this.replies.push(reply);
    return reply;
  }
}

// Singleton — shared across the whole server process
export const replyRepository = new ReplyRepository();