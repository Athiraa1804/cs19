/**
 * In-memory query seed data — mirrors the frontend mock queries.
 * Used as the initial dataset for the Query API.
 */
import type { Query } from '../types/query.js';

export const seedQueries: Query[] = [
  {
    id: 'q-001',
    title: 'Stipend not received for March month',
    description:
      'I have not received my stipend for March. My UPI ID is registered correctly. Please look into this.',
    category: 'Finance',
    tags: ['stipend', 'payment', 'march'],
    status: 'answered',
    createdAt: '2026-03-05T14:30:00Z',
    updatedAt: '2026-03-07T09:15:00Z',
    createdBy: 'intern-rahul',
    latestReplyPreview: 'Your payment was processed on March 7. Check with your bank.',
    matchedFaqIds: ['faq-001'],
    replyCount: 1,
  },
  {
    id: 'q-002',
    title: 'How to change my working shift timing?',
    description:
      'I have college in the mornings. Can I switch to an evening shift? What is the process?',
    category: 'Work Mode',
    tags: ['timing', 'shift', 'schedule', 'college'],
    status: 'open',
    createdAt: '2026-03-10T11:00:00Z',
    updatedAt: '2026-03-10T11:00:00Z',
    createdBy: 'intern-priya',
    replyCount: 0,
  },
  {
    id: 'q-003',
    title: 'Extension of internship by 1 month',
    description:
      'My manager suggested I extend by 1 more month. What is the process and will the stipend continue?',
    category: 'General',
    tags: ['extension', 'duration', 'internship'],
    status: 'resolved',
    createdAt: '2026-03-12T16:45:00Z',
    updatedAt: '2026-03-14T10:00:00Z',
    createdBy: 'intern-rahul',
    latestReplyPreview:
      'Yes, stipend continues during extension. Fill the extension form on the portal.',
    matchedFaqIds: ['faq-003'],
    replyCount: 1,
  },
  {
    id: 'q-004',
    title: 'Cannot find weekly report section in portal',
    description:
      'The Reports section in the VINS portal shows a 404 error. I need to submit my week 4 report.',
    category: 'Technical',
    tags: ['portal', 'report', 'bug', 'website'],
    status: 'open',
    createdAt: '2026-03-15T20:00:00Z',
    updatedAt: '2026-03-15T20:00:00Z',
    createdBy: 'intern-priya',
    replyCount: 0,
  },
  {
    id: 'q-005',
    title: 'Want to add skills section in completion certificate',
    description:
      'Can the completion certificate include the specific skills I learned? Or is it a generic one?',
    category: 'General',
    tags: ['certificate', 'skills', 'completion'],
    status: 'verified',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-18T14:00:00Z',
    createdBy: 'intern-rahul',
    latestReplyPreview:
      'The certificate is role-based. Skills can be added to your experience letter on request.',
    matchedFaqIds: ['faq-006'],
    replyCount: 2,
    verifiedReplyId: 'reply-005-verified',
  },
];