# ENGINEERING_STANDARDS.md

# Engineering Standards

## Project

Crowd-Sourced FAQ Generation System for Vicharanashala Internship

This document defines how the project should be built.

`CONTEXT.md` explains **what we are building**.
`ENGINEERING_STANDARDS.md` explains **how we should build it safely**.

These rules must be followed by all contributors and by AI coding tools such as Minimax/OpenClaw.

---

# Core Engineering Philosophy

This project prioritizes:

* maintainability
* readability
* modularity
* scalability
* reliability
* strict TypeScript
* mobile-safe UI
* beginner-friendly architecture
* incremental development

Avoid overengineering.

The goal is not to generate the maximum amount of code.

The goal is to build a stable, understandable, and reliable MVP.

---

# Product-Aligned Engineering Priorities

Engineering decisions must support the product principles from `CONTEXT.md`.

The system should be:

* FAQ-first
* duplicate-prevention focused
* beginner-friendly
* low cognitive load
* mobile responsive
* reliable under loading/error states
* easy for another developer to understand

Every technical decision should help users find answers faster and reduce repeated questions.

---

# Final MVP Priority Rules

## Tier 1 — Must Work First

The following must be implemented before extra features:

1. FAQ page
2. Smart search
3. Raise query
4. Query discussion
5. Admin verify answer
6. Convert verified answer to FAQ

Do not prioritize animations, dashboards, or advanced UI features before these are working.

---

## Tier 2 — Only If Time Exists

Build only after Tier 1 is stable:

* category bubbles
* voice-search UI
* SP urgent points
* trending FAQs
* recently opened FAQs
* stats cards
* pagination
* sort by relevance
* support suggestion cards

---

## Tier 3 — Future Only

Do not implement in the MVP:

* real AI chatbot
* AI-generated answers
* LLM integration
* real-time notifications
* WebSockets
* advanced analytics
* autonomous moderation
* complex admin dashboards
* multi-level nested replies
* file uploads

---

# TypeScript Standards

Use strict TypeScript.

## Rules

* Never use `any`
* Prefer explicit interfaces/types
* Use typed props for every component
* Use typed service responses
* Use typed store state
* Use typed API/mock data
* Prefer reusable shared types
* Avoid unclear object shapes

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

Bad:

```ts
const faq: any = {};
```

Good:

```ts
const faq: FAQ = {
  id: "1",
  question: "What is VINS?",
  answer: "VINS is...",
  category: "Getting Started",
  tags: ["internship", "vins"],
  helpfulCount: 0,
  source: "existing",
};
```

---

# Component Standards

## Components Must

* be small and focused
* have one clear responsibility
* use typed props
* be reusable where reasonable
* be mobile responsive
* handle long text safely
* avoid deeply nested logic
* avoid direct API calls
* avoid large business logic

Preferred:

* components under around 200 lines where possible
* split earlier if a file becomes hard to understand

---

## Components Should NOT

Components should not:

* directly call APIs
* contain large business logic
* contain search ranking logic
* contain validation logic
* manage unrelated features
* become massive monolithic files
* mix admin, FAQ, and query logic in one file

Bad:

```txt
FaqPage.tsx contains:
- FAQ UI
- API calls
- search algorithm
- validation
- modal logic
- admin conversion logic
```

Good:

```txt
FaqPage.tsx
FaqSearchBar.tsx
FaqList.tsx
FaqAccordionItem.tsx
faqService.ts
faqSearchUtils.ts
faqTypes.ts
```

---

# Component Splitting Rules

If a component becomes too large, split it into:

* UI sections
* smaller presentational components
* custom hooks
* helper functions
* service functions
* utility functions

Example:

```txt
features/faq/
  pages/
    FAQPage.tsx
  components/
    FaqSearchBar.tsx
    FaqCategoryFilter.tsx
    FaqList.tsx
    FaqAccordionItem.tsx
    FaqEmptyState.tsx
  hooks/
    useFaqSearch.ts
  utils/
    faqSearchUtils.ts
```

Avoid “god components”.

A god component is a file that tries to do everything.

---

# Folder Structure Standards

Use feature-based architecture.

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

Do not randomly place feature files anywhere.

Keep related files close to their feature.

---

# Separation Of Concerns

## Components

Responsible for:

* UI rendering
* user interaction
* calling hooks/handlers

Not responsible for:

* API communication
* business rules
* search ranking algorithms
* validation logic
* global state design

---

## Services

Responsible for:

* API communication
* mock data access
* returning typed responses
* hiding implementation details from components

Example:

```ts
faqService.getFaqs()
queryService.createQuery()
queryService.getSimilarQueries()
```

Components should call services through hooks or handlers, not directly contain fetch logic.

---

## Utils

Responsible for pure helper logic.

Examples:

```ts
validateQueryForm(data)
rankFaqResults(query, faqs)
formatDate(date)
normalizeSearchText(text)
```

Utils should be testable and not depend on React.

---

## Hooks

Responsible for reusable UI/business behavior.

Examples:

```ts
useFaqSearch()
useQuerySubmission()
useDebouncedValue()
```

Hooks may connect components with services, stores, and utilities.

---

## Types

Responsible for reusable TypeScript definitions.

Types should be shared only when genuinely reused.

Avoid duplicate type definitions across files.

---

# State Management Standards

Use the simplest state possible.

## Use Local State For

* form inputs
* textarea values
* modal open/close state
* dropdown open/close state
* temporary selected UI item
* local loading for one button
* small UI interactions

---

## Use Zustand For

Use Zustand only for shared/global state such as:

* FAQ list
* query list
* selected query
* shared search/filter state if needed
* global loading/error state if multiple components need it
* logged-in user role if applicable

---

## Zustand Safety Rules

Do not store the following in Zustand:

* temporary form state
* modal open state
* small local hover states
* one-component dropdown state
* highly local interactions
* unnecessary derived data

Bad:

```ts
useAppStore.setState({ queryTextareaValue: "..." });
```

Good:

```ts
const [description, setDescription] = useState("");
```

Keep global state minimal and predictable.

---

# Service Layer Standards

All API or mock data access must go through services.

Example:

```ts
faqService.getFaqs()
queryService.createQuery()
adminService.verifyReply()
```

Avoid:

```ts
fetch("/api/faqs")
```

directly inside a component.

Services should:

* return typed responses
* handle mock data initially
* later allow easy backend replacement
* keep components clean

---

# API Response Contract Rules

All API/service responses should follow a consistent structure:

```ts
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

Example:

```ts
type GetFaqsResponse = ApiResponse<FAQ[]>;
```

Benefits:

* consistent loading/error handling
* fewer unexpected response shapes
* easier service testing
* easier backend integration later

---

# API Standards

Use REST conventions.

Recommended routes:

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
* RPC-style routes
* backend logic inside frontend components
* duplicate fetch logic

Bad:

```txt
POST /doVerifyReplyNow
```

Good:

```txt
PATCH /replies/:replyId/verify
```

---

# Mock Data Standards

Initial development may use mock data.

Mock data should:

* follow real TypeScript types
* stay inside feature `mocks/` folders
* resemble realistic FAQ/query data
* include edge cases

Mock data should include:

* long questions
* long answers
* empty categories
* different statuses
* existing FAQs
* crowd-sourced FAQs
* open queries
* resolved queries
* verified replies

This helps test UI safely before backend integration.

---

# Search Standards

Search is a core feature.

Search must support the product’s FAQ-first and duplicate-prevention philosophy.

## Search Priority

Search results should prioritize:

1. Existing FAQs
2. Similar solved questions
3. Open discussions

Only after showing these should the user be encouraged to raise a new query.

---

## Search Behavior

Search should support:

* fuzzy matching
* typo tolerance
* synonyms
* similar meanings
* short natural queries
* ranking by relevance

Examples:

* "money" → stipend FAQ
* "work from home" → remote/offline FAQ
* "how long" → internship duration FAQ
* "joining internship" → acceptance/joining FAQ

---

## Search Implementation

Recommended:

* Fuse.js
* simple synonym dictionary
* lightweight ranking logic
* local search over mock data first

Do not implement real AI/LLM search in MVP.

---

# Search Performance Rules

Search implementation must:

* debounce input
* avoid unnecessary filtering
* avoid recomputing large lists repeatedly
* prioritize FAQ results first
* remain fast for 100–200 FAQs
* avoid expensive logic on every keystroke

Use memoization carefully only when useful.

Example:

```ts
const debouncedSearchTerm = useDebouncedValue(searchTerm, 250);
```

---

# Duplicate Prevention Standards

Before creating a new query, the system should:

1. Search existing FAQs
2. Search similar solved queries
3. Search open discussions
4. Suggest related answers
5. Ask whether the suggestion solves the user’s problem
6. Allow query creation only if the user still needs help

This logic should not be hardcoded inside one large component.

Recommended files:

```txt
features/queries/
  utils/
    duplicateDetectionUtils.ts
  services/
    queryService.ts
```

---

# Validation Standards

Validation logic should:

* use pure functions
* remain testable
* stay separate from UI
* return clear error messages
* prevent invalid submissions
* prevent duplicate submissions

Example:

```ts
validateQueryForm(data)
```

Validation should check:

* title is not empty
* description is not empty
* category is selected
* text length limits
* repeated submissions are blocked

---

# UI/UX Standards

The UI should feel:

* minimal
* fast
* clean
* calm
* trustworthy
* beginner-safe
* mobile-first
* discussion-oriented
* low cognitive load

Inspired by:

* WhatsApp simplicity
* Notion clarity
* Stripe Docs structure
* Linear-style clean dashboards
* modern SaaS help centers

Avoid:

* clutter
* too many buttons
* too many animations
* deeply nested navigation
* overdesigned UI
* confusing dashboards

---

# UI Consistency Rules

Use shared styles for:

* spacing
* buttons
* inputs
* cards
* badges
* status labels
* empty states
* loading states
* error states

Avoid random styling in every component.

Preferred:

```txt
shared/components/Button.tsx
shared/components/Input.tsx
shared/components/Card.tsx
shared/components/Badge.tsx
shared/components/EmptyState.tsx
```

Do not create five different button styles unless needed.

---

# Theme Standards

The final visual theme must remain consistent.

Team ideas include:

* yellow and white student portal style
* pastel purple AI help-center style using `#7C4DFF`

Choose one consistent visual direction for the final app.

Do not mix many unrelated color systems.

Use Tailwind classes consistently.

Avoid random colors in individual components.

---

# Mobile Safety Standards

Mobile responsiveness is not optional.

Every component must:

* avoid horizontal overflow
* support long text wrapping
* support smaller widths safely
* avoid fixed widths where possible
* use responsive spacing
* keep buttons usable on small screens
* keep cards readable on mobile
* prevent text from being cut
* avoid layout breaking on narrow screens

Use:

```txt
min-w-0
break-words
overflow-hidden carefully
flex-wrap
max-w-full
w-full
```

Avoid:

```txt
fixed large widths
unbreakable text containers
desktop-only layouts
```

A feature is not complete unless it works on mobile.

---

# Async UX Standards

Every important async flow must include:

* loading state
* error state
* empty state where needed
* success feedback where appropriate
* disabled submit state
* duplicate submission prevention
* retry option where reasonable

Examples:

* Disable submit button while query is submitting
* Show loading skeleton/spinner while FAQs load
* Show empty state when search returns nothing
* Show retry button when FAQ loading fails
* Prevent double-click duplicate query creation

No important action should fail silently.

---

# Required UI States

Every major page must consider:

* loading state
* error state
* empty state
* success state
* long-content state
* mobile state

Pages include:

* FAQ page
* Raise Query page
* Query Discussion page
* My Questions / Track My Issue page
* Admin Review page

---

# Accessibility Standards

Use:

* semantic HTML
* semantic headings
* accessible buttons
* labels for form inputs
* keyboard-friendly interactions
* visible focus states
* screen-reader-friendly labels where reasonable

Must support:

* keyboard navigation
* focus visibility
* form labels
* meaningful button text
* accessible modal behavior where possible

Avoid:

* inaccessible click-only divs
* unlabeled inputs
* removing focus outlines without replacement
* icon-only buttons without labels
* buttons with unclear purpose

Bad:

```tsx
<div onClick={handleSubmit}>Submit</div>
```

Good:

```tsx
<button type="submit" onClick={handleSubmit}>
  Submit query
</button>
```

---

# Animation Standards

Animations should:

* enhance clarity
* remain subtle
* avoid layout instability
* avoid excessive motion
* improve feedback

Do not animate everything.

Use Framer Motion only when it improves UX.

Acceptable animations:

* accordion expand/collapse
* search dropdown appearance
* modal entrance
* subtle hover feedback
* loading feedback

Avoid:

* constant floating effects everywhere
* excessive glowing elements
* distracting pulses
* slow transitions
* animations that make layout jump

---

# Performance Standards

Avoid premature optimization.

Optimize only when needed.

Watch for:

* unnecessary re-renders
* large list rendering
* expensive search calculations
* repeated filtering on every keystroke
* unnecessary global state updates

Use carefully:

* `useMemo`
* `useCallback`
* debouncing
* pagination
* list slicing

Do not add performance complexity before there is a real need.

---

# Testing Standards

## Unit Tests

Should cover:

* validation functions
* utility functions
* search ranking helpers
* duplicate detection helpers
* permission helpers

---

## Integration Tests

Should cover:

* FAQ search flow
* query submission flow
* duplicate suggestion flow
* reply flow
* admin verification flow
* FAQ conversion flow

---

## Manual QA

Must check:

* mobile responsiveness
* loading states
* error states
* empty states
* role-based UI
* long text wrapping
* duplicate submission prevention
* no horizontal overflow
* no console errors

---

# Security Standards

Never:

* hardcode secrets
* trust frontend permissions
* expose sensitive data
* rely only on frontend role checks
* store API keys in source code

Always:

* use environment variables
* validate inputs
* enforce permissions in backend
* sanitize user-generated content where needed
* keep admin actions protected

Frontend role checks are for UI only.

Backend must enforce real permissions later.

---

# Role-Based UI Standards

Interns can:

* view FAQs
* search FAQs
* raise queries
* reply to discussions
* view own queries
* mark own query resolved

Admins can:

* reply to queries
* verify replies
* convert verified replies to FAQs
* resolve queries
* moderate discussions

UI should not show admin actions to interns.

But security must not depend only on hiding buttons.

---

# Error Handling Standards

Errors should be:

* clear
* user-friendly
* specific enough to help
* not overly technical
* visible near the failed action

Bad:

```txt
Something went wrong.
```

Better:

```txt
We could not submit your query. Please check your connection and try again.
```

Developer errors may be logged in development, but the user-facing message should remain simple.

---

# Empty State Standards

Every empty state should guide the user.

Examples:

FAQ search empty state:

```txt
No matching FAQ found. Try different words or check similar solved questions.
```

My Questions empty state:

```txt
You have not raised any queries yet. Search FAQs first, then raise a query if you still need help.
```

Admin empty state:

```txt
No queries are waiting for verification.
```

---

# Documentation Standards

Update `CONTEXT.md` after:

* architecture decisions
* major feature additions
* state management changes
* API changes
* MVP scope changes
* role/permission changes

Update `ENGINEERING_STANDARDS.md` after:

* coding standards change
* folder structure changes
* testing standards change
* workflow rules change
* AI prompt rules change

README should stay beginner-friendly and explain:

* project setup
* install commands
* run commands
* build commands
* folder overview
* contribution workflow

---

# Prompt Standards For Minimax/OpenClaw

Every major AI prompt should include:

* instruction to read `CONTEXT.md`
* instruction to read `ENGINEERING_STANDARDS.md`
* specific feature scope
* files allowed to modify
* architecture expectations
* strict TypeScript requirement
* mobile responsiveness requirement
* loading/error/empty state requirement
* instruction to avoid unrelated changes

---

## Standard Prompt Prefix

Use this before feature prompts:

```txt
Before coding, read CONTEXT.md and ENGINEERING_STANDARDS.md.

Follow them strictly.

Do not rewrite the whole app.
Do not change the architecture unless necessary.
Do not create massive monolithic files.
Do not add unrequested features.
Do not modify unrelated files.

Work only on the requested feature.
Use strict TypeScript.
Keep components small and mobile responsive.
Use the service layer for data access.
Use Zustand only for shared state.
Include loading, error, and empty states where needed.
```

---

# Prompt Governance Rules

Never ask AI to:

* rewrite the entire architecture unnecessarily
* rebuild unrelated modules
* generate massive monolithic files
* add unrequested features
* change many parts of the app at once
* ignore existing project structure
* implement Tier 2/Tier 3 before Tier 1
* add real AI/LLM features in MVP

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
Create only the FAQ page UI using the existing feature-based structure. Use strict TypeScript, Tailwind CSS, mock data from faqService, mobile-safe layout, loading/error/empty states, and do not modify unrelated files.
```

---

# Branching Standards

Use branches for focused work.

Allowed branch types:

```txt
feature/*
fix/*
experiment/*
docs/*
```

Examples:

```txt
feature/faq-page
feature/smart-search
feature/raise-query
feature/query-discussion
feature/admin-verification
fix/mobile-overflow
experiment/category-bubbles
docs/update-context
```

Every feature branch should:

* solve one focused problem
* remain reviewable
* avoid mixing unrelated changes
* avoid unstable experiments in main

---

# Git Rules

Before starting new work:

```txt
git checkout main
git pull
git checkout -b feature/feature-name
```

Before committing:

```txt
git status
npm run build
```

Commit only related files.

Avoid committing:

* unrelated formatting changes
* broken experiments
* temporary files
* console logs
* generated junk files

---

# Sandbox / Experiment Workflow

Use experiment branches or sandbox folders for risky AI-generated ideas.

Use this for:

* category bubbles
* advanced animations
* voice-search UI
* SP urgent points
* new layouts
* major design experiments

Do not merge experiments into main until reviewed.

---

# Architecture Freeze Philosophy

Avoid changing architecture frequently.

A stable architecture is better than constantly chasing new patterns.

Once decided, avoid changing:

* folder structure
* state boundaries
* service layer pattern
* API response contract
* TypeScript style
* core routing structure

Change architecture only if there is a strong reason.

Consistency is more valuable than novelty.

---

# Merge Checklist

Before merging any branch, confirm:

* `npm run build` passes
* no TypeScript errors
* no console errors
* no console warnings
* mobile layout checked
* no horizontal overflow
* loading states tested
* error states tested
* empty states tested
* duplicate submission prevention checked
* unrelated files not modified
* components are maintainable
* service layer is respected
* Zustand is not misused
* feature matches `CONTEXT.md`
* code follows `ENGINEERING_STANDARDS.md`

---

# Review Questions Before Merge

Ask:

1. Is this maintainable?
2. Is this understandable?
3. Is this overengineered?
4. Is mobile UX safe?
5. Are edge cases handled?
6. Is logic separated properly?
7. Is TypeScript strict?
8. Can another developer understand this quickly?
9. Does this support the FAQ-first philosophy?
10. Does this reduce duplicate questions?
11. Did we avoid unrelated changes?
12. Did we avoid adding future-scope features too early?

---

# Definition Of Done

A feature is complete only if:

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
* service layer is used correctly
* Zustand is used only where appropriate
* unrelated files are not modified
* feature aligns with `CONTEXT.md`

---

# Final Engineering Goal

The goal is not:

* more prompts
* more animations
* more features
* massive generated code
* building everything at once

The goal is:

* stable architecture
* small maintainable components
* strict TypeScript
* mobile-safe UI
* reliable user experience
* controlled AI prompts
* disciplined branching
* incremental development


