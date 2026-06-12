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
      role="group"
      aria-label="Filter FAQs by category"
      className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide no-scrollbar"
    >
      {categories.map((cat) => {
        const isActive = cat === selected;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            aria-pressed={isActive}
            className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}