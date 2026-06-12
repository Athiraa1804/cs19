import type { Reply } from '../types/reply.types';

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
  reply: Reply;
  showAdminActions?: boolean;
  onVerify?: (replyId: string) => void;
  onConvertToFaq?: (reply: Reply) => void;
  isVerifying?: boolean;
  isConverting?: boolean;
}

export function ReplyCard({
  reply,
  showAdminActions,
  onVerify,
  onConvertToFaq,
  isVerifying,
  isConverting,
}: Props) {
  const isAdminAuthor = reply.authorRole === 'admin';

  return (
    <div
      className={`rounded-xl border p-4 shadow-sm min-w-0 break-words ${
        reply.isVerified
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2 min-w-0 break-words">
          <span
            className={`inline-block w-7 h-7 rounded-full text-center text-xs font-bold leading-7 shrink-0 ${
              isAdminAuthor
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {reply.authorName.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 break-words">
            <p className="text-sm font-semibold text-gray-900 leading-tight min-w-0 break-words">
              {reply.authorName}
            </p>
            <span
              className={`inline-flex mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                isAdminAuthor
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {isAdminAuthor ? 'Admin' : 'Intern'}
            </span>
          </div>
        </div>

        {reply.isVerified && (
          <span className="inline-flex self-start items-center text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full min-w-0 break-words">
            Verified Answer
          </span>
        )}
      </div>

      {/* Body */}
      <p className="text-sm text-gray-700 mb-3 min-w-0 break-words whitespace-pre-wrap leading-relaxed">
        {reply.body}
      </p>

      {/* Footer */}
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>

        {showAdminActions && (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {!reply.isVerified && (
            <button
              onClick={() => onVerify?.(reply.id)}
              disabled={isVerifying}
              className="w-full text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-0 break-words sm:w-auto"
            >
              {isVerifying ? 'Verifying…' : 'Verify Answer'}
            </button>
            )}
            {reply.isVerified && (
            <button
              onClick={() => onConvertToFaq?.(reply)}
              disabled={isConverting}
              className="w-full text-xs text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-0 break-words sm:w-auto"
            >
              {isConverting ? 'Converting…' : 'Convert to FAQ'}
            </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
