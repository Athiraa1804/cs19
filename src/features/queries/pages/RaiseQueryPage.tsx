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
    setStage('submitting');

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

  if (stage === 'suggestions') {
    const faqSuggestions = suggestions.filter((s) => s.type === 'faq');
    const querySuggestions = suggestions.filter((s) => s.type === 'query');

    return (
      <div className="max-w-2xl mx-auto px-4 py-10 min-h-screen">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">Before you submit…</h1>
        <p className="text-sm text-slate-500 mb-8">
          Please check if your question has already been answered.
        </p>

        {searching ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
            <p className="text-sm text-slate-500 font-medium">Checking for similar questions…</p>
          </div>
        ) : (
          <>
            {faqSuggestions.length === 0 && querySuggestions.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8 text-center">
                <p className="text-sm font-medium text-emerald-900">
                  No similar items found. Your question looks unique!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6 mb-8">
                <SimilarFaqSuggestions suggestions={faqSuggestions} />
                <SimilarQuerySuggestions suggestions={querySuggestions} />
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900 mb-2">Still need help?</p>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                If none of the above matched, proceed with your submission. It will be shared with the community.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all"
                >
                  {isSubmitting ? 'Submitting…' : 'Yes, Submit'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all"
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

  if (stage === 'success') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 min-h-screen flex flex-col items-center text-center">
        <div className="text-5xl mb-6">✨</div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Submitted successfully</h2>
        <p className="text-sm text-slate-500 mb-8">
          Your question has been posted. Redirecting to My Activity...
        </p>
      </div>
    );
  }

  if (stage === 'error') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 min-h-screen flex flex-col items-center text-center">
        <div className="text-5xl mb-6">⚠️</div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Submission failed</h2>
        <p className="text-sm text-red-600 mb-8 font-medium">{errorMessage}</p>
        <button
          onClick={handleRetry}
          className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-3 px-8 rounded-xl transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">Ask a Question</h1>
      <p className="text-sm text-slate-500 mb-8">
        Describe your issue clearly to get the best help from the community.
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