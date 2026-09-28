import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="text-6xl font-bold text-slate-300 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">Page not found</h2>
      <p className="text-slate-500 mb-6">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="px-6 py-2 bg-turquoise-blue hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
