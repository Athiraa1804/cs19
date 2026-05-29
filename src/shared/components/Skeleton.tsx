// ============================================================
// SkeletonCard — animated placeholder during loading
// ============================================================

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-4 h-4 bg-gray-200 rounded mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}