import { useState } from 'react';
import type { AuthorRole } from '../types/reply.types';

interface Props {
  isSubmitting: boolean;
  currentRole: AuthorRole;
  onSubmit: (body: string) => Promise<boolean>;
}

export function ReplyForm({ isSubmitting, currentRole, onSubmit }: Props) {
  const [body, setBody] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    const submitted = await onSubmit(body.trim());
    if (submitted) setBody('');
  }

  const canSubmit = body.trim().length >= 10 && !isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 min-w-0">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reply-body" className="text-sm font-medium text-gray-700">
          Reply <span className="text-red-500">*</span>
        </label>
        <textarea
          id="reply-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your reply (at least 10 characters)..."
          rows={4}
          maxLength={2000}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y disabled:bg-gray-100 disabled:cursor-not-allowed min-w-0 break-words"
        />
        <div className="flex justify-between items-start gap-2">
          {body.trim().length > 0 && body.trim().length < 10 ? (
            <p className="text-xs text-red-500 min-w-0 break-words">
              {10 - body.trim().length} more characters needed
            </p>
          ) : (
            <span />
          )}
          <span className="text-xs text-gray-400 shrink-0">{body.length}/2000</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-gray-400">
          Posting as: <span className="font-medium text-gray-600">{currentRole}</span>
        </span>
        <button
          type="submit"
          disabled={!canSubmit}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed min-w-0"
        >
          {isSubmitting ? 'Posting…' : 'Post Reply'}
        </button>
      </div>
    </form>
  );
}
