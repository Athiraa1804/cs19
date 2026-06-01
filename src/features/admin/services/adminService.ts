import type { ApiResponse } from '../../../shared/types/apiResponse';
import type { Reply } from '../../queries/types/reply.types';
import type { FAQ } from '../../faq/types/faq.types';
import { addConvertedFaq } from '../../faq/mocks/faq.mock';
import { getRepliesForQuery } from '../../queries/mocks/reply.mock';
import { mockQueries } from '../../queries/mocks/query.mock';

const verifiedReplyIds = new Set<string>();

let faqIdCounter = 100;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function findReplyById(replyId: string): Reply | undefined {
  for (const query of mockQueries) {
    const replies = getRepliesForQuery(query.id);
    const found = replies.find((r) => r.id === replyId);
    if (found) return found;
  }
  return undefined;
}

export const adminService = {
  async verifyReply(replyId: string): Promise<ApiResponse<{ replyId: string }>> {
    await delay(500);
    const targetReply = findReplyById(replyId);
    if (!targetReply) return { success: false, error: 'Reply not found' };
    verifiedReplyIds.add(replyId);
    return { success: true, data: { replyId } };
  },

  async convertReplyToFaq(
    replyId: string,
    faqQuestion: string
  ): Promise<ApiResponse<FAQ>> {
    await delay(700);

    if (!verifiedReplyIds.has(replyId)) {
      return { success: false, error: 'Reply must be verified before converting to FAQ' };
    }

    const targetReply = findReplyById(replyId);
    if (!targetReply) return { success: false, error: 'Reply not found' };

    const newFaq: FAQ = {
      id: `faq-cs-${++faqIdCounter}`,
      question: faqQuestion,
      answer: targetReply.body,
      category: 'Crowd-Sourced',
      tags: ['crowd-sourced', 'verified'],
      source: 'crowd-sourced',
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addConvertedFaq(newFaq);
    return { success: true, data: newFaq };
  },
};