import type { Reply, CreateReplyInput } from '../types/reply.js';
import { QueryModel } from '../models/Query.js';
import { ReplyModel } from '../models/Reply.js';
import { mapReply } from './mappers.js';

class ReplyRepository {
  /**
   * Returns all replies for a given query, sorted oldest-first (chronological order).
   */
  async findByQueryId(queryId: string): Promise<Reply[]> {
    const replies = await ReplyModel.find({ queryId }).sort({ createdAt: 1 });
    return replies.map((reply) => mapReply(reply.toObject()));
  }

  /**
   * Returns a single reply by id, or undefined if not found.
   */
  async findById(id: string): Promise<Reply | undefined> {
    const reply = await ReplyModel.findOne({ id });
    return reply ? mapReply(reply.toObject()) : undefined;
  }

  /** Adds a new reply and returns it. */
  async create(input: CreateReplyInput & { queryId: string; authorId: string }): Promise<Reply> {
    const reply = await ReplyModel.create({
      queryId: input.queryId,
      authorId: input.authorId,
      body: input.body.trim(),
      authorName: input.authorName.trim(),
      authorRole: input.authorRole,
    });
    await QueryModel.findOneAndUpdate(
      { id: input.queryId },
      {
        latestReplyPreview: input.body.trim().slice(0, 160),
        ...(input.authorRole === 'admin' ? { status: 'answered' } : {}),
      },
    );
    return mapReply(reply.toObject());
  }

  async update(reply: Reply): Promise<Reply> {
    const updated = await ReplyModel.findOneAndUpdate(
      { id: reply.id },
      {
        body: reply.body,
        authorName: reply.authorName,
        authorRole: reply.authorRole,
        isVerified: reply.isVerified,
      },
      { new: true },
    );
    if (!updated) throw new Error(`Reply with id "${reply.id}" not found`);
    return mapReply(updated.toObject());
  }
}

// Singleton — shared across the whole server process
export const replyRepository = new ReplyRepository();
