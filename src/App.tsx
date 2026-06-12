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
  const linkClass = (path: string, adminLink = false) =>
    `relative shrink-0 whitespace-nowrap px-2.5 py-2 text-sm font-medium transition-colors after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors ${isActive(path)
      ? adminLink
        ? 'text-purple-700 after:bg-purple-600'
        : 'text-blue-700 after:bg-blue-600'
      : adminLink
        ? 'text-gray-600 hover:text-purple-700 after:bg-transparent'
        : 'text-gray-600 hover:text-blue-700 after:bg-transparent'
    }`;

  return (
    <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-14 max-w-5xl items-center gap-2 px-3 sm:px-4">
        {user && (
          <span className="mr-4 shrink-0 text-sm font-bold text-gray-800">
            Hello, {user.name}
          </span>
        )}
        <div className="flex min-w-0 flex-1 items-center justify-start gap-1 overflow-x-auto sm:justify-center">
          <Link
            to="/faqs"
            className={linkClass('/faqs')}
            aria-current={isActive('/faqs') ? 'page' : undefined}
          >
            FAQ
          </Link>
          {user && !admin && (
            <>
              <Link
                to="/queries"
                className={linkClass('/queries')}
                aria-current={isActive('/queries') ? 'page' : undefined}
              >
                All Questions
              </Link>
              <Link
                to="/queries/raise"
                className={linkClass('/queries/raise')}
                aria-current={isActive('/queries/raise') ? 'page' : undefined}
              >
                Raise Query
              </Link>
              <Link
                to="/queries/my"
                className={linkClass('/queries/my')}
                aria-current={isActive('/queries/my') ? 'page' : undefined}
              >
                My Questions
              </Link>
            </>
          )}
          {user && admin && (
            <Link
              to="/admin/queries"
              className={linkClass('/admin/queries', true)}
              aria-current={isActive('/admin/queries') ? 'page' : undefined}
            >
              Query Review
            </Link>
          )}
        </div>
        <div className="shrink-0 border-l border-gray-200 pl-2">
          {user ? (
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm"
            >
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-700"
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
    <div className="max-w-lg mx-auto px-4 py-16 text-center min-w-0">
      <div className="text-4xl font-bold text-gray-300 mb-3">404</div>
      <h1 className="text-xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-sm text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="inline-flex bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-6 rounded-lg transition-colors"
      >
        Go Home
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
