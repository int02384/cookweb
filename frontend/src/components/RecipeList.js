import React, { useEffect, useState } from 'react';
import { fetchRecipes, deleteRecipe } from '../api';
import { Link } from 'react-router-dom';

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [servingsFilter, setServingsFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleDelete = async id => {
    try {
      await deleteRecipe(id);
      setRecipes(recipes.filter(r => r._id !== id));
    } catch {
      alert('Σφάλμα κατά τη διαγραφή');
    }
  };

  const displayed = recipes.filter(r => {
    const matchCat = !categoryFilter || (r.category || '')
      .toLowerCase()
      .includes(categoryFilter.toLowerCase());
    const matchSrv = !servingsFilter || r.servings === Number(servingsFilter);
    return matchCat && matchSrv;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md prose dark:prose-invert">
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
                className="w-full border rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
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
                className="w-full border rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                placeholder="4"
                min="1"
                value={servingsFilter}
                onChange={e => setServingsFilter(e.target.value)}
              />
            </div>
            <button
              onClick={() => { setCategoryFilter(''); setServingsFilter(''); }}
              className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Καθαρισμός
            </button>
          </div>

          {/* New Recipe */}
          <Link
            to="/new"
            className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
          >
            Προσθήκη Νέας Συνταγής
          </Link>

          {/* List */}
          <ul className="space-y-3">
            {displayed.map(r => (
              <li
                key={r._id}
                className="flex justify-between items-center bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-lg transition"
              >
                <Link
                  to={`/recipes/${r._id}`}
                  className="text-lg font-semibold text-primary hover:underline dark:text-primary-light"
                >
                  {r.title}
                </Link>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="text-accent-dark hover:text-accent transition"
                >
                  Διαγραφή
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
);
}




