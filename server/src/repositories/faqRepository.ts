import type { FAQ, GetFaqsQuery, CreateFaqInput } from '../types/faq.js';
import { FaqModel } from '../models/Faq.js';
import { mapFaq } from './mappers.js';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function searchRegex(value: string): RegExp {
  return new RegExp(escapeRegex(value), 'i');
}

class FaqRepository {
  /** Returns all FAQs, optionally filtered by search text and/or category. */
  async findAll(query: GetFaqsQuery = {}): Promise<FAQ[]> {
    const filter: Record<string, unknown> = {};
    if (query.category) filter.category = new RegExp(`^${escapeRegex(query.category)}$`, 'i');
    if (query.search) {
      const regex = searchRegex(query.search);
      filter.$or = [{ question: regex }, { answer: regex }, { category: regex }, { tags: regex }];
    }

    const faqs = await FaqModel.find(filter).sort({ helpfulCount: -1 });
    return faqs.map((faq) => mapFaq(faq.toObject()));
  }

  /** Returns a single FAQ by id, or undefined if not found. */
  async findById(id: string): Promise<FAQ | undefined> {
    const faq = await FaqModel.findOne({ id });
    return faq ? mapFaq(faq.toObject()) : undefined;
  }

  /**
   * Adds a new FAQ.
   * "existing" source = preloaded; "crowd-sourced" = admin/converted.
   */
  async create(input: CreateFaqInput, source: FAQ['source'] = 'crowd-sourced'): Promise<FAQ> {
    const faq = await FaqModel.create({
      question: input.question.trim(),
      answer: input.answer.trim(),
      category: input.category.trim(),
      tags: input.tags ?? [],
      source,
    });
    return mapFaq(faq.toObject());
  }

  async markHelpful(id: string): Promise<FAQ | undefined> {
    const faq = await FaqModel.findOneAndUpdate(
      { id },
      { $inc: { helpfulCount: 1 } },
      { new: true },
    );
    return faq ? mapFaq(faq.toObject()) : undefined;
  }
}

// Singleton — shared across the whole server process
export const faqRepository = new FaqRepository();
