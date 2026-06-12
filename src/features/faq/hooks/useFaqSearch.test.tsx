import '@testing-library/jest-dom/vitest';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FAQ } from '../types/faq.types';
import { useFaqSearch } from './useFaqSearch';
import { getFaqs, markFaqHelpful } from '../services/faqService';
import { FaqList } from '../components/FaqList';

vi.mock('../services/faqService', () => ({
  getFaqs: vi.fn(),
  markFaqHelpful: vi.fn(),
}));

vi.mock('../../auth/context/AuthContext', () => ({
  useAuth: () => ({ user: { role: 'intern' } }),
}));

const faq: FAQ = {
  id: 'faq-1',
  question: 'Does the count update?',
  answer: 'Yes, it updates immediately in FAQ state.',
  category: 'Support',
  tags: ['helpful'],
  helpfulCount: 1,
  source: 'existing',
  createdAt: '2026-06-01T10:00:00Z',
  updatedAt: '2026-06-01T10:00:00Z',
};

describe('useFaqSearch helpful count', () => {
  beforeEach(() => {
    vi.mocked(getFaqs).mockResolvedValue({ success: true, data: [faq] });
    vi.mocked(markFaqHelpful).mockResolvedValue({ success: false, error: 'Backend unavailable' });
  });

  it('increments once immediately and prevents repeated session clicks', async () => {
    const { result } = renderHook(() => useFaqSearch('', 'All', { debounceMs: 0 }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      expect(await result.current.markHelpful('faq-1')).toBe(true);
    });
    expect(result.current.faqs[0].helpfulCount).toBe(2);

    await act(async () => {
      expect(await result.current.markHelpful('faq-1')).toBe(false);
    });
    expect(result.current.faqs[0].helpfulCount).toBe(2);
    expect(markFaqHelpful).toHaveBeenCalledOnce();
  });

  it('updates the visible found-helpful count exactly once when clicked', async () => {
    function HelpfulFaqList() {
      const { faqs, loading, markHelpful } = useFaqSearch('', 'All', { debounceMs: 0 });
      return loading ? null : <FaqList faqs={faqs} onHelpful={markHelpful} />;
    }

    render(<HelpfulFaqList />);
    expect(await screen.findByText('1 found helpful')).toBeVisible();

    await userEvent.click(screen.getByRole('button', { name: /Does the count update/i }));
    const helpfulButton = screen.getByRole('button', { name: /Helpful$/ });
    await userEvent.click(helpfulButton);

    expect(await screen.findByText('2 found helpful')).toBeVisible();
    await userEvent.click(helpfulButton);
    expect(screen.getByText('2 found helpful')).toBeVisible();
    expect(screen.queryByText('3 found helpful')).not.toBeInTheDocument();
  });
});
