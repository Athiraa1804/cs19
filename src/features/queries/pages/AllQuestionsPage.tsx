import { useEffect, useState } from 'react';
import type { Query } from '../types/query.types';
import { queryService } from '../services/queryService';
import { QueryCard } from '../components/QueryCard';
import { QueryEmptyState } from '../components/QueryEmptyState';

type LoadState = 'loading' | 'success' | 'error';

export function AllQuestionsPage() {
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
          setErrorMessage(res.error ?? 'Failed to load questions');
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
        <p className="text-sm text-slate-500 font-medium">Loading community discussions...</p>
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 min-h-screen">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">Community Q&A</h1>
        <p className="text-sm text-slate-500">
          Browse through ongoing discussions and see shared insights from the community.
        </p>
      </div>

      {queries.length === 0 ? (
        <QueryEmptyState
          title="No questions yet"
          description="Be the first to start a discussion by raising a new query."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {queries.map((query) => (
            <QueryCard key={query.id} query={query} />
          ))}
        </div>
      )}
    </div>
  );
}