import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Reply } from '../types/reply.types';
import { ReplyList } from './ReplyList';

const replies: Reply[] = [
  {
    id: 'intern-unverified',
    queryId: 'query-1',
    body: 'An unverified answer from an intern.',
    authorName: 'Intern User',
    authorRole: 'intern',
    createdAt: '2026-06-01T10:00:00Z',
    isVerified: false,
  },
  {
    id: 'admin-verified',
    queryId: 'query-1',
    body: 'A verified answer from an admin.',
    authorName: 'Admin User',
    authorRole: 'admin',
    createdAt: '2026-06-01T11:00:00Z',
    isVerified: true,
  },
];

function renderReplies(showAdminActions: boolean) {
  render(
    <ReplyList
      replies={replies}
      showAdminActions={showAdminActions}
      onVerify={vi.fn()}
      onConvertToFaq={vi.fn()}
      verifyingReplyId={null}
      convertingReplyId={null}
    />,
  );
}

describe('ReplyList visibility and actions', () => {
  it('shows every intern, admin, verified, and unverified answer to interns without admin actions', () => {
    renderReplies(false);

    expect(screen.getByText('An unverified answer from an intern.')).toBeVisible();
    expect(screen.getByText('A verified answer from an admin.')).toBeVisible();
    expect(screen.getByText('Intern')).toBeVisible();
    expect(screen.getByText('Admin')).toBeVisible();
    expect(screen.getByText('Verified Answer')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Verify Answer' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Convert to FAQ' })).not.toBeInTheDocument();
  });

  it('shows all answers and the correct protected actions to admins', () => {
    renderReplies(true);

    expect(screen.getByText('An unverified answer from an intern.')).toBeVisible();
    expect(screen.getByText('A verified answer from an admin.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Verify Answer' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Convert to FAQ' })).toBeVisible();
  });
});
