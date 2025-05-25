// src/components/Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/app');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white dark:bg-gray-800 rounded shadow dark:shadow-gray-900">
      <h2 className="text-2xl mb-4 text-gray-900 dark:text-gray-100">Σύνδεση</h2>
      {error && (
        <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">Username</label>
          <input
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white p-2 rounded transition"
        >
          Σύνδεση
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
        Δεν έχεις λογαριασμό?{' '}
        <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
          Εγγραφή
        </Link>
      </p>
    </div>
  );
}
