// ============================================================
// FaqAccordionItem — single FAQ as an accessible accordion row
// States: expanded / collapsed
// ============================================================

import { useState } from 'react';
import type { FAQ } from '../types/faq.types';
import { isAdmin } from '../../queries/types/roleSim';

interface FaqAccordionItemProps {
  faq: FAQ;
  onHelpful?: (id: string) => void;
}

export function FaqAccordionItem({ faq, onHelpful }: FaqAccordionItemProps) {
  const [open, setOpen] = useState(false);

  const sourceLabel = faq.source === 'existing' ? 'Official' : 'Community';
  const sourceColor =
    faq.source === 'existing'
      ? 'bg-blue-50 text-blue-700'
      : 'bg-emerald-50 text-emerald-700';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all">
      {/* Question row — always visible, accessible button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {/* Expand chevron */}
        <span
          className="mt-0.5 text-gray-400 shrink-0 text-xs transition-transform duration-200"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          ▶
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 leading-snug">
            {faq.question}
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
            {/* Category badge */}
            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-medium">
              {faq.category}
            </span>
            {/* Source badge */}
            <span
              className={`text-xs px-2 py-0.5 rounded font-medium ${sourceColor}`}
            >
              {sourceLabel}
            </span>
            {/* Helpful count */}
            <span className="text-xs text-gray-400">
              {faq.helpfulCount.toLocaleString()} found helpful
            </span>
          </div>
        </div>
      </button>

      {/* Answer — only in DOM when open */}
      {open && (
        <div className="px-4 pb-4 pt-0">
          <div className="ml-5 border-l-2 border-indigo-100 pl-3">
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
              {faq.answer}
            </p>

            {/* Tags */}
            {faq.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {faq.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Helpful button — interns only */}
            {!isAdmin() && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onHelpful?.(faq.id);
                }}
                className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus-visible:underline"
              >
                👍 Helpful
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}