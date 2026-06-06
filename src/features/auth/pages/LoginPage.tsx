import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, status, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (status === 'authenticated' && user) {
    return <Navigate to={user.role === 'admin' ? '/admin/queries' : '/queries/raise'} replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const message = await login({ email, password });
    setSubmitting(false);
    if (message) {
      setError(message);
      return;
    }
    navigate('/', { replace: true });
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Login</h1>
      <p className="text-sm text-gray-500 mb-6">Access your intern or admin workspace.</p>
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        New here? <Link to="/register" className="text-blue-600 font-medium">Create an account</Link>
      </p>
    </div>
  );
}
