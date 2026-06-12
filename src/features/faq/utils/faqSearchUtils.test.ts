import { describe, expect, it } from 'vitest';
import { mockFaqs } from '../mocks/faq.mock';
import { filterByCategory, getAllCategories, searchFaqs } from './faqSearchUtils';

describe('faqSearchUtils', () => {
  it('expands common synonym and phrase searches', () => {
    expect(searchFaqs(mockFaqs, 'money')[0]?.question.toLowerCase()).toContain('stipend');
    expect(searchFaqs(mockFaqs, 'work from home')[0]?.question.toLowerCase()).toContain('online');
    expect(searchFaqs(mockFaqs, 'time off')[0]?.question.toLowerCase()).toContain('leave');
  });

  it('matches a stipend typo', () => {
    const results = searchFaqs(mockFaqs, 'stitpend');

    expect(results.some((faq) => faq.question.toLowerCase().includes('stipend'))).toBe(true);
  });

  it('filters and lists categories', () => {
    const categories = getAllCategories(mockFaqs);
    const category = categories.find((value) => value !== 'All');

    expect(categories[0]).toBe('All');
    expect(category).toBeTruthy();
    expect(filterByCategory(mockFaqs, category!)).toSatisfy((faqs) =>
      faqs.every((faq) => faq.category === category),
    );
  });
});
