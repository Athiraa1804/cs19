import { useState, useEffect } from 'react';
import type { Query } from '../../queries/types/query.types';
import { queryService } from '../../queries/services/queryService';
import { QueryCard } from '../../queries/components/QueryCard';
import { QueryEmptyState } from '../../queries/components/QueryEmptyState';

type LoadState = 'loading' | 'success' | 'error';
type FilterTab = 'all' | 'open' | 'answered' | 'verified' | 'closed';

export function AdminQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

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
      <div className="max-w-3xl mx-auto px-4 py-20 min-h-screen flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-500 font-medium">Loading moderation queue...</p>
      </div>
    );
  }

  if (loadState === 'error') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 min-h-screen flex flex-col items-center text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Unable to load</h2>
        <p className="text-sm text-slate-500 mb-6">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-3 px-6 rounded-xl transition-all"
        >
          Retry connection
        </button>
      </div>
    );
  }

  const filteredQueries = queries.filter((q) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'answered') return q.status === 'answered' || q.status === 'resolved';
    return q.status === activeFilter;
  });

  const filterOptions: FilterTab[] = ['all', 'open', 'answered', 'verified', 'closed'];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">Moderation Queue</h1>
          <p className="text-sm text-slate-500">Manage and review all incoming intern queries.</p>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          {queries.length} total
        </span>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {filterOptions.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
              activeFilter === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filteredQueries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-slate-500">No queries found for this filter.</p>
          </div>
        ) : (
          filteredQueries.map((q) => <QueryCard key={q.id} query={q} />)
        )}
      </div>
    </div>
  );
}