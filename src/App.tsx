import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { RaiseQueryPage } from './features/queries/pages/RaiseQueryPage';
import { MyQuestionsPage } from './features/queries/pages/MyQuestionsPage';
import { QueryDiscussionPage } from './features/queries/pages/QueryDiscussionPage';
import { AdminQueriesPage } from './features/admin/pages/AdminQueriesPage';
import { isAdmin } from './features/queries/types/roleSim';

function NavBar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-between h-14 min-w-0">
          <span className="font-bold text-gray-900 text-base min-w-0 break-words">cs19 FAQ</span>
          <div className="flex items-center gap-1">
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
            {isAdmin() && (
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
          </div>
        </div>
      </div>
    </nav>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 min-w-0">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<NavigateToQueries />} />
            <Route path="/queries/raise" element={<RaiseQueryPage />} />
            <Route path="/queries/my" element={<MyQuestionsPage />} />
            <Route path="/queries/:id" element={<QueryDiscussionPage />} />
            <Route path="/admin/queries" element={<AdminQueriesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function NavigateToQueries() {
  const navigate = useNavigate();
  navigate('/queries/raise', { replace: true });
  return null;
}

function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center min-w-0">
      <div className="text-4xl mb-3">🔍</div>
      <h1 className="text-xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-sm text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link
        to="/queries/raise"
        className="inline-flex bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-6 rounded-lg transition-colors"
      >
        Go to Raise Query
      </Link>
    </div>
  );
}

