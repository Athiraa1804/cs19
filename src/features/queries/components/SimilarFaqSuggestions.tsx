import type { SimilarSuggestion } from '../utils/duplicateDetectionUtils';

interface Props {
  suggestions: SimilarSuggestion[];
}

export function SimilarFaqSuggestions({ suggestions }: Props) {
  if (suggestions.length === 0) return null;
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 min-w-0 break-words">
      <h4 className="text-sm font-semibold text-blue-800 mb-2">📖 Matching FAQs</h4>
      <p className="text-xs text-blue-600 mb-3">
        These FAQs might already answer your question:
      </p>
      <div className="flex flex-col gap-2">
        {suggestions.map((s) => (
          <div key={s.id} className="bg-white rounded-lg p-3 border border-blue-100 min-w-0 break-words">
            <p className="text-sm font-medium text-gray-800 min-w-0 break-words">{s.title}</p>
            <p className="text-xs text-gray-600 mt-1 min-w-0 break-words line-clamp-2">{s.preview}</p>
            <span className="inline-block mt-1.5 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full min-w-0 break-words">
              {s.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}