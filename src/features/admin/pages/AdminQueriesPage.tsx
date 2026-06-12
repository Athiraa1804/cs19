import { useState, useEffect } from 'react';
import type { Query } from '../../queries/types/query.types';
import { queryService } from '../../queries/services/queryService';
import { QueryCard } from '../../queries/components/QueryCard';
import { QueryEmptyState } from '../../queries/components/QueryEmptyState';
import type { QueryStatus } from '../../queries/types/query.types';

type LoadState = 'loading' | 'success' | 'error';
type FilterTab = 'all' | 'open' | 'answered' | 'verified' | 'closed';

export function AdminQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
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

  const statuses: QueryStatus[] = ['open', 'answered', 'resolved', 'verified', 'closed'];

  function handleStatusChange(queryId: string, status: QueryStatus) {
    setUpdatingId(queryId);
    queryService.updateStatus(queryId, status).then((res) => {
      setUpdatingId(null);
      if (res.success && res.data) {
        setQueries((prev) => prev.map((query) => (query.id === queryId ? res.data! : query)));
      } else {
        setErrorMessage(res.error ?? 'Failed to update status');
        setLoadState('error');
      }
    });
  }

  const filteredQueries = queries.filter((q) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'answered') return q.status === 'answered' || q.status === 'resolved';
    return q.status === activeFilter;
  });

  const filterOptions: FilterTab[] = ['all', 'open', 'answered', 'verified', 'closed'];

  return (
    <div className="max-w-lg mx-auto px-4 py-6 min-h-screen min-w-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Query Review</h1>
        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
          {queries.length} total
        </span>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        {filterOptions.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap capitalize transition-colors ${activeFilter === tab
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filteredQueries.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">
            No queries found for this filter.
          </div>
        ) : (
          filteredQueries.map((q) => (
            <div key={q.id} className="flex flex-col gap-2">
              <QueryCard query={q} />
              {/* <div className="flex items-center gap-2 pl-1">
                <label htmlFor={`status-${q.id}`} className="text-xs font-medium text-gray-500">
                  Status
                </label>
                <select
                  id={`status-${q.id}`}
                  value={q.status}
                  disabled={updatingId === q.id}
                  onChange={(event) => handleStatusChange(q.id, event.target.value as QueryStatus)}
                  className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-700 disabled:bg-gray-100"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}