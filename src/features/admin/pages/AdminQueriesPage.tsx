import { useState, useEffect } from 'react';
import type { Query } from '../../queries/types/query.types';
import { queryService } from '../../queries/services/queryService';
import { QueryCard } from '../../queries/components/QueryCard';
import { QueryEmptyState } from '../../queries/components/QueryEmptyState';

type LoadState = 'loading' | 'success' | 'error';

export function AdminQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    queryService
      .getAll()
      .then((res) => {
        if (res.success && res.data) {
          setQueries(res.data);
          setLoadState('success');
        } else {
          setErrorMessage(res.error ?? 'Failed to load queries');
          setLoadState('error');
        }
      })
      .catch(() => {
        setErrorMessage('Network error. Please try again.');
        setLoadState('error');
      });
  }, []);

  if (loadState === 'loading') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-gray-500">Loading all queries…</p>
      </div>
    );
  }

  if (loadState === 'error') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 min-h-screen flex flex-col items-center text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Couldn't load queries</h2>
        <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (queries.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 min-h-screen min-w-0">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Query Review</h1>
        <QueryEmptyState
          title="No queries yet"
          description="No queries have been submitted by interns yet."
        />
      </div>
    );
  }

  // Group by status for clearer admin view
  const openQueries = queries.filter((q) => q.status === 'open');
  const answeredQueries = queries.filter((q) => q.status === 'answered' || q.status === 'resolved' || q.status === 'verified');
  const closedQueries = queries.filter((q) => q.status === 'closed');

  function QueryGroup({ label, qs }: { label: string; qs: Query[] }) {
    if (qs.length === 0) return null;
    return (
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {label} <span className="text-gray-400 font-normal">({qs.length})</span>
        </h2>
        <div className="flex flex-col gap-3">
          {qs.map((q) => (
            <QueryCard key={q.id} query={q} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 min-h-screen min-w-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Query Review</h1>
        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
          {queries.length} total
        </span>
      </div>

      <QueryGroup label="Needs Attention" qs={openQueries} />
      <QueryGroup label="In Progress / Resolved" qs={answeredQueries} />
      <QueryGroup label="Closed" qs={closedQueries} />
    </div>
  );
}