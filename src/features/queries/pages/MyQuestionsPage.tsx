import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Query } from '../types/query.types';
import { queryService } from '../services/queryService';
import { CURRENT_USER_ID } from '../mocks/query.mock';
import { QueryCard } from '../components/QueryCard';
import { QueryEmptyState } from '../components/QueryEmptyState';

type LoadState = 'loading' | 'success' | 'error';

export function MyQuestionsPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    queryService
      .getByUser(CURRENT_USER_ID)
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

  // ── Loading ──────────────────────────────────────────────────
  if (loadState === 'loading') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-gray-500">Loading your queries…</p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────
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

  // ── Empty ────────────────────────────────────────────────────
  if (queries.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 min-h-screen min-w-0">
        <h1 className="text-xl font-bold text-gray-900 mb-6">My Questions</h1>
        <QueryEmptyState
          title="No queries yet"
          description="You haven't raised any queries. If you can't find an answer in the FAQs, go ahead and raise one."
          action={
            <Link
              to="/queries/raise"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-6 rounded-lg transition-colors"
            >
              Raise a Query
            </Link>
          }
        />
      </div>
    );
  }

  // ── Success ──────────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto px-4 py-6 min-h-screen min-w-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">My Questions</h1>
        <Link
          to="/queries/raise"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium min-w-0 break-words"
        >
          + New Query
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {queries.map((query) => (
          <QueryCard key={query.id} query={query} />
        ))}
      </div>
    </div>
  );
}