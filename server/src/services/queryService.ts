/**
 * Query Service — business logic layer.
 * Coordinates between controller and repository, applies business rules,
 * and returns ApiResponse<T> for all operations.
 */
import type { Query, GetQueriesQuery, CreateQueryInput } from '../types/query.js';
import type { ApiResponse } from '../types/apiResponse.js';
import { queryRepository } from '../repositories/queryRepository.js';
import { validateCreateQueryInput } from '../utils/queryValidator.js';

export const queryService = {
  /**
   * GET /api/queries — list all queries, optionally filtered.
   */
  getQueries(filters: GetQueriesQuery = {}): ApiResponse<Query[]> {
    const queries = queryRepository.findAll(filters);
    return { success: true, data: queries };
  },

  /**
   * GET /api/queries/:id — fetch a single query by id.
   * Returns 404-style error response if not found.
   */
  getQueryById(id: string): ApiResponse<Query> {
    const query = queryRepository.findById(id);
    if (!query) {
      return { success: false, error: `Query with id "${id}" not found` };
    }
    return { success: true, data: query };
  },

  /**
   * GET /api/users/:userId/queries — fetch all queries for a given user.
   */
  getQueriesByUserId(userId: string): ApiResponse<Query[]> {
    const queries = queryRepository.findByUserId(userId);
    return { success: true, data: queries };
  },

  /**
   * POST /api/queries — create a new query.
   * The createdBy field must be supplied by the caller (no real auth in MVP).
   * Returns validation errors as 400.
   */
  createQuery(input: CreateQueryInput, createdBy: string): ApiResponse<Query> {
    const errors = validateCreateQueryInput(input);
    if (errors.length > 0) {
      return { success: false, error: errors.join('; ') };
    }

    const query = queryRepository.create({ ...input, createdBy });
    return { success: true, data: query };
  },
};