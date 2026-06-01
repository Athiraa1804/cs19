import { Link } from 'react-router-dom';
import type { Query } from '../types/query.types';
import { QueryStatusBadge } from './QueryStatusBadge';

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
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm min-w-0 break-words">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-base leading-snug min-w-0 break-words flex-1">
          {query.title}
        </h3>
        <QueryStatusBadge status={query.status} />
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-w-0 break-words">
        {query.description}
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full min-w-0 break-words">
          {query.category}
        </span>
        {query.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full min-w-0 break-words"
          >
            #{tag}
          </span>
        ))}
      </div>

      {query.latestReplyPreview && (
        <div className="bg-gray-50 rounded-lg p-2.5 mb-3 min-w-0 break-words">
          <p className="text-xs text-gray-500 font-medium mb-0.5">Latest reply:</p>
          <p className="text-sm text-gray-700 min-w-0 break-words line-clamp-2">
            {query.latestReplyPreview}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 min-w-0">
        <span>Created {formatDate(query.createdAt)}</span>
        <Link
          to={`/queries/${query.id}`}
          className="text-blue-600 hover:text-blue-700 font-medium min-w-0 break-words"
        >
          View →
        </Link>
      </div>
    </div>
  );
}