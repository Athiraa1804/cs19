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
    <div className="max-w-lg mx-auto px-4 py-4">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-xl font-bold text-gray-900">FAQs</h1>

        {user?.role === 'intern' && (
          <div className="flex flex-col sm:items-end">
            <span className="text-xs text-gray-500 mb-1 font-medium">
              Didn't get the answer?
            </span>
            <Link
              to="/queries/raise"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              Click here to raise a query
            </Link>
          </div>
        )}
      </div>

      <div className="mb-3">
        <FaqSearchBar value={search} onChange={setSearch} />
      </div>

      <FaqCategoryFilter
        categories={categories}
        selected={category}
        onSelect={setCategory}
      />

      {loading && <FaqLoadingState />}

      {error && !loading && (
        <FaqErrorState message={error} onRetry={retry} />
      )}

      {!loading && !error && faqs.length > 0 && (
        <FaqList
          faqs={faqs}
          onHelpful={markHelpful}
        />
      )}

      {!loading && !error && faqs.length === 0 && search && (
        <FaqEmptyState search={search} category={category} />
      )}

      {!loading && !error && faqs.length === 0 && !search && category !== 'All' && (
        <FaqEmptyState category={category} />
      )}

      {!loading && !error && faqs.length === 0 && !search && category === 'All' && (
        <FaqEmptyState />
      )}
      {!loading && !error && faqs.length > 0 && (
        <>
          <FaqList
            faqs={faqs}
            onHelpful={markHelpful}
          />
          <div className="text-center text-sm text-gray-500 mt-8 mb-4">
            No more FAQs
          </div>
        </>
      )}
    </div>
  );
}