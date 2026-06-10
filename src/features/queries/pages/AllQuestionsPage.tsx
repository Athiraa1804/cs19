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
    // Discussions are shared: every signed-in intern can open every query and see its replies.
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
      <div className="max-w-lg mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-gray-500">Loading all questions...</p>
      </div>
    );
  }

  if (loadState === 'error') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 min-h-screen flex flex-col items-center text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Couldn't load questions</h2>
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

  return (
    <div className="max-w-lg mx-auto px-4 py-6 min-h-screen min-w-0">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">All Questions</h1>
        <p className="text-sm text-gray-500">
          Open any discussion to see answers shared by interns and admins.
        </p>
      </div>

      {queries.length === 0 ? (
        <QueryEmptyState
          title="No questions yet"
          description="Questions raised by interns will appear here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {queries.map((query) => (
            <QueryCard key={query.id} query={query} />
          ))}
        </div>
      )}
    </div>
  );
}
