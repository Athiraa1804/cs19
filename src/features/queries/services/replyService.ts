import type { ApiResponse } from '../../../shared/types/apiResponse';
import type { Reply, ReplyCreateInput } from '../types/reply.types';
import { getRepliesForQuery, addSessionReply } from '../mocks/reply.mock';

let idCounter = 100;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const replyService = {
  async getByQueryId(queryId: string): Promise<ApiResponse<Reply[]>> {
    await delay(400);
    const replies = getRepliesForQuery(queryId);
    return { success: true, data: replies };
  },

  async create(input: ReplyCreateInput): Promise<ApiResponse<Reply>> {
    await delay(600);
    const newReply: Reply = {
      id: `r-${++idCounter}`,
      ...input,
      createdAt: new Date().toISOString(),
      isVerified: false,
    };
    addSessionReply(newReply);
    return { success: true, data: newReply };
  },
};