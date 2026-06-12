/**
 * In-memory FAQ seed data — realistic Samagama/VINS internship entries.
 * "source: existing" = official/preloaded; "source: crowd-sourced" = converted admin FAQs.
 * This mirrors the frontend mock data structure exactly.
 */
import type { FAQ } from '../types/faq.js';

export const seedFaqs: FAQ[] = [
  // ── Samagama Portal & Login ──────────────────────────────
  {
    id: 'faq-001',
    question: 'I cannot log in to Samagama. What should I do?',
    answer:
      'First, ensure you are using the correct registered email address. If you have forgotten your password, use the "Forgot Password" link on the login page to receive a reset link by email. If you still cannot access your account after resetting, your onboarding may not be complete — check that you have accepted your internship offer and completed profile setup. For persistent issues, raise a query with your intern coordinator.',
    category: 'Samagama Portal',
    tags: ['login', 'samagama', 'password', 'forgot', 'reset', 'portal', 'sign in', 'access'],
    helpfulCount: 512,
    source: 'existing',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'faq-002',
    question: 'How do I accept the VINS internship offer on Samagama?',
    answer:
      'After receiving your selection email, log in to Samagama using your registered email and navigate to "My Applications." Find your pending offer and click "Accept Offer." Complete the onboarding form and submit. Your manager will be notified automatically and will begin setting up your orientation schedule. Offers that are not accepted within the stated deadline may be released to other candidates.',
    category: 'Samagama Portal',
    tags: ['accept', 'offer', 'joining', 'accept offer', 'application', 'samagama', 'onboarding'],
    helpfulCount: 387,
    source: 'existing',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2026-01-20T14:30:00Z',
  },
  {
    id: 'faq-003',
    question: 'How do I fill in my personal details on Samagama?',
    answer:
      'After logging in, go to "My Profile" and complete all required fields: full legal name (as it should appear on your certificate), date of birth, contact number, permanent and correspondence address, and your educational background. All fields marked with an asterisk (*) are mandatory. Save changes after each section. An incomplete profile will delay your stipend processing.',
    category: 'Samagama Portal',
    tags: ['profile', 'personal details', 'name', 'address', 'education', 'bio', 'samagama', 'form'],
    helpfulCount: 298,
    source: 'existing',
    createdAt: '2024-02-05T09:00:00Z',
    updatedAt: '2025-11-10T09:00:00Z',
  },
  {
    id: 'faq-004',
    question: 'My CV or resume upload is failing on Samagama. What do I do?',
    answer:
      'Ensure your file is in PDF, DOC, or DOCX format and does not exceed 5 MB in size. Avoid special characters or very long filenames — rename your file to something simple like resume.pdf before uploading. Supported browsers are Chrome, Firefox, and Edge — avoid using Safari or Internet Explorer. If the upload still fails after trying these steps, raise a query and attach your CV separately in the query description.',
    category: 'Samagama Portal',
    tags: ['cv', 'resume', 'upload', 'file', 'document', 'pdf', 'attach', 'samagama'],
    helpfulCount: 234,
    source: 'existing',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2025-12-20T11:00:00Z',
  },
  {
    id: 'faq-005',
    question: 'The interview or assessment link is not opening. What should I do?',
    answer:
      'Check that you are using a desktop or laptop (not a mobile phone) and a supported browser — Chrome or Edge are recommended. Disable any ad-blockers or VPN connections before clicking the link. The link may also have expired — interview links are time-bound and cannot be reused. If the link has expired or you encounter a technical error, contact your hiring coordinator immediately rather than waiting until the deadline.',
    category: 'Samagama Portal',
    tags: ['interview', 'assessment', 'link', 'test', 'exam', 'not opening', 'technical', 'browser'],
    helpfulCount: 189,
    source: 'existing',
    createdAt: '2024-04-01T09:00:00Z',
    updatedAt: '2025-10-15T14:00:00Z',
  },
  {
    id: 'faq-006',
    question: 'When will I know the result of my application or interview?',
    answer:
      'Application results are communicated via email to the registered address within 5–7 working days after the application window closes. If you have passed the interview, you will receive an offer email with a deadline to accept. If you have not heard back after the stated timeline, check your spam folder first, then raise a query with your hiring coordinator citing your application ID.',
    category: 'Samagama Portal',
    tags: ['result', 'status', 'outcome', 'decision', 'waiting', 'application', 'interview result'],
    helpfulCount: 445,
    source: 'existing',
    createdAt: '2024-05-01T09:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },

  // ── NOC ─────────────────────────────────────────────────
  {
    id: 'faq-007',
    question: 'What is an NOC and do I need to submit one?',
    answer:
      'NOC stands for No Objection Certificate. It is required if you are currently employed, studying, or have an existing contractual obligation. Your NOC must be on official letterhead, signed by your institution or employer, and submitted before your internship start date. If your college or employer requires a specific format, download the NOC template from the portal and get it signed. Failure to submit a required NOC may result in your offer being withdrawn.',
    category: 'Documentation',
    tags: ['noc', 'no objection certificate', 'document', 'college', 'employer', 'certificate', 'submission'],
    helpfulCount: 312,
    source: 'existing',
    createdAt: '2024-06-01T09:00:00Z',
    updatedAt: '2025-09-20T09:00:00Z',
  },
  {
    id: 'faq-008',
    question: 'How do I submit my NOC on Samagama?',
    answer:
      'Log in to Samagama and go to "Documents" under your profile. Upload the signed NOC as a PDF. The document must be legible, on official letterhead, and contain the authorised signature. Uploaded documents are reviewed within 2 working days — you will receive an email if any issues are found. Do not delay submission as it blocks your onboarding completion.',
    category: 'Documentation',
    tags: ['noc', 'submit', 'upload', 'document', 'portal', 'samagama', 'certificate'],
    helpfulCount: 201,
    source: 'existing',
    createdAt: '2024-06-15T09:00:00Z',
    updatedAt: '2025-08-14T10:00:00Z',
  },

  // ── Internship Mode ──────────────────────────────────────
  {
    id: 'faq-009',
    question: 'What is the difference between online and offline internship?',
    answer:
      "Online (remote) internship means you work from home or any location of your choice with your manager's approval. You must be contactable during core business hours (10 AM – 6 PM IST). Offline (in-person) internship requires physical attendance at the Vicharanashala office or assigned location. Some tracks may require a minimum number of in-person days per week. Your offer letter specifies your mode — if you need to change it, discuss with your manager and update your profile accordingly.",
    category: 'Internship Mode',
    tags: ['online', 'offline', 'remote', 'wfh', 'work from home', 'in-person', 'mode', 'hybrid'],
    helpfulCount: 423,
    source: 'existing',
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2025-12-01T15:30:00Z',
  },
  {
    id: 'faq-010',
    question: 'Can I switch between online and offline mode during my internship?',
    answer:
      'Mode changes are possible but require your manager\'s prior approval. Send a request to your manager at least 3 working days in advance, specifying your preferred dates and reason. Sudden or frequent mode switches without approval may affect your attendance record. If you need a permanent mode change, email the intern coordinator with your manager\'s consent.',
    category: 'Internship Mode',
    tags: ['online', 'offline', 'remote', 'switch', 'change mode', 'wfh', 'in-person'],
    helpfulCount: 176,
    source: 'existing',
    createdAt: '2024-07-01T09:00:00Z',
    updatedAt: '2025-10-20T11:00:00Z',
  },

  // ── Laptop & Equipment ───────────────────────────────────
  {
    id: 'faq-011',
    question: 'What are the laptop or desktop requirements for the internship?',
    answer:
      'You will need a functional laptop or desktop with a minimum of 8 GB RAM, a modern processor (Intel i5 / AMD Ryzen 5 or equivalent), and at least 50 GB of free disk space. A stable broadband connection (10+ Mbps) is required for online sessions and video calls. Specific software requirements depend on your track — your manager will share the required tools list during orientation. Vicharanashala does not provide hardware; you are responsible for your own setup.',
    category: 'Equipment',
    tags: ['laptop', 'desktop', 'computer', 'requirements', 'specs', 'equipment', 'setup', 'hardware', 'ram'],
    helpfulCount: 334,
    source: 'existing',
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2025-11-30T13:00:00Z',
  },
  {
    id: 'faq-012',
    question: 'Does VINS provide a laptop or other hardware?',
    answer:
      'No. VINS does not provide hardware. Interns are responsible for arranging their own laptop or desktop and internet connection. If you face genuine financial hardship that prevents you from arranging a suitable device, speak to the intern coordinator before your start date — adjustments to your offer may be considered on a case-by-case basis.',
    category: 'Equipment',
    tags: ['laptop', 'provided', 'hardware', 'equipment', 'issue', 'arrange', 'device'],
    helpfulCount: 156,
    source: 'existing',
    createdAt: '2024-03-05T09:00:00Z',
    updatedAt: '2025-09-15T10:00:00Z',
  },

  // ── Mentor & Sessions ────────────────────────────────────
  {
    id: 'faq-013',
    question: 'How do mentor or sync sessions work?',
    answer:
      'Your manager will schedule regular check-in sessions with you — typically weekly or bi-weekly. These are a chance to discuss project progress, blockers, and your overall experience. Sessions are held over a video call link shared by your manager. Come prepared with updates on your work and any questions you have. Consistent participation in sync sessions is part of your internship evaluation.',
    category: 'Mentor Sessions',
    tags: ['mentor', 'sync', 'session', 'meeting', 'check-in', 'manager', '1-on-1', 'call', 'weekly'],
    helpfulCount: 287,
    source: 'existing',
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2025-10-05T09:00:00Z',
  },
  {
    id: 'faq-014',
    question: 'My mentor/manager is unavailable. What should I do?',
    answer:
      'If your manager is on leave or unreachable for more than 2 working days, email them and copy the intern coordinator. Identify any tasks you can continue independently — do not pause work waiting for manager input unless a task genuinely cannot proceed without their decision. Use the time to read documentation, explore the codebase, or tidy up your work. If you have an urgent production issue, email the intern coordinator directly.',
    category: 'Mentor Sessions',
    tags: ['manager', 'mentor', 'unavailable', 'absent', 'leave', 'escalate', 'support', 'help'],
    helpfulCount: 198,
    source: 'existing',
    createdAt: '2024-04-02T09:30:00Z',
    updatedAt: '2025-08-20T14:00:00Z',
  },

  // ── Projects & GitHub ────────────────────────────────────
  {
    id: 'faq-015',
    question: 'How do I submit my project or code on GitHub?',
    answer:
      "Your manager will share the organisation or team GitHub repository you should contribute to. Create a branch with your name or intern ID, commit your code regularly, and open a pull request (PR) once your feature or task is complete. Follow the contribution guidelines shared by your team — these usually include commit message format, branch naming conventions, and PR description requirements. Ensure your repository is set to private unless explicitly told otherwise.",
    category: 'Projects',
    tags: ['github', 'git', 'project', 'submit', 'code', 'commit', 'pull request', 'repository', 'repo'],
    helpfulCount: 376,
    source: 'existing',
    createdAt: '2024-03-15T09:00:00Z',
    updatedAt: '2025-12-10T13:00:00Z',
  },
  {
    id: 'faq-016',
    question: 'How are internship projects assigned?',
    answer:
      'Projects are assigned based on your application track, assessed skills, and current team demand. During your first week, your manager will brief you on available project options and discuss your interests. Final project assignments are communicated by the end of Week 2. If you have prior experience relevant to a specific project, mention it during your orientation meeting so your manager can make an informed decision.',
    category: 'Projects',
    tags: ['project', 'assignment', 'task', 'allocation', 'team', 'work'],
    helpfulCount: 245,
    source: 'existing',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2025-07-08T10:00:00Z',
  },
  {
    id: 'faq-017',
    question: 'What if I finish my project ahead of schedule?',
    answer:
      'Notify your manager as soon as you complete your milestones. You may be assigned additional tasks, a stretch project, or asked to help another team member. Use remaining time constructively — explore adjacent areas of the codebase, improve documentation, or read relevant technical material. Do not take on additional external projects or commitments without explicit manager approval.',
    category: 'Projects',
    tags: ['project', 'finish early', 'extra', 'stretch', 'additional', 'complete'],
    helpfulCount: 134,
    source: 'existing',
    createdAt: '2024-10-01T09:00:00Z',
    updatedAt: '2025-08-30T14:00:00Z',
  },

  // ── Duration & Timeline ──────────────────────────────────
  {
    id: 'faq-018',
    question: 'How long does the VINS internship last?',
    answer:
      "Most VINS internship tracks run for 3 months. Specialised tracks such as Machine Learning or Full-Stack Development may run for 6 months. Your exact start and end dates are stated in your internship agreement. Extensions beyond the standard duration require your manager's approval and are reviewed against your project milestones.",
    category: 'Duration',
    tags: ['duration', 'how long', 'months', 'timeline', 'length', 'tenure', 'time period'],
    helpfulCount: 334,
    source: 'existing',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2025-11-30T12:00:00Z',
  },
  {
    id: 'faq-019',
    question: 'When does the next internship cohort start?',
    answer:
      'VINS cohorts typically start in January, April, and July each year. The application window opens 6–8 weeks before the cohort start date. Keep an eye on the careers page and your registered email for announcements. If you have already applied, check your application status in the portal. If you are on the waiting list, you will be contacted if a seat becomes available.',
    category: 'Duration',
    tags: ['cohort', 'start date', 'next batch', 'when', 'join date', 'upcoming', 'intake'],
    helpfulCount: 211,
    source: 'existing',
    createdAt: '2024-07-01T09:00:00Z',
    updatedAt: '2026-02-10T14:00:00Z',
  },

  // ── Stipend & Benefits ───────────────────────────────────
  {
    id: 'faq-020',
    question: 'When and how will I receive my stipend?',
    answer:
      "Stipends are processed on the 28th of each month for the previous month's work. Payment is made via bank transfer to the account details you submitted during onboarding. If you have not received your stipend by the 5th of the following month, check with your bank first to confirm the transfer was not rejected. If the bank confirms no transfer was received, raise a query with your manager and copy the finance team.",
    category: 'Stipend & Benefits',
    tags: ['stipend', 'salary', 'payment', 'money', 'pay', 'monthly', 'bank'],
    helpfulCount: 421,
    source: 'existing',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2025-12-01T11:00:00Z',
  },
  {
    id: 'faq-021',
    question: 'Are interns eligible for any leave during the internship?',
    answer:
      'Interns follow the standard public holiday calendar. Additionally, you are entitled to 1 day of sick leave and 1 day of casual leave per full month worked, pro-rated for partial months. All leave must be communicated to your manager at least 24 hours in advance, except in genuine emergencies. Unapproved absences or frequent unexplained gaps may affect your evaluation and certificate eligibility.',
    category: 'Stipend & Benefits',
    tags: ['leave', 'holiday', 'sick', 'time off', 'pto', 'casual', 'absence', 'attendance'],
    helpfulCount: 287,
    source: 'existing',
    createdAt: '2024-04-10T09:00:00Z',
    updatedAt: '2025-09-12T16:00:00Z',
  },
  {
    id: 'faq-022',
    question: 'Is the internship stipend taxable?',
    answer:
      'Stipends are paid as a training allowance. If your total stipend in a financial year exceeds the minimum tax exemption threshold under Indian Income Tax rules, TDS may be deducted at source. We recommend consulting a qualified tax professional for advice specific to your situation, as individual circumstances vary.',
    category: 'Stipend & Benefits',
    tags: ['tax', 'tds', 'income', 'salary', 'money', 'financial', 'exemption'],
    helpfulCount: 203,
    source: 'existing',
    createdAt: '2024-05-01T09:00:00Z',
    updatedAt: '2025-07-20T09:30:00Z',
  },

  // ── Certificate ──────────────────────────────────────────
  {
    id: 'faq-023',
    question: 'When and how will I receive my internship certificate?',
    answer:
      "Once all your project deliverables have been submitted, your manager formally signs off, and there are no pending leave adjustments, your completion certificate is generated within 10 working days. It is sent as a PDF to your registered email and is also available for download in the portal under 'My Documents.' Ensure your full legal name in your portal profile matches your official ID before your end date.",
    category: 'Certificate',
    tags: ['certificate', 'completion', 'completion letter', 'document', 'download', 'verify'],
    helpfulCount: 512,
    source: 'existing',
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2026-01-05T11:00:00Z',
  },
  {
    id: 'faq-024',
    question: 'Can I get my certificate or experience letter before my internship ends?',
    answer:
      'No. Internship certificates are only issued after all project deliverables have been submitted and your manager has formally approved your completion. For university or visa requirements that need a letter before your end date, submit a request to the intern coordinator at least 15 working days before your deadline. Provide the required template or format in your request.',
    category: 'Certificate',
    tags: ['certificate', 'early', 'before end', 'letter', 'experience', 'university', 'deadline'],
    helpfulCount: 289,
    source: 'existing',
    createdAt: '2024-04-15T09:00:00Z',
    updatedAt: '2025-09-01T10:00:00Z',
  },

  // ── Support & Escalation ─────────────────────────────────
  {
    id: 'faq-025',
    question: 'How do I raise a support query if my question is not answered here?',
    answer:
      'Go to the Raise Query page and describe your issue clearly, including relevant dates, steps you have already taken, and any reference IDs. Before submitting, the system will show related FAQs and resolved queries — please check those first. Submitted queries are reviewed by the intern coordinator within 1–2 working days. For urgent issues, email the intern coordinator directly rather than waiting for a query response.',
    category: 'Support',
    tags: ['help', 'support', 'query', 'contact', 'ask', 'raise', 'issue', 'problem', 'escalate'],
    helpfulCount: 420,
    source: 'existing',
    createdAt: '2024-06-01T09:00:00Z',
    updatedAt: '2026-02-28T10:00:00Z',
  },
  {
    id: 'faq-026',
    question: 'Who do I contact for stipend or payment-related issues?',
    answer:
      "For stipend or payment issues, first check your bank statement for any rejected or returned transfers. Then contact your manager to inform them of the delay. If the issue persists after your manager's confirmation, the finance team will investigate. Always cite your intern ID and the month in question when raising payment-related queries to avoid delays.",
    category: 'Support',
    tags: ['stipend', 'payment', 'finance', 'problem', 'issue', 'bank', 'support', 'help', 'money'],
    helpfulCount: 341,
    source: 'existing',
    createdAt: '2024-05-10T09:00:00Z',
    updatedAt: '2025-11-15T09:00:00Z',
  },
];