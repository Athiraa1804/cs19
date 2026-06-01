import type { Query } from '../types/query.types';
import type { FAQ } from '../../faq/types/faq.types';
import { faqMockService } from '../../faq/mocks/faq.mock';
import { queryService } from '../services/queryService';

export interface SimilarSuggestion {
  type: 'faq' | 'query';
  id: string;
  title: string;
  preview: string;
  category: string;
  score: number;
}

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
}

function scoreMatch(tokens: string[], targetText: string): number {
  const targetTokens = tokenize(targetText);
  if (tokens.length === 0 || targetTokens.length === 0) return 0;
  const matches = tokens.filter((t) =>
    targetTokens.some((tt) => tt.includes(t) || t.includes(tt))
  );
  return matches.length / Math.max(tokens.length, targetTokens.length);
}

function buildSearchText(item: Query | FAQ, isFaq: boolean): string {
  if (isFaq) {
    const f = item as FAQ;
    return `${f.question} ${f.answer} ${f.tags.join(' ')} ${f.category}`;
  }
  const q = item as Query;
  return `${q.title} ${q.description} ${q.tags.join(' ')} ${q.category}`;
}

export async function findSimilarItems(
  title: string,
  description: string,
  userId: string
): Promise<SimilarSuggestion[]> {
  const combinedText = `${title} ${description}`;
  const tokens = tokenize(combinedText);
  if (tokens.length === 0) return [];

  // Get all existing queries for this user (exclude own drafts)
  const [faqResult, queryResult] = await Promise.all([
    faqMockService.searchByText(combinedText),
    queryService.getAll(),
  ]);

  const suggestions: SimilarSuggestion[] = [];

  if (faqResult.success && faqResult.data) {
    for (const faq of faqResult.data.slice(0, 4)) {
      const text = buildSearchText(faq, true);
      const score = scoreMatch(tokens, text);
      if (score >= 0.2) {
        suggestions.push({
          type: 'faq',
          id: faq.id,
          title: faq.question,
          preview: faq.answer.length > 120 ? faq.answer.slice(0, 120) + '…' : faq.answer,
          category: faq.category,
          score,
        });
      }
    }
  }

  if (queryResult.success && queryResult.data) {
    for (const query of queryResult.data) {
      if (query.createdBy === userId && query.status === 'open') continue;
      const text = buildSearchText(query, false);
      const score = scoreMatch(tokens, text);
      if (score >= 0.25) {
        suggestions.push({
          type: 'query',
          id: query.id,
          title: query.title,
          preview: query.latestReplyPreview ?? query.description.slice(0, 120),
          category: query.category,
          score,
        });
      }
    }
  }

  return suggestions.sort((a, b) => b.score - a.score).slice(0, 6);
}