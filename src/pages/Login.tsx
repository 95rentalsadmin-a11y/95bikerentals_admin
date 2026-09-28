import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMotorcycle, FaLock, FaUser } from 'react-icons/fa';
import { loginAdmin } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginAdmin(username, password);
      localStorage.setItem('adminToken', res.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Try admin / admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-turquoise-blue rounded-full flex items-center justify-center text-white text-3xl">
            <FaMotorcycle />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">95 Bike Rentals</h1>
        <p className="text-center text-slate-500 mb-8">Admin Panel</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-blue focus:border-turquoise-blue outline-none"
                placeholder="admin"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-blue focus:border-turquoise-blue outline-none"
                placeholder="••••••"
                required
              />
            </div>
          </div>
          {error && <p className="text-sm text-hot-pink">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-turquoise-blue hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
