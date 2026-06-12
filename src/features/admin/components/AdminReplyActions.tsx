import { useState } from 'react';
import type { Reply } from '../../queries/types/reply.types';

interface Props {
  reply: Reply;
  onConfirmConvert: (replyId: string, faqQuestion: string) => void;
  onCancel: () => void;
  isConverting: boolean;
}

export function AdminConvertToFaqDialog({ reply, onConfirmConvert, onCancel, isConverting }: Props) {
  // The reply supplies the answer; the admin edits a clear question that interns can search for.
  const [faqQuestion, setFaqQuestion] = useState(
    `${""}${reply.body.length > 80 ? '…' : ''}`
  );

  function handleConfirm() {
    if (!faqQuestion.trim() || faqQuestion.trim().length < 10) return;
    onConfirmConvert(reply.id, faqQuestion.trim());
  }

  return (
    <div className="bg-white border border-green-200 rounded-xl p-4 min-w-0 break-words">
      <h4 className="text-sm font-semibold text-green-800 mb-1">Convert to FAQ</h4>
      <p className="text-xs text-green-600 mb-3">
        Write a question that this reply answers. Interns will find it in FAQ search.
      </p>

      <textarea
        value={faqQuestion}
        onChange={(e) => setFaqQuestion(e.target.value)}
        rows={3}
        maxLength={200}
        disabled={isConverting}
        className="w-full px-3 py-2 border border-green-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 resize-y disabled:bg-gray-100 disabled:cursor-not-allowed mb-3 min-w-0 break-words"
      />

      <div className="flex gap-2">
        <button
          onClick={handleConfirm}
          disabled={!faqQuestion.trim() || faqQuestion.trim().length < 10 || isConverting}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors disabled:cursor-not-allowed min-w-0"
        >
          {isConverting ? 'Creating FAQ…' : 'Create FAQ'}
        </button>
        <button
          onClick={onCancel}
          disabled={isConverting}
          className="px-3 py-2 border border-gray-300 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-0"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
