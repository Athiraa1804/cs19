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
  async getQueries(filters: GetQueriesQuery = {}): Promise<ApiResponse<Query[]>> {
    const queries = await queryRepository.findAll(filters);
    return { success: true, data: queries };
  },

  /**
   * GET /api/queries/:id — fetch a single query by id.
   * Returns 404-style error response if not found.
   */
  async getQueryById(id: string): Promise<ApiResponse<Query>> {
    const query = await queryRepository.findById(id);
    if (!query) {
      return { success: false, error: `Query with id "${id}" not found` };
    }
    return { success: true, data: query };
  },

  /**
   * GET /api/users/:userId/queries — fetch all queries for a given user.
   */
  async getQueriesByUserId(userId: string): Promise<ApiResponse<Query[]>> {
    const queries = await queryRepository.findByUserId(userId);
    return { success: true, data: queries };
  },

  /**
   * POST /api/queries — create a new query.
   * The createdBy field is supplied by the authenticated controller.
   * Returns validation errors as 400.
   */
  async createQuery(input: CreateQueryInput, createdBy: string): Promise<ApiResponse<Query>> {
    const errors = validateCreateQueryInput(input);
    if (errors.length > 0) {
      return { success: false, error: errors.join('; ') };
    }

    const query = await queryRepository.create({ ...input, createdBy });
    return { success: true, data: query };
  },

  async updateQueryStatus(id: string, status: Query['status']): Promise<ApiResponse<Query>> {
    const query = await queryRepository.findById(id);
    if (!query) return { success: false, error: `Query with id "${id}" not found` };
    const updated = await queryRepository.update({ ...query, status });
    return { success: true, data: updated };
  },
};
