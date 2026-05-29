// ============================================================
// FaqSearchBar — controlled search input with clear button
// ============================================================

import { useId } from 'react';

interface FaqSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FaqSearchBar({
  value,
  onChange,
  placeholder = 'Search FAQs… (e.g. "stipend", "work from home")',
}: FaqSearchBarProps) {
  const inputId = useId();

  return (
    <div className="relative">
      {/* Search icon */}
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <span className="text-gray-400 text-sm" aria-hidden="true">
          🔍
        </span>
      </div>

      <input
        id={inputId}
        type="search"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 min-w-0"
      />

      {/* Clear button — only shown when there's text */}
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}