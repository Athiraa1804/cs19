import { Link } from 'react-router-dom';
import type { Query } from '../types/query.types';
import { QueryStatusBadge } from './QueryStatusBadge';
import { useAuth } from '../../auth/context/AuthContext';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

interface Props {
  query: Query;
}

export function QueryCard({ query }: Props) {
  const { user } = useAuth();
  const detailsPath = user?.role === 'admin' ? `/admin/queries/${query.id}` : `/queries/${query.id}`;

  return (
    <Link
      to={detailsPath}
      className="group block bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:border-slate-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-base font-semibold text-slate-900 leading-snug group-hover:text-slate-700 transition-colors">
          {query.title}
        </h3>
        <div className="shrink-0">
          <QueryStatusBadge status={query.status} />
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-5 line-clamp-2 leading-relaxed">
        {query.description}
      </p>

      {query.latestReplyPreview && (
        <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Latest reply</p>
          <p className="text-sm text-slate-600 line-clamp-2 italic">
            "{query.latestReplyPreview}"
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded">
            {query.category}
          </span>
          {query.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
          <span>{formatDate(query.createdAt)}</span>
          <span className="text-slate-900 group-hover:translate-x-1 transition-transform font-semibold">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}