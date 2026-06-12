import type { Query } from '../types/query.types';
import { QueryStatusBadge } from './QueryStatusBadge';
import { apiUrl } from '../../../shared/utils/apiClient';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface Props {
  query: Query;
}

export function QueryDetailCard({ query }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm min-w-0 break-words">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h1 className="text-lg font-bold text-gray-900 leading-snug flex-1 min-w-0 break-words">
          {query.title}
        </h1>
        <QueryStatusBadge status={query.status} />
      </div>

      <p className="text-sm text-gray-700 mb-4 min-w-0 break-words leading-relaxed">
        {query.description}
      </p>
      {query.attachmentUrl && (
  <div className="mb-4">
    <a
      href={`http://localhost:3001${query.attachmentUrl}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 underline"
    >
      📎 View Attachment
    </a>
  </div>
)}

      {query.attachment && (
        <a
          href={apiUrl(query.attachment.url)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 mb-4 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Attachment: {query.attachment.originalName}
        </a>
      )}

      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium min-w-0 break-words">
          {query.category}
        </span>
        {query.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full min-w-0 break-words"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
        <span>Opened {formatDate(query.createdAt)}</span>
        <span>Updated {formatDate(query.updatedAt)}</span>
        <span>by {query.createdBy}</span>
        {typeof query.replyCount === 'number' && (
          <span>{query.replyCount} repl{query.replyCount === 1 ? 'y' : 'ies'}</span>
        )}
      </div>
    </div>
  );
}
