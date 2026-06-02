# CONTEXT.md

# Crowd-Sourced FAQ Generation System

## Project Name

Crowd-Sourced FAQ Generation System for Vicharanashala Internship

## Project Goal

Build a crowd-sourced FAQ and support system for interns where:

1. Existing FAQs can be searched and browsed easily
2. Interns are encouraged to find existing answers before raising new queries
3. Interns can raise queries only when FAQs or similar discussions do not solve their issue
4. Peers/admins can answer queries
5. Admins can verify the best answer
6. Verified answers can be converted into new FAQs

The system should reduce repeated questions, help interns faster, and slowly improve the FAQ knowledge base over time.

---

# Product Vision

The product should feel like a simple, reliable internship help center.

It should combine:

* FAQ discovery
* smart search
* query raising
* peer/admin discussion
* admin answer verification
* FAQ generation from verified answers

The goal is not to build a complex AI chatbot or overdesigned dashboard.

The goal is to create a stable, beginner-friendly, mobile-safe, maintainable support system.

---

# Product Principles

## 1. FAQ-First Philosophy

The system should always encourage users to check existing answers before creating a new query.

Before allowing a new issue/query, the product should guide the user through:

1. Existing FAQs
2. Similar solved questions
3. Related open discussions

Only after these options are shown should the user continue to raise a new query.

---

## 2. Low Cognitive Load

The interface should be simple and understandable.

Users should not feel confused by too many buttons, tabs, cards, animations, or options.

Every screen should answer:

* What can I do here?
* What should I do next?
* Where can I find help?

---

## 3. Duplicate Question Prevention

The system should reduce duplicate questions whenever possible.

Before creating a query, the system should:

* search FAQs
* search similar existing queries
* suggest already solved questions
* show related discussions
* warn the user if a similar question already exists

Goal:

* reduce repeated discussions
* reduce moderation load
* help interns get answers faster
* keep the FAQ system clean

---

## 4. Beginner Intern Friendliness

The product is mainly for interns who may be new, confused, or stuck.

The tone and UI should feel:

* friendly
* safe
* calm
* clear
* beginner-friendly
* non-judgmental

Users should never feel punished for asking a question, but the system should gently guide them to existing answers first.

---

## 5. Support Before Escalation

The system should first offer self-help and peer/admin knowledge before escalation.

Flow:

FAQ Search
→ Similar Solved Questions
→ Open Discussions
→ Raise Query
→ Peer/Admin Reply
→ Admin Verification
→ Convert Verified Answer To FAQ

---

# Current MVP Scope

## Included In MVP

The MVP should focus only on the most important working system.

### 1. FAQ Page

Must include:

* View FAQs
* Search FAQs
* Smart/fuzzy search
* Filter FAQs by category/tags
* FAQ accordion/list
* Helpful count
* FAQ source indicator
* Empty state when no FAQ is found
* Loading/error states

FAQ source should indicate whether the FAQ came from:

* existing FAQ data
* crowd-sourced verified answer

---

### 2. Smart Search

Search should support:

* typo tolerance
* fuzzy matching
* synonym-like matching
* natural language style queries
* ranking most relevant results first

Example behavior:

* "money" should match stipend-related FAQs
* "work from home" should match remote/offline internship FAQs
* "how long" should match internship duration FAQs
* "joining internship" should match accepting or joining VINS internship FAQs
* "time off" and "sick leave" should match leave/holiday FAQs

Search priority:

1. Existing FAQs
2. Similar solved queries
3. Open discussions

Search implementation notes:

* Uses a local synonym dictionary (no Fuse.js dependency in MVP)
* Multi-word phrase pre-check: full query string is checked against the synonym map first, before splitting into individual words. This ensures phrase queries like "time off" and "work from home" expand correctly.
* Synonym map uses bidirectional expansion: a word can be a key or a value, and both directions are checked.
* Fuzzy fallback via Levenshtein distance for typo tolerance.
* Results ranked by relevance score (question match > category > tag > base score), with helpfulCount as tiebreaker.
* Debounced input (300ms) to avoid recomputing on every keystroke.

The MVP does not require real semantic AI search.

---

### 3. Raise Query Page

Must include:

* Query title
* Query description
* Category
* Tags
* Validation
* Submit button
* Loading state
* Error state
* Disabled submit state while submitting
* Duplicate submission prevention

Before submitting, the system should show possible matching FAQs or similar queries if available.

---

### 4. Query Discussion Page

Must include:

* View query details
* View replies
* Peer/admin replies
* Admin verified answer badge
* Mark query as resolved
* Convert verified answer into FAQ

This page is important because the system is not only a FAQ page. It is a crowd-sourced FAQ generation system.

---

### 5. Admin Verification Flow

Admins can:

* reply to queries
* verify the best answer
* resolve queries
* convert verified replies into FAQs
* moderate discussions where needed

Interns cannot:

* verify answers
* convert replies into FAQs
* perform admin moderation actions

---

# Final MVP Priority

## Tier 1 — Must Work

These features are required for the MVP:

1. FAQ page
2. Smart search
3. Raise query
4. Query discussion
5. Admin verify answer
6. Convert verified answer to FAQ

These are the core product.

Do not compromise these for extra animations or advanced UI features.

---

## Tier 2 — Only If Time Exists

These features are useful but not required for the first working MVP:

* Category bubbles
* Voice-search UI
* SP urgent points
* Trending FAQs
* Recently opened FAQs
* Stats cards
* Pagination
* Sort by relevance dropdown
* Support suggestion card

Build these only after Tier 1 is stable.

---

## Tier 3 — Future Only

These should not be implemented in the MVP:

* Real AI chatbot
* AI-generated answers
* Real LLM integration
* Real-time notifications
* WebSockets
* Advanced analytics
* Autonomous moderation
* Complex admin dashboards
* Multi-level nested replies
* File uploads
* Advanced voice assistant

These can be planned for later versions.

---

# Not Included In MVP

The following should not be implemented in the initial MVP:

* Real AI-generated answers
* LLM integration
* Autonomous moderation
* WebSockets / real-time sync
* Notifications
* File uploads
* Complex moderation workflows
* Multi-level nested replies
* Advanced analytics
* Microservices architecture
* Full chatbot system

Avoid building too much too early.

---

# AI Boundary Clarification

The team may use AI-like UX, but the MVP does not include real AI.

## MVP Does NOT Include

* AI-generated answers
* LLM-based answer generation
* autonomous moderation
* real chatbot intelligence
* real semantic embeddings

## MVP May Simulate AI-Like UX Using

* fuzzy search
* synonym matching
* duplicate detection
* smart FAQ suggestions
* related question recommendations
* autocomplete-style suggestions

This keeps the project practical, stable, and achievable.

---

# User Roles

## Role Simulation (MVP)

During the MVP phase, backend authentication is not available. Role simulation is handled via a single constant:

```ts
// src/features/queries/types/roleSim.ts
export const CURRENT_ROLE: SimulatedRole = 'intern'; // or 'admin'
```

Switching this value controls which UI elements are visible (e.g., Verify and + FAQ buttons). This is **temporary** — a real auth system will replace it in a future phase.

---

## Intern

Can:

* view FAQs
* search FAQs
* filter FAQs
* raise queries
* reply to discussions
* view own queries
* mark own query as resolved

Cannot:

* verify answers
* convert replies into FAQs
* moderate discussions
* perform admin-only actions

---

## Admin

Can:

* view all queries (via Query Review page at `/admin/queries`)
* reply to queries
* verify replies
* convert verified replies into FAQs
* resolve queries
* moderate discussions
* manage FAQ quality

---

# Product Flow

Main product flow:

FAQ Page
→ Search FAQ
→ View Matching FAQ
→ If unresolved, show Similar Solved Questions
→ If still unresolved, show Open Discussions
→ If still unresolved, Raise Query
→ Query Discussion Page
→ Peer/Admin Replies
→ Admin Verifies Best Reply
→ Verified Reply Becomes FAQ

This flow is important because the system should prevent unnecessary duplicate queries.

---

# Search Philosophy

Search is one of the most important parts of this project.

Search should prioritize:

1. Existing FAQs
2. Similar solved questions
3. Open discussions

Only after this should the user create a new query.

Search should feel helpful, not strict.

It should support:

* typos
* short words
* similar meanings
* synonyms
* natural language questions
* category-based filtering

Search should not depend only on exact keyword matching.

---

# Duplicate Prevention Philosophy

Duplicate prevention is a core product requirement.

Before creating a new query, the system should:

1. Search existing FAQs
2. Search solved queries
3. Search open discussions
4. Suggest similar questions
5. Ask the user whether the suggestion solves their problem
6. Allow query creation only if the user still needs help

This reduces:

* repeated questions
* admin workload
* moderation pressure
* confusion for future interns

---

# UI Philosophy

The UI should feel:

* calm
* trustworthy
* beginner-safe
* discussion-oriented
* clean
* fast
* not overwhelming

The product should be visually modern, but not overloaded.

Inspired by:

* WhatsApp simplicity
* Notion clarity
* Stripe Docs structure
* Linear-style clean dashboards
* modern SaaS help centers

Avoid:

* too many buttons
* too many animations
* cluttered dashboards
* confusing layouts
* deeply nested navigation
* overdesigned UI

Animations should support clarity, not distract users.

---

# Visual Design Direction

Preferred style:

* clean white background
* soft yellow or pastel purple accents depending on final theme
* rounded cards
* soft shadows
* clear typography
* lots of whitespace
* modern SaaS dashboard feel
* mobile-first layouts
* accessible contrast

Possible accent themes from team ideas:

* yellow and white student portal style
* pastel purple AI-help-center style using `#7C4DFF`

The final design should stay consistent. Do not mix many unrelated visual styles.

---

# Mobile Safety Philosophy

Mobile responsiveness is not optional.

Every component must:

* avoid horizontal overflow
* support long text wrapping
* support smaller widths safely
* avoid fixed widths where possible
* use responsive spacing
* keep buttons usable on small screens
* keep cards readable on mobile
* prevent text from getting cut

This is critical for project quality.

A feature is not complete unless it works on mobile.

---

# Async UX Philosophy

All async actions must provide:

* loading feedback
* disabled submit states
* error messages
* retry capability where reasonable
* duplicate submission prevention
* success feedback where appropriate

Examples:

* Disable submit button while query is being submitted
* Show loading state while FAQs are being fetched
* Show empty state when no search result exists
* Show retry button after API failure

---

# Tech Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* React Router

## State Management

* Zustand only for shared/global state

## Search

* Fuse.js or lightweight custom fuzzy search logic

## Animation

* Framer Motion only where useful
* animations must remain subtle and purposeful

## Testing

* Vitest or Jest depending on project setup

## Backend

Initial phase:

* mock service layer
* mock data

Future phase:

* REST API architecture

---

# Architecture Decisions

Use feature-based modular architecture.

Recommended structure:

```txt
src/
  features/
    faq/
      components/
      pages/
      services/
      store/
      types/
      utils/
      mocks/
      tests/

    queries/
      components/
      pages/
      services/
      store/
      types/
      utils/
      mocks/
      tests/

    admin/
      components/
      pages/
      services/
      store/
      types/
      utils/

  shared/
    components/
    hooks/
    utils/
    types/
```

---

# Separation Of Concerns

## Components

Components are responsible for:

* UI rendering
* user interaction
* calling hooks or handlers

Components should not:

* contain large business logic
* directly call APIs
* become massive files
* manage unrelated responsibilities

---

## Services

Services are responsible for:

* API communication
* mock data access
* returning typed responses

Example:

```ts
faqService.getFaqs()
queryService.createQuery()
```

Avoid direct `fetch` calls inside components.

---

## Store

Store is responsible for shared state only.

Use Zustand for:

* FAQs
* query list
* selected query
* shared loading/error state
* global search/filter state if needed

Do not use Zustand for:

* temporary form input state
* modal open/close state
* small local UI interactions
* highly local component state

---

## Utils

Utils should contain pure helper functions.

Examples:

```ts
validateQueryForm(data)
rankFaqResults(query, faqs)
formatDate(date)
```

Utils should be easy to test.

---

## Types

Types should be shared, explicit, and reusable.

Example:

```ts
type FAQSource = "existing" | "crowd-sourced";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpfulCount: number;
  source: FAQSource;
};
```

---

# State Management Rules

Use local component state for:

* input typing
* modal visibility
* form values
* simple UI interactions
* temporary dropdown state

Use Zustand for:

* shared FAQ state
* query list
* selected query
* shared search/filter state
* global loading/error state where appropriate

Avoid unnecessary global state.

State should be simple, predictable, and easy to debug.

---

# API Conventions

Use REST conventions.

Example routes:

```txt
GET /faqs
GET /faqs?search=stipend&category=benefits
POST /queries
GET /queries
GET /queries/:queryId
POST /queries/:queryId/replies
PATCH /replies/:replyId/verify
PATCH /queries/:queryId/resolve
POST /faqs/from-reply/:replyId
```

Avoid:

* inconsistent route names
* RPC-style naming
* direct backend logic in frontend components

---

# API Response Contract

All service/API responses should follow a consistent structure:

```ts
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

This improves reliability and makes loading/error handling easier.

---

# FAQ Sources

FAQs may originate from:

1. Existing FAQ system
2. Crowd-sourced verified replies

Use a source field:

```ts
source: "existing" | "crowd-sourced";
```

This helps users trust the answer and helps admins understand where content came from.

---

# Main Pages

## 1. FAQ Page

Purpose:

Help users find existing answers quickly.

Recommended features:

* smart search bar
* FAQ list/accordion
* category filter
* FAQ source label
* helpful count
* empty state
* loading/error states

Optional future enhancements:

* category bubbles
* voice-search UI
* recently opened FAQs
* trending FAQs
* stats cards
* pagination
* autocomplete dropdown

---

## 2. Raise Query Page

Purpose:

Allow users to create a query only after existing answers are suggested.

Required:

* title
* description
* category
* tags
* validation
* submit button
* duplicate prevention
* loading/error/success states

Recommended duplicate-prevention flow:

1. User types question
2. System searches FAQs
3. System searches similar queries
4. System shows suggestions
5. User confirms they still need help
6. Query is created

---

## 3. Query Discussion Page

Purpose:

Allow discussion around a raised query.

Required:

* query details
* replies
* admin verified answer badge
* resolved status
* reply form
* convert verified answer into FAQ

---

## 4. My Questions / Track My Issue Page

Purpose:

Allow users to track their own raised queries.

Recommended:

* question cards
* status badges
* timestamps
* latest reply preview
* clean responsive layout

Statuses may include:

* open
* answered
* resolved
* verified
* closed

---

## 5. Admin Review Page (Query Review)

Purpose:

Allow admins to manage query quality and answer verification.

Route: `/admin/queries`

Features:

* list of all queries (grouped by status)
* link to each query's discussion page
* on the discussion page: verify reply, convert verified reply to FAQ

This can be basic in MVP.

---

# Reliability Requirements

The product must handle:

* loading states
* API failures
* retry flows
* duplicate submission prevention
* long text overflow
* mobile responsiveness
* empty states
* invalid form input
* slow network behavior
* repeated button clicks

No major user action should fail silently.

---

# Accessibility Requirements

Use:

* semantic HTML
* accessible buttons
* labels for form inputs
* keyboard-friendly interactions
* visible focus states
* semantic headings
* screen-reader-friendly labels where reasonable

Avoid:

* inaccessible click-only divs
* removing focus outlines without replacement
* unlabeled inputs
* buttons without clear purpose

---

# Animation Rules

Animations are allowed, but they must be controlled.

Animations should:

* support clarity
* remain subtle
* avoid layout instability
* avoid excessive motion
* improve feedback

Do not animate everything.

Use Framer Motion only when it improves the user experience.

Examples of acceptable animation:

* accordion expand/collapse
* search suggestion dropdown
* gentle hover feedback
* modal entrance
* loading indicator

Avoid:

* constant floating effects everywhere
* distracting glowing elements
* slow transitions
* animations that make layout jump

---

# Performance Requirements

Avoid premature optimization, but keep the app efficient.

Search should:

* debounce input
* avoid unnecessary filtering
* avoid recomputing large lists repeatedly
* prioritize FAQ results first
* remain fast for 100–200 FAQs

Use memoization carefully only when needed.

---

# Definition Of Done

A feature is considered complete only if:

* TypeScript passes
* responsive UI is verified
* mobile layout is checked
* loading state exists
* error state exists
* empty state exists where needed
* no console errors exist
* no console warnings exist
* architecture rules are respected
* components remain maintainable
* repeated submissions are prevented
* long text does not break layout
* unrelated files are not modified

---

# Current Implementation Status

Current phase:

* Tier 1 feature implementation — feature/day-3-discussion-admin-polish

## Completed

* MVP direction defined
* context document drafted
* engineering standards drafted
* teammate feature ideas collected
* priority tiers defined
* project scaffold (React + TypeScript + Vite + Tailwind)
* FAQ feature — full implementation
  * types, service layer, mock data (26 realistic Samagama/VINS internship FAQs)
  * smart search with synonym expansion, fuzzy/typo tolerance, ranking
  * category filter, search bar, accordion UI
  * loading, error, empty states
* FAQ mock data uses realistic Samagama/VINS-style internship content:
  * Samagama portal login, profile setup, CV upload, interview link issues
  * Laptop/desktop requirements, NOC submission, offer acceptance
  * Online vs offline mode, mentor/sync sessions
  * Project/GitHub submission, certificate timeline, stipend and leave
  * Support and escalation process
  * No scraped or confidential data — all content is official-style and beginner-friendly
* Raise Query feature
  * form, validation, duplicate detection, FAQ + similar query suggestions
  * loading/error/success states
* My Questions page — tracks user's own queries
* Query Discussion page — replies, verified answer badge, reply form
  * Reply submission errors shown to user via visible error banner
* Admin Query Review page at `/admin/queries`
  * lists all queries grouped by status
  * links to discussion page for each query
* Admin reply actions (Verify + Convert to FAQ)
  * Verify button marks a reply as verified (verified replies float to top)
  * + FAQ button opens inline dialog, pre-fills question from reply body
  * Convert creates a new FAQ via `adminService.convertReplyToFaq()`
* Role-based navigation and route guards
  * Intern nav: FAQs, Raise Query, My Questions — Query Review hidden
  * Admin nav: FAQs, Query Review — Raise Query and My Questions hidden
  * Route-level guards: interns redirected from `/admin/queries` → `/faqs`
  * Route-level guards: admins redirected from `/queries/raise` and `/queries/my` → `/admin/queries`
  * Root `/` redirects to `/queries/raise` (intern) or `/admin/queries` (admin)
* Helpful button on FAQ answers — visible to interns, hidden for admins

## Mock / Local Data (MVP)

All data during MVP phase is mock/local only. No backend integration yet.

* `faq.mock.ts` — static seed FAQs (26 realistic Samagama/VINS FAQs, source: "existing") + session-scoped converted FAQs (source: "crowd-sourced")
* `query.mock.ts` — static seed queries
* `reply.mock.ts` — static seed replies + session-scoped new replies
* `queryService`, `replyService`, `adminService`, `faqMockService` — mock service layers

FAQ source rules:
* `source: "existing"` — official/preloaded FAQs from `faq.mock.ts`
* `source: "crowd-sourced"` — FAQs converted from verified replies at runtime

No private links, credentials, mentor phone numbers, personal emails, or confidential data are stored.

## Backend Integration Plan

When a real backend is available, replace only the service and mock files:

| Replace this | With this |
|---|---|
| `queryService.ts` | `GET /queries`, `GET /queries/:id`, `POST /queries` |
| `replyService.ts` | `GET /queries/:id/replies`, `POST /queries/:id/replies` |
| `adminService.ts` | `POST /admin/replies/:id/verify`, `POST /admin/replies/:id/convert` |
| `faq.mock.ts` | `GET /faqs`, `GET /faqs/search?q=` |

Pages and components (`QueryDiscussionPage`, `ReplyCard`, `AdminConvertToFaqDialog`, etc.) do **not** need changes — they consume `ApiResponse<T>` from services and remain UI-only.

**Note:** Add-to-FAQ logic lives entirely in `adminService.convertReplyToFaq()`. The UI calls the service and renders the result. Backend integration replaces only the service body, not the call chain.

## Pending

* real backend integration (service layer and mock files to be replaced only)
* Zustand integration (when shared state is needed)

---

# Known Assumptions

* Existing FAQs will initially be added as mock/seed data
* Backend may not exist initially
* Mock service layer will be used first
* Real-time updates are not part of MVP
* Real AI is not part of MVP
* Mobile-first responsiveness is required
* Admin role is simulated via `roleSim.ts` during MVP (no backend auth)

---

# Team Workflow

Recommended workflow:

1. Start from stable architecture
2. Create a focused feature branch
3. Build one feature at a time
4. Use mock data first
5. Keep components small
6. Test mobile layout
7. Review before merge
8. Update documentation after major decisions

---

# Branching Strategy

Use separate branches for focused work.

Examples:

```txt
feature/faq-page
feature/smart-search
feature/raise-query
feature/query-discussion
feature/admin-verification
feature/day-3-discussion-admin-polish
fix/mobile-overflow
experiment/category-bubbles
```

Every branch should:

* solve one focused problem
* remain reviewable
* avoid unrelated changes
* avoid unstable changes in main

---

# Prompt Governance

When using AI tools such as Minimax/OpenClaw, prompts must be controlled.

Never ask AI to:

* rewrite the entire architecture unnecessarily
* rebuild unrelated modules
* generate massive monolithic files
* add unrequested features
* change many parts of the app at once
* ignore existing project structure

Prefer prompts that are:

* incremental
* specific
* architecture-aware
* TypeScript-safe
* mobile-safe
* easy to review

Bad prompt:

```txt
Create the full app with all features.
```

Good prompt:

```txt
Create the FAQ page UI only using the existing feature-based structure. Use strict TypeScript, Tailwind CSS, mock data from the faq service, mobile-safe layout, loading/error/empty states, and do not modify unrelated files.
```

---

# Future Scope

Possible future improvements:

* real backend integration
* real authentication
* real admin dashboard
* notifications
* real-time discussion updates
* AI-assisted FAQ suggestions
* voice search implementation
* rich text replies
* screenshot attachments
* advanced moderation
* analytics dashboard
* search ranking improvements
* chatbot integration

These should only be added after the MVP is stable.

---

# Architecture Freeze Philosophy

Avoid changing architecture frequently.

A stable architecture is better than constantly chasing new patterns.

Once the folder structure, state boundaries, service layer, and API conventions are decided, they should not be changed without a strong reason.

Project quality comes from consistency.

---

# Important Engineering Philosophy

The goal is not:

* maximum code generation
* maximum features
* maximum animations
* building everything at once

The goal is:

* stable architecture
* maintainable code
* scalable structure
* reliable user experience
* strict TypeScript
* mobile-safe UI
* controlled prompts
* disciplined branching
* incremental development

Your project quality will come from small, correct, maintainable steps — not from adding more features too early.