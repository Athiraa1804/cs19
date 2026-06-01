// ============================================================
// useFaqSearch — fetches FAQs, applies debounce, smart search, and category filter
// Returns { faqs, loading, error, retry }
// ============================================================

import { useState, useEffect } from 'react';
import { getFaqs } from '../services/faqService';
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
  retryKey: number;
  retry: () => void;
}

export function useFaqSearch(
  search: string,
  category: string,
  options: UseFaqSearchOptions = {}
): UseFaqSearchResult {
  const { debounceMs = 300 } = options;
  const [allFaqs, setAllFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const debouncedSearch = useDebouncedValue(search, debounceMs);

  // 1. Fetch all FAQs from service on mount / retry
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
  }, [retryKey]);

  // 2. Apply category filter + smart search (synchronous, runs on debounced input)
  const filtered = (() => {
    if (loading) return [];
    const categoryFiltered = filterByCategory(allFaqs, category);
    return searchFaqs(categoryFiltered, debouncedSearch);
  })();

  function retry() {
    setRetryKey((k) => k + 1);
  }

  return { faqs: filtered, loading, error, retryKey, retry };
}