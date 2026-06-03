/**
 * Query Repository — in-memory data access layer.
 * In future this will be replaced by real database calls.
 */
import type { Query, GetQueriesQuery, CreateQueryInputFull } from '../types/query.js';
import { seedQueries } from '../data/query.data.js';

class QueryRepository {
  /** All queries (seed + runtime-added). Mutable array. */
  private queries: Query[] = [...seedQueries];

  /** Returns all queries, optionally filtered by search text, category, and/or status. */
  findAll(filters: GetQueriesQuery = {}): Query[] {
    let results = this.queries;

    if (filters.category && filters.category.trim().length > 0) {
      results = results.filter(
        (q) => q.category.toLowerCase() === filters.category!.toLowerCase(),
      );
    }

    if (filters.status) {
      results = results.filter((q) => q.status === filters.status);
    }

    if (filters.search && filters.search.trim().length > 0) {
      const words = filters.search
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 1);

      results = results
        .map((query) => {
          const haystack = `${query.title} ${query.description} ${query.tags.join(' ')} ${query.category}`.toLowerCase();
          const score = words.filter((w) => haystack.includes(w)).length;
          return { query, score };
        })
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((s) => s.query);
    }

    return results;
  }

  /** Returns a single query by id, or undefined if not found. */
  findById(id: string): Query | undefined {
    return this.queries.find((q) => q.id === id);
  }

  /**
   * Returns all queries authored by a specific user.
   * Results are sorted newest-first.
   */
  findByUserId(userId: string): Query[] {
    return this.queries
      .filter((q) => q.createdBy === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /** Adds a new query and returns it. */
  create(input: CreateQueryInputFull): Query {
    const now = new Date().toISOString();
    const query: Query = {
      id: `q-${Date.now()}`,
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category.trim(),
      tags: input.tags ?? [],
      status: 'open',
      createdBy: input.createdBy,
      createdAt: now,
      updatedAt: now,
      replyCount: 0,
    };
    this.queries.push(query);
    return query;
  }
}

// Singleton — shared across the whole server process
export const queryRepository = new QueryRepository();