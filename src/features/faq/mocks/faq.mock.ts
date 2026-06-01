// ============================================================
// Mock FAQ data — realistic Vicharanashala internship FAQs
// Must satisfy the FAQ interface exactly (TypeScript enforced)
// ============================================================

import type { FAQ } from '../types/faq.types';
import type { ApiResponse } from '../../../shared/types/apiResponse';

// ── In-memory store for crowd-sourced FAQs added at runtime ──
const convertedFaqs: FAQ[] = [];

export function addConvertedFaq(faq: FAQ): void {
  convertedFaqs.push(faq);
}

export function getConvertedFaqs(): FAQ[] {
  return [...convertedFaqs];
}

// ── Service ───────────────────────────────────────────────
export const faqMockService = {
  getAll(): ApiResponse<FAQ[]> {
    return { success: true, data: [...mockFaqs] };
  },

  searchByText(searchText: string): ApiResponse<FAQ[]> {
    const lower = searchText.toLowerCase();
    const words = lower.split(/\s+/).filter((w) => w.length > 2);
    const scored = [...mockFaqs]
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

export const mockFaqs: FAQ[] = [
  {
    id: 'faq-001',
    question: 'How do I accept and join the VINS internship?',
    answer:
      'After receiving your selection email, log in to the Vicharanashala portal using your registered email. Navigate to "My Applications," find your offer, and click "Accept Offer." Complete the onboarding form and e-sign the internship agreement. Your manager will then be notified to begin your orientation schedule.',
    category: 'Getting Started',
    tags: ['joining', 'accept', 'onboarding', 'offer'],
    helpfulCount: 142,
    source: 'existing',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2025-08-20T14:30:00Z',
  },
  {
    id: 'faq-002',
    question: 'What is VINS and what does it stand for?',
    answer:
      'VINS stands for Vicharanashala Internship Program. It is the structured internship initiative run by Vicharanashala that provides real-world project experience across multiple domains. Interns work on live projects under mentor guidance and receive a completion certificate upon satisfactory completion.',
    category: 'VINS',
    tags: ['vins', 'about', 'what is', 'internship program'],
    helpfulCount: 298,
    source: 'existing',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2025-06-15T10:00:00Z',
  },
  {
    id: 'faq-003',
    question: 'Where can I find the onboarding checklist?',
    answer:
      'The onboarding checklist is available on Confluence under "New Joiner Resources." You should also have received an invite to the #new-joiners Slack channel, where it is pinned. The Confluence version is always the most up-to-date — check there first if anything seems out of date.',
    category: 'Getting Started',
    tags: ['onboarding', 'checklist', 'confluence', 'slack'],
    helpfulCount: 187,
    source: 'existing',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2026-01-20T09:00:00Z',
  },
  {
    id: 'faq-004',
    question: 'When and how will I receive my stipend?',
    answer:
      "Stipends are processed on the 28th of every month for the previous month's work. Payment is made via bank transfer to the account details you submitted during onboarding. If you have not received your stipend by the 5th of the following month, raise a query with your manager and copy the finance team at finance@vicharanashala.com.",
    category: 'Stipend & Benefits',
    tags: ['stipend', 'salary', 'payment', 'money', 'pay', 'monthly'],
    helpfulCount: 421,
    source: 'existing',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2025-12-01T11:00:00Z',
  },
  {
    id: 'faq-005',
    question: 'Are interns eligible for paid time off or holidays?',
    answer:
      'Interns follow the same public holiday calendar as full-time employees. Additionally, interns are entitled to 1 day of sick leave and 1 day of casual leave per month, pro-rated for partial months. Leave must be communicated to your manager at least 24 hours in advance except in genuine emergencies.',
    category: 'Stipend & Benefits',
    tags: ['leave', 'holiday', 'sick', 'paid', 'time off', 'PTO'],
    helpfulCount: 156,
    source: 'existing',
    createdAt: '2024-04-10T00:00:00Z',
    updatedAt: '2025-09-12T16:00:00Z',
  },
  {
    id: 'faq-006',
    question: 'Is the internship stipend taxable?',
    answer:
      'Internship stipends are generally paid as a training allowance. If your total stipend in a financial year exceeds the minimum tax exemption limit under Indian Income Tax rules, TDS may be deducted at source. We recommend consulting a tax professional for your specific situation, as individual circumstances vary.',
    category: 'Stipend & Benefits',
    tags: ['tax', 'tds', 'income', 'salary', 'money', 'financial'],
    helpfulCount: 203,
    source: 'existing',
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2025-07-20T09:30:00Z',
  },
  {
    id: 'faq-007',
    question: 'How long does the VINS internship last?',
    answer:
      "The standard VINS internship duration is 3 months for most tracks. Some specialised tracks (e.g., ML, full-stack) run for 6 months. Extension beyond the standard duration requires your manager's approval and a review of your project milestones. The exact start and end dates are stated in your internship agreement.",
    category: 'Internship Duration',
    tags: ['duration', 'how long', 'months', 'timeline', 'length', 'tenure'],
    helpfulCount: 334,
    source: 'existing',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2025-11-30T12:00:00Z',
  },
  {
    id: 'faq-008',
    question: 'Can I extend or reduce my internship duration?',
    answer:
      'Extensions are possible if your project requires it and your manager approves. Submit an extension request at least 2 weeks before your current end date. Duration reductions are generally not encouraged but are considered on a case-by-case basis for extraordinary personal circumstances. Discuss with your manager and email the intern coordinator.',
    category: 'Internship Duration',
    tags: ['extend', 'reduce', 'duration', 'longer', 'shorter', 'timeline'],
    helpfulCount: 89,
    source: 'existing',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2025-08-14T10:00:00Z',
  },
  {
    id: 'faq-009',
    question: 'When does the next internship cohort start?',
    answer:
      'VINS cohorts typically start in January, April, and July each year. Application windows open 6–8 weeks before the cohort start date. Keep an eye on the Vicharanashala careers page and your registered email for announcements. If you have already applied, you can check your application status in the portal.',
    category: 'Internship Duration',
    tags: ['cohort', 'start date', 'next batch', 'when', 'join date'],
    helpfulCount: 211,
    source: 'existing',
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2026-02-10T14:00:00Z',
  },
  {
    id: 'faq-010',
    question: 'Can I work from home or is it office-only?',
    answer:
      "VINS internships support a hybrid model. You may work remotely for up to 3 days per week at your manager's discretion. The remaining days may require physical presence depending on your team's norms. Before starting WFH, ensure you have a stable internet connection and a suitable workspace. Notify your manager of any scheduled in-office days.",
    category: 'Remote/Offline',
    tags: ['wfh', 'work from home', 'remote', 'home', 'hybrid', 'online'],
    helpfulCount: 387,
    source: 'existing',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2025-10-05T15:30:00Z',
  },
  {
    id: 'faq-011',
    question: 'Is there a minimum attendance or minimum hours requirement?',
    answer:
      'Yes. Interns are expected to maintain regular attendance and be available during core business hours (10:00 AM – 6:00 PM IST) on working days, whether remote or in-office. Consistent unavailability without prior leave approval may affect your internship evaluation and certificate eligibility.',
    category: 'Remote/Offline',
    tags: ['attendance', 'hours', 'timing', 'availability', 'schedule', 'work from home'],
    helpfulCount: 167,
    source: 'existing',
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2025-09-22T11:00:00Z',
  },
  {
    id: 'faq-012',
    question: 'Do I need specific software or equipment to work remotely?',
    answer:
      'You will need a reliable laptop (minimum 8GB RAM recommended), a stable broadband connection (10+ Mbps), and a quiet workspace. Specific software depends on your track — your manager will share the required tool list during orientation. All necessary licenses for tools used at Vicharanashala will be provided or reimbursed when pre-approved.',
    category: 'Remote/Offline',
    tags: ['software', 'laptop', 'equipment', 'tools', 'setup', 'requirements'],
    helpfulCount: 198,
    source: 'existing',
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2025-12-10T13:00:00Z',
  },
  {
    id: 'faq-013',
    question: 'How are internship projects assigned?',
    answer:
      'Projects are assigned based on your application track, assessed skills, and current team demand. During your first week, your manager will share available project briefs and discuss your interests. Final project assignment is communicated by the end of Week 2. If you have prior experience relevant to a specific project, mention it during your orientation meeting.',
    category: 'Projects',
    tags: ['project', 'assignment', 'task', 'work', 'allocation'],
    helpfulCount: 245,
    source: 'existing',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2025-07-08T10:00:00Z',
  },
  {
    id: 'faq-014',
    question: 'What happens if I finish my project ahead of schedule?',
    answer:
      'If you complete your primary project milestones early, notify your manager. You may be assigned additional tasks, a stretch project, or asked to support another team member. Use the time constructively — read documentation, explore adjacent areas of the codebase, or contribute to internal tooling. Do not start your next external project without manager approval.',
    category: 'Projects',
    tags: ['project', 'finish early', 'extra', 'stretch', 'additional work'],
    helpfulCount: 134,
    source: 'existing',
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2025-08-30T14:00:00Z',
  },
  {
    id: 'faq-015',
    question: 'How do I earn badges during my internship?',
    answer:
      'Badges are earned by demonstrating specific competencies and behaviours. Key badges include: Quick Learner (complete 3 tasks ahead of deadline), Team Player (peer-validated collaboration), Bug Hunter (identify significant bugs), and On-Time Champion (maintain 95%+ task delivery timeliness). Badges are reviewed monthly by your manager and visible on your intern profile in the portal.',
    category: 'Badges',
    tags: ['badge', 'gamification', 'earn', 'achievement', 'skills'],
    helpfulCount: 176,
    source: 'existing',
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2025-10-18T09:00:00Z',
  },
  {
    id: 'faq-016',
    question: 'When and how will I receive my internship certificate?',
    answer:
      'Upon successful completion of your internship — all projects submitted, no pending leave adjustments, and manager sign-off — your completion certificate is generated within 10 working days. It is sent as a PDF to your registered email and is also available for download in the portal under "My Documents." Ensure your portal profile is complete (including your full legal name) before your end date.',
    category: 'Certificate',
    tags: ['certificate', 'completion', 'completion letter', 'document', 'verify'],
    helpfulCount: 512,
    source: 'existing',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2026-01-05T11:00:00Z',
  },
  {
    id: 'faq-017',
    question: 'Can I get my certificate before my internship ends?',
    answer:
      'No. Internship certificates are only issued after all project deliverables have been submitted and your manager has formally signed off. We cannot issue partial or early certificates. If you need a letter of intern experience for a university requirement, submit a request to the intern coordinator at least 15 working days before the deadline, providing the required template or format.',
    category: 'Certificate',
    tags: ['certificate', 'early', 'before end', 'letter', 'experience letter'],
    helpfulCount: 289,
    source: 'existing',
    createdAt: '2024-04-15T00:00:00Z',
    updatedAt: '2025-09-01T10:00:00Z',
  },
  {
    id: 'faq-018',
    question: 'Who do I contact if I have a problem with my stipend?',
    answer:
      'For stipend-related issues, first contact your manager to inform them of the delay. Then email the finance team at finance@vicharanashala.com with your intern ID, the month in question, and your bank transaction details (if a transfer was attempted). Response time is typically 2–3 working days.',
    category: 'Support',
    tags: ['stipend', 'payment', 'finance', 'problem', 'issue', 'support', 'help'],
    helpfulCount: 341,
    source: 'existing',
    createdAt: '2024-05-10T00:00:00Z',
    updatedAt: '2025-11-15T09:00:00Z',
  },
  {
    id: 'faq-019',
    question: 'How do I raise a query if my question is not answered here?',
    answer:
      'If this FAQ page did not answer your question, go to the Raise Query page and describe your issue clearly. Before submitting, the system will show you any existing FAQs or solved queries that may be related — please check those before submitting, as your query will be reviewed by a human and may take 1–2 working days for a response.',
    category: 'Support',
    tags: ['help', 'support', 'query', 'contact', 'ask', 'raise'],
    helpfulCount: 420,
    source: 'existing',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2026-02-28T10:00:00Z',
  },
  {
    id: 'faq-020',
    question: 'Can interns work on multiple projects simultaneously?',
    answer:
      'The standard internship is designed for one primary project at a time to ensure quality and focus. However, in exceptional cases where an intern demonstrates consistent high performance and both managers agree, a secondary project may be assigned. This requires formal approval from the intern coordinator. Do not take on additional work without approval.',
    category: 'Projects',
    tags: ['multiple', 'projects', 'parallel', 'second project', 'extra'],
    helpfulCount: 97,
    source: 'crowd-sourced',
    createdAt: '2026-03-10T14:00:00Z',
    updatedAt: '2026-03-10T14:00:00Z',
  },
  {
    id: 'faq-021',
    question: 'What should I do if my manager is unavailable for an extended period?',
    answer:
      'If your manager is on leave or unreachable for more than 2 working days, email them and copy the intern coordinator at intern.coordinator@vicharanashala.com. Identify any pending tasks you can continue working on independently in the meantime. Do not pause work waiting for manager input unless the task genuinely cannot proceed without their decision.',
    category: 'Support',
    tags: ['manager', 'unavailable', 'leave', 'absent', 'escalate', 'support'],
    helpfulCount: 183,
    source: 'crowd-sourced',
    createdAt: '2026-04-02T09:30:00Z',
    updatedAt: '2026-04-02T09:30:00Z',
  },
];