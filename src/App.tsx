import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { RaiseQueryPage } from './features/queries/pages/RaiseQueryPage';
import { FAQPage } from './features/faq/pages/FAQPage';
import { MyQuestionsPage } from './features/queries/pages/MyQuestionsPage';
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

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-between h-14 min-w-0">
          <span className="font-bold text-gray-900 text-base min-w-0 break-words">cs19 FAQ</span>
          <div className="flex items-center gap-1">
            <Link
              to="/faqs"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors min-w-0 break-words ${
                isActive('/faqs')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              FAQs
            </Link>
            {user && !admin && (
              <>
                <Link
                  to="/queries/raise"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors min-w-0 break-words ${
                    isActive('/queries/raise')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Raise Query
                </Link>
                <Link
                  to="/queries/my"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors min-w-0 break-words ${
                    isActive('/queries/my')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  My Questions
                </Link>
              </>
            )}
            {user && admin && (
              <Link
                to="/admin/queries"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors min-w-0 break-words ${
                  isActive('/admin/queries')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                Query Review
              </Link>
            )}
            {user ? (
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/login') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Login
              </Link>
            )}
          </div>
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
  return <Navigate to={user.role === 'admin' ? '/admin/queries' : '/queries/raise'} replace />;
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
