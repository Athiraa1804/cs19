import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReplyForm } from './ReplyForm';

describe('ReplyForm', () => {
  it('clears the reply after a successful submission', async () => {
    const onSubmit = vi.fn().mockResolvedValue(true);
    render(<ReplyForm isSubmitting={false} currentRole="intern" onSubmit={onSubmit} />);

    const input = screen.getByLabelText(/reply/i);
    await userEvent.type(input, 'This is a helpful reply.');
    await userEvent.click(screen.getByRole('button', { name: /post reply/i }));

    expect(onSubmit).toHaveBeenCalledWith('This is a helpful reply.');
    expect(input).toHaveValue('');
  });

  it('keeps the reply text after a failed submission', async () => {
    const onSubmit = vi.fn().mockResolvedValue(false);
    render(<ReplyForm isSubmitting={false} currentRole="admin" onSubmit={onSubmit} />);

    const input = screen.getByLabelText(/reply/i);
    await userEvent.type(input, 'This reply should remain visible.');
    await userEvent.click(screen.getByRole('button', { name: /post reply/i }));

    expect(input).toHaveValue('This reply should remain visible.');
  });
});
