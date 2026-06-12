import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { RaiseQueryPage } from './features/queries/pages/RaiseQueryPage';
import { FAQPage } from './features/faq/pages/FAQPage';
import { MyQuestionsPage } from './features/queries/pages/MyQuestionsPage';
import { AllQuestionsPage } from './features/queries/pages/AllQuestionsPage';
import { QueryDiscussionPage } from './features/queries/pages/QueryDiscussionPage';
import { AdminQueriesPage } from './features/admin/pages/AdminQueriesPage';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';

// ── Role-based route guard ──────────────────────────────────
// Renders children only if current role matches allowed role.
// Otherwise redirects: interns trying admin routes → /faqs,
// admins trying intern routes → /admin/queries.
type AllowedRole = 'intern' | 'admin';

function RoleRoute({ allowed, children }: { allowed?: AllowedRole; children: ReactNode }) {
  const { user, status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!allowed || user.role === allowed) return <>{children}</>;

  return <Navigate to={user.role === 'admin' ? '/admin/queries' : '/faqs'} replace />;
}

// ── NavBar ─────────────────────────────────────────────────────
function NavBar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isActive = (path: string) => location.pathname === path;
  const admin = user?.role === 'admin';
  
  // Minimalist link style: Slate base, subtle bottom border indicator
  const linkClass = (path: string) =>
    `relative shrink-0 whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-[2px] after:rounded-t-full after:transition-colors ${
      isActive(path)
        ? 'text-slate-900 after:bg-slate-900'
        : 'text-slate-500 hover:text-slate-900 after:bg-transparent'
    }`;

  return (
    <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-5xl items-center gap-2 px-4 sm:px-6">
        
        {user && (
          <span className="mr-6 shrink-0 text-sm font-semibold text-slate-900 tracking-tight">
            Hello, {user.name}
          </span>
        )}

        <div className="flex min-w-0 flex-1 items-center justify-start gap-2 overflow-x-auto sm:justify-center no-scrollbar">
          <Link to="/faqs" className={linkClass('/faqs')}>FAQs</Link>
          
          {user && !admin && (
            <>
              <Link to="/queries" className={linkClass('/queries')}>Community Q&A</Link>
              <Link to="/queries/raise" className={linkClass('/queries/raise')}>Ask a Question</Link>
              <Link to="/queries/my" className={linkClass('/queries/my')}>My Questions</Link>
            </>
          )}
          
          {user && admin && (
            <Link to="/admin/queries" className={linkClass('/admin/queries')}>Admin Panel</Link>
          )}
        </div>

        <div className="shrink-0 border-l border-slate-200 pl-4 ml-2">
          {user ? (
            <button
              onClick={logout}
              className="bg-white border border-slate-200 hover:border-red-200 text-slate-600 hover:bg-red-50 hover:text-red-600 font-medium py-2 px-4 rounded-lg transition-all shadow-sm text-sm"
            >
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              className="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// ── Root redirect — role-aware ──────────────────────────────
function NavigateToHome() {
  const { user, status } = useAuth();
  if (status === 'loading') return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin/queries' : '/faqs'} replace />;
}

// ── Not found page ───────────────────────────────────────────
function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center min-w-0">
      <div className="text-5xl font-extrabold text-slate-200 mb-4 tracking-tighter">404</div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">Page Not Found</h1>
      <p className="text-sm text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="inline-flex bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-3 px-6 rounded-xl transition-all shadow-sm"
      >
        Return to Home
      </Link>
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────
export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 min-w-0">
          <NavBar />
          <main>
            <Routes>
              <Route path="/" element={<NavigateToHome />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/faqs" element={<RoleRoute><FAQPage /></RoleRoute>} />
              <Route path="/queries/raise" element={<RoleRoute allowed="intern"><RaiseQueryPage /></RoleRoute>} />
              <Route path="/queries/my" element={<RoleRoute allowed="intern"><MyQuestionsPage /></RoleRoute>} />
              <Route path="/queries" element={<RoleRoute allowed="intern"><AllQuestionsPage /></RoleRoute>} />
              <Route path="/queries/:id" element={<RoleRoute allowed="intern"><QueryDiscussionPage /></RoleRoute>} />
              <Route path="/admin/queries" element={<RoleRoute allowed="admin"><AdminQueriesPage /></RoleRoute>} />
              <Route path="/admin/queries/:id" element={<RoleRoute allowed="admin"><QueryDiscussionPage /></RoleRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
