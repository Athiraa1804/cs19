import type { Query, GetQueriesQuery, CreateQueryInputFull } from '../types/query.js';
import { QueryModel } from '../models/Query.js';
import { ReplyModel } from '../models/Reply.js';
import { mapQuery } from './mappers.js';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function searchRegex(value: string): RegExp {
  return new RegExp(escapeRegex(value), 'i');
}

async function withReplyCount(query: InstanceType<typeof QueryModel>): Promise<Query> {
  const replyCount = await ReplyModel.countDocuments({ queryId: query.id });
  return mapQuery(query.toObject(), replyCount);
}

class QueryRepository {
  /** Returns all queries, optionally filtered by search text, category, and/or status. */
  async findAll(filters: GetQueriesQuery = {}): Promise<Query[]> {
    const filter: Record<string, unknown> = {};
    if (filters.category) filter.category = new RegExp(`^${escapeRegex(filters.category)}$`, 'i');
    if (filters.status) filter.status = filters.status;
    if (filters.search) {
      const regex = searchRegex(filters.search);
      filter.$or = [{ title: regex }, { description: regex }, { category: regex }, { tags: regex }];
    }

    const queries = await QueryModel.find(filter).sort({ createdAt: -1 });
    return Promise.all(queries.map(withReplyCount));
  }

  /** Returns a single query by id, or undefined if not found. */
  async findById(id: string): Promise<Query | undefined> {
    const query = await QueryModel.findOne({ id });
    return query ? withReplyCount(query) : undefined;
  }

  /**
   * Returns all queries authored by a specific user.
   * Results are sorted newest-first.
   */
  async findByUserId(userId: string): Promise<Query[]> {
    const queries = await QueryModel.find({ createdBy: userId }).sort({ createdAt: -1 });
    return Promise.all(queries.map(withReplyCount));
  }

  /** Adds a new query and returns it. */
  async create(input: CreateQueryInputFull): Promise<Query> {
    const query = await QueryModel.create({
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category.trim(),
      tags: input.tags ?? [],
      createdBy: input.createdBy,
    });
    return mapQuery(query.toObject(), 0);
  }

  async update(query: Query): Promise<Query> {
    const updated = await QueryModel.findOneAndUpdate(
      { id: query.id },
      {
        title: query.title,
        description: query.description,
        category: query.category,
        tags: query.tags,
        status: query.status,
        latestReplyPreview: query.latestReplyPreview,
        matchedFaqIds: query.matchedFaqIds ?? [],
        verifiedReplyId: query.verifiedReplyId,
      },
      { new: true },
    );
    if (!updated) throw new Error(`Query with id "${query.id}" not found`);
    return withReplyCount(updated);
  }
}

// Singleton — shared across the whole server process
export const queryRepository = new QueryRepository();
