/**
 * In-memory reply seed data — mirrors the frontend mock replies.
 * Used as the initial dataset for the Reply API.
 */
import type { Reply } from '../types/reply.js';

export const seedReplies: Reply[] = [
  // q-001: Stipend not received
  {
    id: 'r-001',
    queryId: 'q-001',
    body: 'Your stipend for March should have been credited by the 7th. Check your bank UPI transaction history first.',
    authorName: 'admin-ashok',
    authorRole: 'admin',
    createdAt: '2026-03-06T09:00:00Z',
    isVerified: true,
  },
  {
    id: 'r-002',
    queryId: 'q-001',
    body: 'Thanks Ashok! The payment came through today.',
    authorName: 'intern-rahul',
    authorRole: 'intern',
    createdAt: '2026-03-07T09:15:00Z',
    isVerified: false,
  },

  // q-002: Change shift timing
  {
    id: 'r-003',
    queryId: 'q-002',
    body: 'Flexible timing is allowed. Email your team lead with your preferred hours and they will update it.',
    authorName: 'admin-priya',
    authorRole: 'admin',
    createdAt: '2026-03-11T10:30:00Z',
    isVerified: false,
  },

  // q-003: Extension of internship
  {
    id: 'r-004',
    queryId: 'q-003',
    body: 'Yes, the stipend continues during extension. Fill the extension request form on the portal under My Profile > Internship Details.',
    authorName: 'admin-ashok',
    authorRole: 'admin',
    createdAt: '2026-03-13T11:00:00Z',
    isVerified: true,
  },
  {
    id: 'r-005',
    queryId: 'q-003',
    body: 'Done! Got the form, filling it now.',
    authorName: 'intern-rahul',
    authorRole: 'intern',
    createdAt: '2026-03-14T10:00:00Z',
    isVerified: false,
  },

  // q-004: Cannot find weekly report section
  {
    id: 'r-006',
    queryId: 'q-004',
    body: 'The Reports section is under More > Weekly Report, not under the main Reports tab. We will fix the nav in the next update.',
    authorName: 'admin-ashok',
    authorRole: 'admin',
    createdAt: '2026-03-16T09:00:00Z',
    isVerified: false,
  },

  // q-005: Certificate skills section
  {
    id: 'r-007',
    queryId: 'q-005',
    body: 'Your completion certificate lists your role. For a skills-specific letter, raise a request to hr@vicharanashala.com after your internship ends.',
    authorName: 'admin-priya',
    authorRole: 'admin',
    createdAt: '2026-03-02T14:00:00Z',
    isVerified: true,
  },
  {
    id: 'r-008',
    queryId: 'q-005',
    body: 'Thanks, will do!',
    authorName: 'intern-rahul',
    authorRole: 'intern',
    createdAt: '2026-03-18T14:00:00Z',
    isVerified: false,
  },
];