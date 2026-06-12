import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { useFaqSearch } from '../hooks/useFaqSearch';
import { FaqSearchBar } from '../components/FaqSearchBar';
import { FaqCategoryFilter } from '../components/FaqCategoryFilter';
import { FaqList } from '../components/FaqList';
import { FaqEmptyState } from '../components/FaqEmptyState';
import { FaqLoadingState } from '../components/FaqLoadingState';
import { FaqErrorState } from '../components/FaqErrorState';

export function FAQPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { user } = useAuth();

  const { faqs, loading, error, retry, markHelpful } = useFaqSearch(search, category);

  const categories = (() => {
    if (loading) return ['All'];
    const cats = Array.from(new Set(faqs.map((f) => f.category)));
    return ['All', ...cats.sort()];
  })();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Frequently Asked Questions</h1>
        
        {user?.role === 'intern' && (
          <div className="flex flex-col sm:items-end">
            <span className="text-xs text-slate-500 mb-1.5 font-medium">
              Didn't get the answer?
            </span>
            <Link
              to="/queries/raise"
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
            >
              Ask a Question
            </Link>
          </div>
        )}
      </div>

      <div className="mb-6">
        <FaqSearchBar value={search} onChange={setSearch} />
      </div>

      <div className="mb-8">
        <FaqCategoryFilter
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />
      </div>

      {loading && <FaqLoadingState />}

      {error && !loading && (
        <FaqErrorState message={error} onRetry={retry} />
      )}

      {!loading && !error && faqs.length > 0 && (
        <>
          <FaqList
            faqs={faqs}
            onHelpful={markHelpful}
          />
          <div className="text-center text-sm text-slate-400 font-medium mt-10 mb-6">
            End of results
          </div>
        </>
      )}

      {!loading && !error && faqs.length === 0 && (
        <FaqEmptyState search={search} category={category} />
      )}
    </div>
  );
}