// ============================================================
// FaqErrorState — shown when FAQ service call fails
// ============================================================

interface FaqErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function FaqErrorState({
  message = 'Something went wrong loading the FAQs.',
  onRetry,
}: FaqErrorStateProps) {
  return (
    <div className="text-center py-10 px-4">
      <div className="text-4xl mb-3" role="img" aria-label="Error">
        ⚠️
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">
        Could not load FAQs
      </h3>
      <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        Try again
      </button>
    </div>
  );
}