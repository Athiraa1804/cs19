import { useState } from 'react';
import type { FAQ } from '../types/faq.types';
import { useAuth } from '../../auth/context/AuthContext';

interface FaqAccordionItemProps {
  faq: FAQ;
  onHelpful?: (id: string) => Promise<boolean>;
}

export function FaqAccordionItem({ faq, onHelpful }: FaqAccordionItemProps) {
  const [open, setOpen] = useState(false);
  const [helpfulPending, setHelpfulPending] = useState(false);
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false);
  const { user } = useAuth();

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left py-5 flex items-start gap-4 focus:outline-none group"
      >
        <span
          className={`mt-1 text-slate-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-90' : 'rotate-0'}`}
          aria-hidden="true"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-slate-700 transition-colors">
            {faq.question}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {faq.category}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {faq.helpfulCount} helpful
            </span>
          </div>
        </div>
      </button>

      {open && (
        <div className="px-10 pb-6 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {faq.answer}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {faq.tags.map((tag) => (
              <span key={tag} className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>

          {user?.role !== 'admin' && (
            <button
              type="button"
              disabled={helpfulPending || hasMarkedHelpful}
              onClick={async (e) => {
                e.stopPropagation();
                if (!onHelpful || helpfulPending || hasMarkedHelpful) return;
                setHelpfulPending(true);
                const saved = await onHelpful(faq.id);
                setHelpfulPending(false);
                if (saved) setHasMarkedHelpful(true);
              }}
              className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-slate-600 transition-colors disabled:opacity-50"
            >
              <span>{hasMarkedHelpful ? '✓ Marked helpful' : 'Mark as helpful'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}