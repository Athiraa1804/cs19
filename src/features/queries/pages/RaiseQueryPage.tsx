import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { QueryFormData } from '../types/query.types';
import { validateQueryForm, hasErrors } from '../utils/queryValidationUtils';
import { findSimilarItems } from '../utils/duplicateDetectionUtils';
import type { SimilarSuggestion } from '../utils/duplicateDetectionUtils';
import { queryService } from '../services/queryService';
import { useAuth } from '../../auth/context/AuthContext';
import { QueryForm } from '../components/QueryForm';
import { SimilarFaqSuggestions } from '../components/SimilarFaqSuggestions';
import { SimilarQuerySuggestions } from '../components/SimilarQuerySuggestions';

// The page moves through explicit stages so validation, duplicate checking,
// submission, and feedback cannot overlap or cause duplicate requests.
type Stage = 'form' | 'suggestions' | 'submitting' | 'success' | 'error';

interface Props {
  onSuccess?: () => void;
}

export function RaiseQueryPage({ onSuccess }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>('form');
  const [errors, setErrors] = useState<ReturnType<typeof validateQueryForm>>({});
  const [pendingData, setPendingData] = useState<QueryFormData | null>(null);
  const [suggestions, setSuggestions] = useState<SimilarSuggestion[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searching, setSearching] = useState(false);

  function handleFormSubmit(data: QueryFormData) {
    const validationErrors = validateQueryForm(data);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setPendingData(data);
    setSearching(true);

    // Valid form data is held temporarily until the intern reviews possible duplicates.
    findSimilarItems(data.title, data.description, user?.id ?? '')
      .then((results) => {
        setSuggestions(results);
        setSearching(false);
        setStage('suggestions');
      })
      .catch(() => {
        setSearching(false);
        setSuggestions([]);
        setStage('suggestions');
      });
  }
  
  function handleConfirmSubmit() {
    if (!pendingData) return;
    // Changing stage before the request disables repeated confirmation clicks.
    setStage('submitting'); // set synchronously to block double-click

    queryService
      .create(pendingData)
      .then((res) => {
        if (res.success && res.data) {
          setStage('success');
          setTimeout(() => {
            onSuccess?.();
            navigate('/queries/my');
          }, 1800);
        } else {
          setErrorMessage(res.error ?? 'Something went wrong. Please try again.');
          setStage('error');
        }
      })
      .catch(() => {
        setErrorMessage('Network error. Please try again.');
        setStage('error');
      });
  }

  function handleCancel() {
    setStage('form');
    setPendingData(null);
    setSuggestions([]);
    setErrors({});
  }

  function handleRetry() {
    setStage('form');
    setErrorMessage('');
  }

  const isSubmitting = stage === 'submitting';

  // ── Stage: Suggestions ───────────────────────────────────────
  if (stage === 'suggestions') {
    const faqSuggestions = suggestions.filter((s) => s.type === 'faq');
    const querySuggestions = suggestions.filter((s) => s.type === 'query');

    return (
      <div className="max-w-lg mx-auto px-4 py-6 min-h-screen min-w-0">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Before you submit…</h1>
        <p className="text-sm text-gray-500 mb-4">
          Check if your question is already answered below.
        </p>

        {searching ? (
          <div className="flex flex-col items-center py-12">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-gray-500">Checking for similar questions…</p>
          </div>
        ) : (
          <>
            {faqSuggestions.length === 0 && querySuggestions.length === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center min-w-0 break-words">
                <p className="text-sm text-green-700">
                  No similar FAQs or queries found. Your query looks new!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mb-4">
                <SimilarFaqSuggestions suggestions={faqSuggestions} />
                <SimilarQuerySuggestions suggestions={querySuggestions} />
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-w-0 break-words">
              <p className="text-sm font-medium text-gray-800 mb-2">Still need help?</p>
              <p className="text-xs text-gray-500 mb-4">
                If none of the above answered your question, go ahead and submit your query.
                It will be visible to peers and admins.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors disabled:cursor-not-allowed min-w-0"
                >
                  {isSubmitting ? 'Submitting…' : 'Yes, Submit Query'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors min-w-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // ── Stage: Success ───────────────────────────────────────────
  if (stage === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 min-h-screen min-w-0 flex flex-col items-center text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Query Submitted!</h2>
        <p className="text-sm text-gray-500 mb-6">
          Your query has been raised. Admins and peers will be able to see and respond to it.
        </p>
        <p className="text-xs text-gray-400">Redirecting to My Questions…</p>
      </div>
    );
  }

  // ── Stage: Error ─────────────────────────────────────────────
  if (stage === 'error') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 min-h-screen min-w-0 flex flex-col items-center text-center">
        <div className="text-5xl mb-4">❌</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Submission Failed</h2>
        <p className="text-sm text-red-600 mb-6">{errorMessage}</p>
        <button
          onClick={handleRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-6 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── Stage: Form ──────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto px-4 py-6 min-h-screen min-w-0">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Raise a Query</h1>
      <p className="text-sm text-gray-500 mb-6">
        Describe your issue and we'll help you find an answer.
      </p>

      <QueryForm
        errors={errors}
        isSubmitting={stage === 'submitting'}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
