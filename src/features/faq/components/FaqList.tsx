// ============================================================
// FaqList — renders a list of FAQ accordions
// ============================================================

import { FaqAccordionItem } from './FaqAccordionItem';
import type { FAQ } from '../types/faq.types';

interface FaqListProps {
  faqs: FAQ[];
  onHelpful?: (id: string) => void;
}

export function FaqList({ faqs, onHelpful }: FaqListProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-2 pl-0.5">
        {faqs.length} result{faqs.length !== 1 ? 's' : ''}
      </p>
      {faqs.map((faq) => (
        <FaqAccordionItem key={faq.id} faq={faq} onHelpful={onHelpful} />
      ))}
    </div>
  );
}