// src/components/RecipeList.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchRecipes, deleteRecipe } from '../api';
import { AuthContext } from '../AuthContext';

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [servingsFilter, setServingsFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchRecipes()
      .then(res => {
        setRecipes(res.data);
        setError('');
      })
      .catch(() => setError('Σφάλμα κατά τη φόρτωση συνταγών'))
      .finally(() => setLoading(false));
  }, []);

  const displayed = recipes.filter(r => {
    const matchCat = !categoryFilter ||
      (r.category || '').toLowerCase().includes(categoryFilter.toLowerCase());
    const matchSrv = !servingsFilter || r.servings === Number(servingsFilter);
    return matchCat && matchSrv;
  });

  const handleDelete = id => {
    deleteRecipe(id)
      .then(() => setRecipes(prev => prev.filter(r => r._id !== id)))
      .catch(() => setError('Σφάλμα κατά τη διαγραφή'));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 bg-white dark:bg-gray-900">
      {error && (
        <div className="bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-md prose dark:prose-invert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin h-12 w-12 border-4 border-t-primary rounded-full" />
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Κατηγορία
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                placeholder="π.χ. Desserts"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Μερίδες
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                placeholder="4"
                value={servingsFilter}
                onChange={e => setServingsFilter(e.target.value)}
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium mb-1 text-transparent">
                Καθαρισμός
              </label>
              <button
                onClick={() => { setCategoryFilter(''); setServingsFilter(''); }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Καθαρισμός
              </button>
            </div>
          </div>

          {/* Recipe list */}
          {displayed.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Δεν βρέθηκαν συνταγές.
            </p>
          ) : (
            <ul className="space-y-3">
              {displayed.map(r => (
                <li
                  key={r._id}
                  className="flex justify-between items-center bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900 rounded-lg p-4 hover:shadow-lg transition"
                >
                  <Link
                    to={`/recipes/${r._id}`}
                    className="text-lg font-semibold text-primary hover:underline dark:text-primary-light"
                  >
                    {r.title}
                  </Link>
                  {user?.role === 'admin' && (
                    <div className="flex space-x-4">
                      <Link
                        to={`/edit/${r._id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline transition"
                      >
                        Επεξεργασία
                      </Link>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="text-accent-dark dark:text-accent-light hover:text-accent transition"
                      >
                        Διαγραφή
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}