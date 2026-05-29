// ============================================================
// FAQPage — main FAQ discovery page
// States: loading, error, empty (no FAQs at all), empty (filtered), populated
// ============================================================

import { useState } from 'react';
import { useFaqSearch } from '../hooks/useFaqSearch';
import { FaqSearchBar } from '../components/FaqSearchBar';
import { FaqCategoryFilter } from '../components/FaqCategoryFilter';
import { FaqList } from '../components/FaqList';
import { FaqEmptyState } from '../components/FaqEmptyState';
import { FaqLoadingState } from '../components/FaqLoadingState';
import { FaqErrorState } from '../components/FaqErrorState';

export function FAQPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const { faqs, loading, error, retry } = useFaqSearch(search, category);

  // Derive categories dynamically from the loaded FAQs' categories
  const categories = (() => {
    if (loading) return ['All'];
    const cats = Array.from(new Set(faqs.map((f) => f.category)));
    return ['All', ...cats.sort()];
  })();

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      {/* Page title */}
      <h1 className="text-lg font-bold text-gray-900 mb-4">FAQs</h1>

      {/* Search bar */}
      <div className="mb-3">
        <FaqSearchBar value={search} onChange={setSearch} />
      </div>

      {/* Category filter — horizontal scroll */}
      <FaqCategoryFilter
        categories={categories}
        selected={category}
        onSelect={setCategory}
      />

      {/* ── States ── */}

      {loading && <FaqLoadingState />}

      {error && !loading && (
        <FaqErrorState message={error} onRetry={retry} />
      )}

      {/* Populated */}
      {!loading && !error && faqs.length > 0 && (
        <FaqList
          faqs={faqs}
          onHelpful={(id) => {
            // future: call markFaqHelpful service
            console.info('Mark helpful:', id);
          }}
        />
      )}

      {/* Empty search results */}
      {!loading && !error && faqs.length === 0 && search && (
        <FaqEmptyState search={search} category={category} />
      )}

      {/* Empty category — no FAQs in this category */}
      {!loading && !error && !search && category !== 'All' && (
        <FaqEmptyState category={category} />
      )}

      {/* Empty initial — no FAQs at all (only possible if mock data is empty) */}
      {!loading && !error && !search && category === 'All' && (
        <FaqEmptyState />
      )}
    </div>
  );
}