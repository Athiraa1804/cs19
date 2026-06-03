/**
 * FAQ Repository — in-memory data access layer.
 * Acts as the single source of truth for FAQ read/write operations.
 * In future this will be replaced by a real database calls.
 */
import type { FAQ, GetFaqsQuery, CreateFaqInput } from '../types/faq.js';
import { seedFaqs } from '../data/faq.data.js';

class FaqRepository {
  /** All FAQs (seed + runtime-added crowd-sourced). Mutable array. */
  private faqs: FAQ[] = [...seedFaqs];

  /** Returns all FAQs, optionally filtered by search text and/or category. */
  findAll(query: GetFaqsQuery = {}): FAQ[] {
    let results = this.faqs;

    if (query.category && query.category.trim().length > 0) {
      results = results.filter(
        (f) => f.category.toLowerCase() === query.category!.toLowerCase(),
      );
    }

    if (query.search && query.search.trim().length > 0) {
      const words = query.search
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 1);

      results = results
        .map((faq) => {
          const haystack = `${faq.question} ${faq.answer} ${faq.tags.join(' ')} ${faq.category}`.toLowerCase();
          const score = words.filter((w) => haystack.includes(w)).length;
          return { faq, score };
        })
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((s) => s.faq);
    }

    return results;
  }

  /** Returns a single FAQ by id, or undefined if not found. */
  findById(id: string): FAQ | undefined {
    return this.faqs.find((f) => f.id === id);
  }

  /**
   * Adds a new FAQ.
   * "existing" source = preloaded; "crowd-sourced" = admin/converted.
   */
  create(input: CreateFaqInput, source: FAQ['source'] = 'crowd-sourced'): FAQ {
    const now = new Date().toISOString();
    const faq: FAQ = {
      id: `faq-${Date.now()}`,
      question: input.question.trim(),
      answer: input.answer.trim(),
      category: input.category.trim(),
      tags: input.tags ?? [],
      helpfulCount: 0,
      source,
      createdAt: now,
      updatedAt: now,
    };
    this.faqs.push(faq);
    return faq;
  }
}

// Singleton — shared across the whole server process
export const faqRepository = new FaqRepository();