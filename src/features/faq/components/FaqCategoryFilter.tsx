// ============================================================
// FaqCategoryFilter — horizontal scrollable category chip filter
// ============================================================

interface FaqCategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export function FaqCategoryFilter({
  categories,
  selected,
  onSelect,
}: FaqCategoryFilterProps) {
  return (
    <div
      role="group" /* aria-label="Filter by category" */
      className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide"
    >
      {categories.map((cat) => {
        const isActive = cat === selected;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            aria-pressed={isActive}
            className={`shrink-0 px-3 py-1.5 text-sm font-medium rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}