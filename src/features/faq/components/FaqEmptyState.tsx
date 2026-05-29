// ============================================================
// FaqEmptyState — shown when search/category returns no results
// ============================================================

interface FaqEmptyStateProps {
  search?: string;
  category?: string;
}

export function FaqEmptyState({ search, category }: FaqEmptyStateProps) {
  const isFiltered = Boolean(search) || (Boolean(category) && category !== 'All');

  return (
    <div className="text-center py-12 px-4">
      <div className="text-4xl mb-3" role="img" aria-label="No results">
        🔍
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">
        {search ? `No results for "${search}"` : 'No FAQs found'}
      </h3>
      <p className="text-sm text-gray-500 max-w-xs mx-auto">
        {isFiltered
          ? 'Try different keywords or clear your filters to browse all FAQs.'
          : 'No FAQs are available yet. Check back later.'}
      </p>
    </div>
  );
}