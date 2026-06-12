// ============================================================
// useFaqSearch — fetches FAQs, applies debounce, smart search, and category filter
// Returns { faqs, loading, error, retry }
// ============================================================

import { useState, useEffect } from 'react';
import { getFaqs, markFaqHelpful } from '../services/faqService';
import { searchFaqs, filterByCategory } from '../utils/faqSearchUtils';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import type { FAQ } from '../types/faq.types';

export interface UseFaqSearchOptions {
  debounceMs?: number;
}

export interface UseFaqSearchResult {
  faqs: FAQ[];
  loading: boolean;
  error: string | null;
  retry: () => void;
  markHelpful: (id: string) => Promise<boolean>;
}

export function useFaqSearch(
  search: string,
  category: string,
  options: UseFaqSearchOptions = {}
): UseFaqSearchResult {
  const { debounceMs = 300 } = options;
  const [allFaqs, setAllFaqs] = useState<FAQ[]>([]);
  const [helpfulFaqIds, setHelpfulFaqIds] = useState<Set<string>>(() => new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search, debounceMs);

  // Fetch all FAQs from service on mount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const response = await getFaqs();

      if (!cancelled) {
        if (response.success && response.data) {
          setAllFaqs(response.data);
        } else {
          setError(response.error ?? 'Unknown error loading FAQs.');
        }
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Apply category filter + smart search (synchronous, runs on debounced input)
  const filtered = (() => {
    if (loading) return [];
    const categoryFiltered = filterByCategory(allFaqs, category);
    return searchFaqs(categoryFiltered, debouncedSearch);
  })();

  function retry() {
    setAllFaqs([]);
    setLoading(true);
    setError(null);
    getFaqs().then((response) => {
      if (response.success && response.data) {
        setAllFaqs(response.data);
      } else {
        setError(response.error ?? 'Unknown error loading FAQs.');
      }
      setLoading(false);
    });
  }

  async function markHelpful(id: string): Promise<boolean> {
    if (helpfulFaqIds.has(id)) return false;

    // Update the displayed count immediately and remember this vote for the current session.
    setHelpfulFaqIds((current) => new Set(current).add(id));
    setAllFaqs((current) =>
      current.map((faq) =>
        faq.id === id ? { ...faq, helpfulCount: faq.helpfulCount + 1 } : faq,
      ),
    );

    // Persist when the backend is available. The local count remains usable for the MVP session.
    await markFaqHelpful(id);
    return true;
  }

  return { faqs: filtered, loading, error, retry, markHelpful };
}
