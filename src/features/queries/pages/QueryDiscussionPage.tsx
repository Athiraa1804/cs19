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

  const showAdminActions = user?.role === 'admin';

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

  async function handleReplySubmit(body: string): Promise<boolean> {
    if (!id) return false;
    setReplySubmitError('');
    setSubmittingReply(true);
    try {
      const res = await replyService.create({ queryId: id, body });
      if (res.success && res.data) {
        setReplies((prev) => [...prev, res.data!]);
        setQuery((current) => current ? { ...current, replyCount: (current.replyCount ?? 0) + 1 } : current);
        return true;
      }
      setReplySubmitError(res.error ?? 'Failed to post reply.');
      return false;
    } catch {
      setReplySubmitError('Network error. Please try again.');
      return false;
    } finally {
      setSubmittingReply(false);
    }
  }

  function handleVerify(replyId: string) {
    setVerifyingReplyId(replyId);
    adminService.verifyReply(replyId).then((res) => {
      setVerifyingReplyId(null);
      if (res.success) {
        setReplies((prev) => prev.map((r) => (r.id === replyId ? { ...r, isVerified: true } : r)));
      }
    }).catch(() => setVerifyingReplyId(null));
  }

  function handleConvertToFaqConfirm(replyId: string, faqQuestion: string) {
    setConvertingReplyId(replyId);
    setConvertError('');
    setConvertSuccess('');
    adminService.convertReplyToFaq(replyId, faqQuestion).then((res) => {
      setConvertingReplyId(null);
      if (res.success && res.data) {
        setConvertSuccess(`FAQ created: "${res.data.question}"`);
        setReplyToConvert(null);
      } else {
        setConvertError(res.error ?? 'Failed to convert.');
      }
    }).catch(() => {
      setConvertingReplyId(null);
      setConvertError('Network error.');
    });
  }

  if (queryLoadState === 'error') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 min-h-screen flex flex-col items-center text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Query not found</h2>
        <p className="text-sm text-slate-500 mb-8">{queryError}</p>
        <Link to="/" className="bg-slate-900 text-white text-sm font-semibold py-3 px-6 rounded-xl">Back Home</Link>
      </div>
    );
  }

  const isLoading = queryLoadState === 'loading' || replyLoadState === 'loading';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 min-h-screen">
      <Link to={showAdminActions ? '/admin/queries' : '/queries'} className="text-sm text-slate-500 hover:text-slate-900 mb-6 flex items-center gap-1">
        ← Back to list
      </Link>

      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-slate-100 rounded-2xl" />
          <div className="h-32 bg-slate-100 rounded-2xl" />
        </div>
      ) : query ? (
        <>
          <QueryDetailCard query={{ ...query, replyCount: replies.length }} />

          <div className="mt-10">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-3">
              Discussion
              <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">{replies.length}</span>
            </h2>

            {replyLoadState === 'success' && (
              <div className="space-y-6">
                <ReplyList
                  replies={replies}
                  showAdminActions={showAdminActions}
                  onVerify={handleVerify}
                  onConvertToFaq={(reply) => setReplyToConvert(reply)}
                  verifyingReplyId={verifyingReplyId}
                  convertingReplyId={convertingReplyId}
                />

                {replyToConvert && (
                  <AdminConvertToFaqDialog
                    reply={replyToConvert}
                    isConverting={convertingReplyId === replyToConvert.id}
                    onConfirmConvert={handleConvertToFaqConfirm}
                    onCancel={() => setReplyToConvert(null)}
                  />
                )}

                {(convertSuccess || convertError) && (
                  <div className={`p-4 rounded-xl text-sm font-medium ${convertSuccess ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-900'}`}>
                    {convertSuccess || convertError}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Post a reply</h3>
            {replySubmitError && <p className="mb-4 text-sm text-red-600">{replySubmitError}</p>}
            <ReplyForm isSubmitting={submittingReply} currentRole={user?.role ?? 'intern'} onSubmit={handleReplySubmit} />
          </div>
        </>
      ) : null}
    </div>
  );
}