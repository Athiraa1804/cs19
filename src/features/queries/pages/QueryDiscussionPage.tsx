import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Query } from '../types/query.types';
import type { Reply } from '../types/reply.types';
import { queryService } from '../services/queryService';
import { replyService } from '../services/replyService';
import { adminService } from '../services/adminService';
import { useAuth } from '../../auth/context/AuthContext';
import { QueryDetailCard } from '../components/QueryDetailCard';
import { ReplyList } from '../components/ReplyList';
import { ReplyForm } from '../components/ReplyForm';
import { AdminConvertToFaqDialog } from '../../admin/components/AdminReplyActions';

type LoadState = 'loading' | 'success' | 'error';

export function QueryDiscussionPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [query, setQuery] = useState<Query | null>(null);
  const [queryLoadState, setQueryLoadState] = useState<LoadState>('loading');
  const [replyLoadState, setReplyLoadState] = useState<LoadState>('loading');
  const [queryError, setQueryError] = useState('');
  const [replyError, setReplyError] = useState('');
  const [replies, setReplies] = useState<Reply[]>([]);
  const [verifyingReplyId, setVerifyingReplyId] = useState<string | null>(null);
  const [convertingReplyId, setConvertingReplyId] = useState<string | null>(null);
  const [replyToConvert, setReplyToConvert] = useState<Reply | null>(null);
  const [convertError, setConvertError] = useState('');
  const [convertSuccess, setConvertSuccess] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replySubmitError, setReplySubmitError] = useState('');

  // The same discussion page serves interns and admins; only admins receive moderation controls.
  const showAdminActions = user?.role === 'admin';

  // Query details and replies are independent requests, so loading them together reduces wait time.
  useEffect(() => {
    if (!id) return;

    Promise.all([queryService.getById(id), replyService.getByQueryId(id)]).then(
      ([queryRes, replyRes]) => {
        if (queryRes.success && queryRes.data) {
          setQuery(queryRes.data);
          setQueryLoadState('success');
        } else {
          setQueryError(queryRes.error ?? 'Query not found');
          setQueryLoadState('error');
        }

        if (replyRes.success && replyRes.data) {
          setReplies(replyRes.data);
          setReplyLoadState('success');
        } else {
          setReplyError(replyRes.error ?? 'Failed to load replies');
          setReplyLoadState('error');
        }
      }
    );
  }, [id]);

  // Returning true tells ReplyForm it is safe to clear the textarea after persistence succeeds.
  async function handleReplySubmit(body: string): Promise<boolean> {
    if (!id) return false;
    setReplySubmitError('');
    setSubmittingReply(true);
    try {
      const res = await replyService.create({ queryId: id, body });
      if (res.success && res.data) {
        const createdReply = res.data;
        setReplies((prev) => [...prev, createdReply]);
        setQuery((current) =>
          current ? { ...current, replyCount: (current.replyCount ?? 0) + 1 } : current,
        );
        return true;
      }
      setReplySubmitError(res.error ?? 'Failed to post reply. Please try again.');
      return false;
    } catch {
      setReplySubmitError('Network error. Please check your connection and try again.');
      return false;
    } finally {
      setSubmittingReply(false);
    }
  }

  // Verification is an admin-only backend action; the local update avoids a full page refresh.
  function handleVerify(replyId: string) {
    setVerifyingReplyId(replyId);
    adminService
      .verifyReply(replyId)
      .then((res) => {
        setVerifyingReplyId(null);
        if (res.success) {
          setReplies((prev) =>
            prev.map((r) => (r.id === replyId ? { ...r, isVerified: true } : r))
          );
        }
      })
      .catch(() => {
        setVerifyingReplyId(null);
      });
  }

  // Conversion turns a verified reply into searchable crowd-sourced FAQ content.
  function handleConvertToFaqConfirm(replyId: string, faqQuestion: string) {
    setConvertingReplyId(replyId);
    setConvertError('');
    setConvertSuccess('');

    adminService
      .convertReplyToFaq(replyId, faqQuestion)
      .then((res) => {
        setConvertingReplyId(null);
        if (res.success && res.data) {
          setConvertSuccess(`✅ FAQ created: "${res.data.question}"`);
          setReplyToConvert(null);
        } else {
          setConvertError(res.error ?? 'Failed to convert to FAQ');
        }
      })
      .catch(() => {
        setConvertingReplyId(null);
        setConvertError('Network error. Please try again.');
      });
  }

  // ── Error state ───────────────────────────────────────────────
  if (queryLoadState === 'error') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 min-h-screen flex flex-col items-center text-center">
        <div className="text-4xl mb-3">🔍</div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Query Not Found</h2>
        <p className="text-sm text-gray-500 mb-4">{queryError}</p>
        <Link
          to="/queries/my"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Back to My Questions
        </Link>
      </div>
    );
  }

  const isLoading = queryLoadState === 'loading' || replyLoadState === 'loading';

  return (
    <div className="max-w-lg mx-auto px-4 py-6 min-h-screen min-w-0">
      {/* Back nav */}
      <Link
        to={user?.role === 'admin' ? '/admin/queries' : '/queries/my'}
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-4 min-w-0 break-words"
      >
        {user?.role === 'admin' ? '← Query Review' : '← My Questions'}
      </Link>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="h-20 bg-gray-200 rounded-xl" />
          <div className="h-20 bg-gray-200 rounded-xl" />
        </div>
      ) : query ? (
        <>
          {/* Query detail card */}
          <QueryDetailCard query={{ ...query, replyCount: replies.length }} />

          {/* Replies section */}
          <div className="mt-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Replies
              <span className="ml-2 text-gray-400 font-normal text-sm">({replies.length})</span>
            </h2>

            {replyLoadState === 'error' && (
              <div className="text-center py-6 min-w-0 break-words">
                <p className="text-sm text-red-600 mb-2">{replyError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Retry
                </button>
              </div>
            )}

            {replyLoadState === 'success' && (
              <>
                <ReplyList
                  replies={replies}
                  showAdminActions={showAdminActions}
                  onVerify={handleVerify}
                  onConvertToFaq={(reply) => setReplyToConvert(reply)}
                  verifyingReplyId={verifyingReplyId}
                  convertingReplyId={convertingReplyId}
                />

                {/* Convert to FAQ dialog */}
                {replyToConvert && (
                  <div className="mt-3">
                    <AdminConvertToFaqDialog
                      reply={replyToConvert}
                      isConverting={convertingReplyId === replyToConvert.id}
                      onConfirmConvert={handleConvertToFaqConfirm}
                      onCancel={() => setReplyToConvert(null)}
                    />
                  </div>
                )}

                {/* Convert success/error banners */}
                {convertSuccess && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 min-w-0 break-words">
                    <p className="text-sm text-green-700">{convertSuccess}</p>
                  </div>
                )}
                {convertError && (
                  <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 min-w-0 break-words">
                    <p className="text-sm text-red-700">{convertError}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Reply form */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4 shadow-sm min-w-0 break-words">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Add a Reply</h3>
            {replySubmitError && (
              <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 min-w-0 break-words">
                <p className="text-sm text-red-700">{replySubmitError}</p>
              </div>
            )}
            <ReplyForm
              isSubmitting={submittingReply}
              currentRole={user?.role ?? 'intern'}
              onSubmit={handleReplySubmit}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
