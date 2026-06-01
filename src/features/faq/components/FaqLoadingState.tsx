// ============================================================
// FaqLoadingState — skeleton cards shown while FAQs are loading
// ============================================================

import { SkeletonCard } from '../../../shared/components/Skeleton';

export function FaqLoadingState() {
  return (
    <div className="space-y-3" aria-label="Loading FAQs…" aria-busy="true">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}