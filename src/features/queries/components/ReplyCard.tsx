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
      className={`rounded-xl border p-4 min-w-0 break-words ${
        reply.isVerified
          ? 'bg-green-50 border-green-200'
          : isAdminAuthor
          ? 'bg-white border-gray-200'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
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
            <p className="text-xs text-gray-400 leading-tight">
              {isAdminAuthor ? 'Admin' : 'Intern'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {reply.isVerified && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full min-w-0 break-words">
              ✅ Verified Answer
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <p className="text-sm text-gray-800 mb-3 min-w-0 break-words leading-relaxed">
        {reply.body}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>

        {showAdminActions && !reply.isVerified && (
          <div className="flex gap-2">
            <button
              onClick={() => onVerify?.(reply.id)}
              disabled={isVerifying}
              className="text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-0 break-words"
            >
              {isVerifying ? 'Verifying…' : '✓ Verify'}
            </button>
            <button
              onClick={() => onConvertToFaq?.(reply)}
              disabled={isConverting}
              className="text-xs text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-2.5 py-1 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-0 break-words"
            >
              {isConverting ? 'Converting…' : '+ FAQ'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}