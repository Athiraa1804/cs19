import type { Reply } from '../types/reply.types';
import { ReplyCard } from './ReplyCard';

interface Props {
  replies: Reply[];
  showAdminActions: boolean;
  onVerify: (replyId: string) => void;
  onConvertToFaq: (reply: Reply) => void;
  verifyingReplyId: string | null;
  convertingReplyId: string | null;
}

export function ReplyList({
  replies,
  showAdminActions,
  onVerify,
  onConvertToFaq,
  verifyingReplyId,
  convertingReplyId,
}: Props) {
  if (replies.length === 0) {
    return (
      <div className="py-8 text-center min-w-0 break-words">
        <p className="text-sm text-gray-500">No replies yet. Be the first to respond!</p>
      </div>
    );
  }

  // Verified reply shown first, then unverified in chronological order
  const verified = replies.filter((r) => r.isVerified);
  const unverified = replies
    .filter((r) => !r.isVerified)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const sorted = [...verified, ...unverified];

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((reply) => (
        <ReplyCard
          key={reply.id}
          reply={reply}
          showAdminActions={showAdminActions}
          onVerify={onVerify}
          onConvertToFaq={onConvertToFaq}
          isVerifying={verifyingReplyId === reply.id}
          isConverting={convertingReplyId === reply.id}
        />
      ))}
    </div>
  );
}