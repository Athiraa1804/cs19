// ============================================================
// faqSearchUtils — lightweight smart search without Fuse.js
// Handles: synonym expansion, fuzzy/typo tolerance, ranking
// ============================================================

import type { FAQ } from '../types/faq.types';

// ── Synonym map ──────────────────────────────────────────────
// Maps common query words → the terms that should match in FAQ text
const SYNONYMS: Record<string, string[]> = {
  money: ['stipend', 'salary', 'pay', 'payment', 'income', 'financial'],
  'work from home': ['wfh', 'remote', 'home', 'hybrid', 'online'],
  'work from anywhere': ['wfh', 'remote', 'home', 'hybrid', 'online'],
  'how long': ['duration', 'timeline', 'months', 'tenure', 'length'],
  'joining internship': ['joining', 'accept', 'offer', 'onboarding', 'start'],
  'joining': ['joining', 'accept', 'offer', 'onboarding', 'start'],
  certificate: ['certificate', 'completion', 'completion letter', 'document'],
  completion: ['certificate', 'completion', 'completion letter', 'document'],
  pay: ['stipend', 'salary', 'payment', 'money'],
  salary: ['stipend', 'salary', 'pay', 'payment', 'money'],
  wfh: ['wfh', 'remote', 'work from home', 'hybrid', 'online'],
  remote: ['remote', 'wfh', 'work from home', 'hybrid', 'online'],
  stipend: ['stipend', 'salary', 'pay', 'payment', 'money'],
  leave: ['leave', 'holiday', 'sick', 'time off', 'pto'],
  holiday: ['leave', 'holiday', 'sick', 'time off', 'pto'],
  'time off': ['leave', 'holiday', 'sick', 'time off', 'pto'],
  'sick leave': ['leave', 'holiday', 'sick', 'time off', 'pto'],
  project: ['project', 'assignment', 'task', 'work', 'allocation'],
  badge: ['badge', 'gamification', 'earn', 'achievement', 'skills'],
  tax: ['tax', 'tds', 'income', 'salary', 'financial'],
  laptop: ['laptop', 'equipment', 'software', 'setup', 'requirements'],
  software: ['software', 'tools', 'laptop', 'setup', 'requirements'],
  manager: ['manager', 'unavailable', 'leave', 'escalate'],
};

// ── Normalise text ──────────────────────────────────────────
function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Score one FAQ against a query ──────────────────────────
// Returns 0 if no match, positive integer if matched (higher = better)
function scoreFaq(faq: FAQ, queryWords: string[]): number {
  const searchableText = normalise(
    [faq.question, faq.answer, faq.category, ...faq.tags].join(' ')
  );

  let score = 0;

  for (const word of queryWords) {
    // Expand via synonyms
    const expansionSet = new Set<string>([word]);
    const lowerWord = word.toLowerCase();
    if (SYNONYMS[lowerWord]) {
      SYNONYMS[lowerWord].forEach((s) => expansionSet.add(s));
    }
    // Also add the word as a key into synonyms (reverse lookup)
    for (const [key, vals] of Object.entries(SYNONYMS)) {
      if (vals.includes(lowerWord)) expansionSet.add(key);
    }

    // Check if any expanded term appears in the searchable text
    let wordMatched = false;
    for (const term of expansionSet) {
      if (searchableText.includes(term)) {
        wordMatched = true;
        break;
      }
    }

    if (!wordMatched) return 0; // all words must match

    // Bonus points
    if (faq.question.toLowerCase().includes(lowerWord)) score += 3;
    if (faq.category.toLowerCase().includes(lowerWord)) score += 2;
    if (faq.tags.some((t) => t.toLowerCase().includes(lowerWord))) score += 1;
    score += 0.5; // base score per matched word
  }

  return score;
}

// ── Fuzzy match — checks if query approximately appears in text ─
function fuzzyMatch(query: string, text: string): boolean {
  const q = normalise(query);
  const t = normalise(text);

  // Exact match
  if (t.includes(q)) return true;

  // Split query into words — each must appear somewhere in text
  const queryWords = q.split(' ').filter(Boolean);
  if (queryWords.length === 0) return false;

  return queryWords.every((w) => {
    // Check exact or with one character typo tolerance (Levenshtein)
    if (t.includes(w)) return true;
    // Simple typo tolerance: word is present if all chars exist in sequence
    // with at most len(word) / 3 characters wrong
    const threshold = Math.max(1, Math.floor(w.length / 3));
    return fuzzyContains(t, w, threshold);
  });
}

// Very lightweight Levenshtein-based fuzzy check
function fuzzyContains(text: string, word: string, maxDistance: number): boolean {
  for (let i = 0; i <= text.length - word.length; i++) {
    const substring = text.slice(i, i + word.length);
    if (levenshteinDistance(substring, word) <= maxDistance) return true;
  }
  return false;
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ── Main search function ────────────────────────────────────
export function searchFaqs(faqs: FAQ[], query: string): FAQ[] {
  if (!query.trim()) return faqs;

  const lowerQuery = query.toLowerCase().trim();

  // Multi-word phrase pre-check: try the full phrase as a map key first.
  // This ensures "time off", "sick leave", "work from home" etc. expand
  // correctly instead of being silently split into meaningless individual words.
  const queryWords = SYNONYMS[lowerQuery]
    ? [lowerQuery]
    : query
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 1);

  if (queryWords.length === 0) return faqs;

  // First: synonym-expanded scoring match
  const scored: Array<{ faq: FAQ; score: number }> = [];
  for (const faq of faqs) {
    const s = scoreFaq(faq, queryWords);
    if (s > 0) scored.push({ faq, score: s });
  }

  // Fallback: fuzzy match for natural language queries
  if (scored.length === 0) {
    for (const faq of faqs) {
      if (fuzzyMatch(query, faq.question) || fuzzyMatch(query, faq.answer)) {
        scored.push({ faq, score: 0.5 });
      }
    }
  }

  // Sort: highest score first, then by helpfulCount as tiebreaker
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.faq.helpfulCount - a.faq.helpfulCount;
  });

  return scored.map((s) => s.faq);
}

// ── Filter FAQs by category ─────────────────────────────────
export function filterByCategory(faqs: FAQ[], category: string): FAQ[] {
  if (!category || category === 'All') return faqs;
  return faqs.filter((f) => f.category === category);
}

// ── Get all unique categories ───────────────────────────────
export function getAllCategories(faqs: FAQ[]): string[] {
  const cats = Array.from(new Set(faqs.map((f) => f.category)));
  return ['All', ...cats.sort()];
}

// ── Rank results (tiebreaker for same score) ───────────────
export function rankFaqs(faqs: FAQ[]): FAQ[] {
  return [...faqs].sort((a, b) => b.helpfulCount - a.helpfulCount);
}