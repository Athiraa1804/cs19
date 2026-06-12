import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { FAQ } from '../types/faq.types';
import { FaqAccordionItem } from './FaqAccordionItem';

vi.mock('../../auth/context/AuthContext', () => ({
  useAuth: () => ({ user: { role: 'intern' } }),
}));

const faq: FAQ = {
  id: 'faq-1',
  question: 'How does helpful voting work?',
  answer: 'Interns can mark an FAQ as helpful once per page visit.',
  category: 'Support',
  tags: ['helpful'],
  helpfulCount: 4,
  source: 'existing',
  createdAt: '2026-06-01T10:00:00Z',
  updatedAt: '2026-06-01T10:00:00Z',
};

describe('FaqAccordionItem helpful button', () => {
  it('marks an FAQ helpful and prevents repeated clicks', async () => {
    const onHelpful = vi.fn().mockResolvedValue(true);
    render(<FaqAccordionItem faq={faq} onHelpful={onHelpful} />);

    await userEvent.click(screen.getByRole('button', { name: /How does helpful voting work/i }));
    const helpfulButton = screen.getByRole('button', { name: /Helpful$/ });
    await userEvent.click(helpfulButton);
    await userEvent.click(helpfulButton);

    expect(onHelpful).toHaveBeenCalledOnce();
    expect(onHelpful).toHaveBeenCalledWith('faq-1');
    expect(helpfulButton).toHaveTextContent('Helpful');
    expect(helpfulButton).toBeDisabled();
    expect(screen.queryByText(/Helpful marked|Already marked|Saving|Try marking/i)).not.toBeInTheDocument();
  });
});
