import type { SimilarSuggestion } from '../utils/duplicateDetectionUtils';

interface Props {
  suggestions: SimilarSuggestion[];
}

export function SimilarQuerySuggestions({ suggestions }: Props) {
  if (suggestions.length === 0) return null;
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 min-w-0 break-words">
      <h4 className="text-sm font-semibold text-amber-800 mb-2">🔍 Similar Queries</h4>
      <p className="text-xs text-amber-600 mb-3">
        Other interns had similar issues. Check if yours is already answered:
      </p>
      <div className="flex flex-col gap-2">
        {suggestions.map((s) => (
          <div key={s.id} className="bg-white rounded-lg p-3 border border-amber-100 min-w-0 break-words">
            <p className="text-sm font-medium text-gray-800 min-w-0 break-words">{s.title}</p>
            <p className="text-xs text-gray-600 mt-1 min-w-0 break-words line-clamp-2">{s.preview}</p>
            <span className="inline-block mt-1.5 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full min-w-0 break-words">
              {s.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}