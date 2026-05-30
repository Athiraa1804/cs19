import type { ApiResponse } from '../../../shared/types/apiResponse';
import type { Query, QueryCreateInput } from '../types/query.types';
import { mockQueries } from '../mocks/query.mock';

// In-memory store for newly created queries during session
const createdQueries: Query[] = [];

let idCounter = 100;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const queryService = {
  async getAll(): Promise<ApiResponse<Query[]>> {
    await delay(400);
    return { success: true, data: [...mockQueries, ...createdQueries] };
  },

  async getById(id: string): Promise<ApiResponse<Query>> {
    await delay(300);
    const all = [...mockQueries, ...createdQueries];
    const found = all.find((q) => q.id === id);
    if (!found) return { success: false, error: 'Query not found' };
    return { success: true, data: found };
  },

  async getByUser(userId: string): Promise<ApiResponse<Query[]>> {
    await delay(400);
    const all = [...mockQueries, ...createdQueries];
    return { success: true, data: all.filter((q) => q.createdBy === userId) };
  },

  async create(input: QueryCreateInput): Promise<ApiResponse<Query>> {
    await delay(800);
    const now = new Date().toISOString();
    const newQuery: Query = {
      id: `q-${++idCounter}`,
      ...input,
      status: 'open',
      createdAt: now,
      updatedAt: now,
    };
    createdQueries.push(newQuery);
    return { success: true, data: newQuery };
  },
};