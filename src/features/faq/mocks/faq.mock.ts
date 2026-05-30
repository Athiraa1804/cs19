import type { ApiResponse } from '../../../shared/types/apiResponse';

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  source?: string;
  helpfulCount: number;
  createdAt: string;
}

const faqs: Faq[] = [
  {
    id: 'faq-001',
    question: 'What is the stipend amount for Vicharanashala internship?',
    answer: 'The stipend is ₹5,000 per month for all interns.',
    category: 'Finance',
    tags: ['stipend', 'money', 'salary', 'payment'],
    source: 'HR Department',
    helpfulCount: 42,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'faq-002',
    question: 'Is the internship work from home or offline?',
    answer: 'It is a remote internship. You can work from anywhere.',
    category: 'Work Mode',
    tags: ['remote', 'work from home', 'wfh', 'offline', 'online'],
    source: 'HR Department',
    helpfulCount: 38,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'faq-003',
    question: 'How long is the Vicharanashala internship?',
    answer: 'The internship duration is 3 months, extendable by 1 month.',
    category: 'General',
    tags: ['duration', 'how long', 'timeline', 'months'],
    source: 'HR Department',
    helpfulCount: 35,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'faq-004',
    question: 'How do I accept my VINS joining offer?',
    answer:
      'Log in to the VINS portal, go to Offers, and click Accept. You will receive a confirmation email within 24 hours.',
    category: 'Onboarding',
    tags: ['joining', 'accept', 'offer', 'acceptance', 'VINS'],
    source: 'Admin',
    helpfulCount: 29,
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'faq-005',
    question: 'What are the working hours for interns?',
    answer: 'Flexible working hours. We expect a minimum of 4 hours per day and timely task completion.',
    category: 'Work Mode',
    tags: ['hours', 'timing', 'schedule', 'working hours'],
    source: 'HR Department',
    helpfulCount: 22,
    createdAt: '2026-01-22T10:00:00Z',
  },
  {
    id: 'faq-006',
    question: 'Can I get a certificate after completing the internship?',
    answer:
      'Yes, a completion certificate is provided after you finish the internship tenure and submit all deliverables.',
    category: 'General',
    tags: ['certificate', 'completion', 'letter', 'document'],
    source: 'HR Department',
    helpfulCount: 31,
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'faq-007',
    question: 'How do I submit my weekly report?',
    answer:
      'Submit your weekly report every Sunday by 9 PM through the VINS portal under the Reports section.',
    category: 'Work Mode',
    tags: ['report', 'weekly', 'submission', 'updates'],
    source: 'Admin',
    helpfulCount: 18,
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'faq-008',
    question: 'What should I do if I face technical issues during the internship?',
    answer:
      'Raise a query on this platform or contact the admin through the support channel. Include screenshots and error details.',
    category: 'Support',
    tags: ['technical', 'issues', 'bugs', 'help', 'support'],
    source: 'Admin',
    helpfulCount: 25,
    createdAt: '2026-02-15T10:00:00Z',
  },
];

// Session-scoped FAQs added when admins convert verified replies to FAQs
const convertedFaqs: Faq[] = [];

export function addConvertedFaq(faq: Faq): void {
  convertedFaqs.push(faq);
}

export function getConvertedFaqs(): Faq[] {
  return [...convertedFaqs];
}

export const faqMockService = {
  getAll(): ApiResponse<Faq[]> {
    return { success: true, data: [...faqs, ...convertedFaqs] };
  },

  searchByText(searchText: string): ApiResponse<Faq[]> {
    const lower = searchText.toLowerCase();
    const words = lower.split(/\s+/);
    const all = [...faqs, ...convertedFaqs];
    const scored = all
      .map((faq) => {
        const combined = `${faq.question} ${faq.answer} ${faq.tags.join(' ')} ${faq.category}`.toLowerCase();
        const score = words.filter((w) => combined.includes(w)).length;
        return { faq, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);
    return { success: true, data: scored.map((s) => s.faq) };
  },
};