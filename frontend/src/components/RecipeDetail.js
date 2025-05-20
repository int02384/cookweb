import React, { useState, useEffect } from 'react';
import { fetchRecipe, addComment } from '../api';
import { useParams, Link } from 'react-router-dom';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [commentForm, setCommentForm] = useState({ user: '', text: '', rating: 5 });

  useEffect(() => {
    setLoading(true);
    fetchRecipe(id)
      .then(res => { setRecipe(res.data); setError(''); })
      .catch(() => setError('Σφάλμα κατά τη φόρτωση συνταγής'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCommentChange = e =>
    setCommentForm({ ...commentForm, [e.target.name]: e.target.value });

  const submitComment = async e => {
    e.preventDefault();
    try {
      await addComment(id, { ...commentForm, rating: +commentForm.rating });
      const res = await fetchRecipe(id);
      setRecipe(res.data);
      setCommentForm({ user: '', text: '', rating: 5 });
      setError('');
    } catch {
      setError('Σφάλμα κατά την υποβολή σχολίου');
    }
  };

  return (
    <article className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6 prose lg:prose-xl dark:prose-invert">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin h-12 w-12 border-4 border-t-primary rounded-full" />
        </div>
      ) : (
        recipe && (
          <>
            <h1>{recipe.title}</h1>
            <p><strong>Μερίδες:</strong> {recipe.servings} {recipe.unit}</p>

            <h2>Υλικά</h2>
            <ul>{recipe.ingredients.map((ing,i) => <li key={i}>{ing}</li>)}</ul>

            <h2>Βήματα</h2>
            <ol>{recipe.steps.map((s,i) => <li key={i}>{s}</li>)}</ol>

            <h2>Βαθμολογία: {recipe.rating.toFixed(1)} / 5</h2>
            <h2>Σχόλια</h2>
            <ul className="space-y-4">
              {recipe.comments.map((c,i) => (
                <li key={i} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                  <p className="font-semibold">{c.user} <span className="text-sm text-gray-500 dark:text-gray-400">({new Date(c.date).toLocaleDateString()})</span></p>
                  <p>{c.text}</p>
                  <p className="text-sm">Rating: {c.rating} / 5</p>
                </li>
              ))}
            </ul>
         


            <form onSubmit={submitComment} className="space-y-4">
              <h2>Πρόσθεσε Σχόλιο</h2>
              <input
                name="user"
                placeholder="Το όνομά σου"
                required
                className="w-full border rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                value={commentForm.user}
                onChange={handleCommentChange}
              />
              <textarea
                name="text"
                placeholder="Το σχόλιό σου"
                required
                rows="3"
                className="w-full border rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                value={commentForm.text}
                onChange={handleCommentChange}
              />
              <div>
                <label>Rating</label>
                <select
                  name="rating"
                  className="ml-2 border rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  value={commentForm.rating}
                  onChange={handleCommentChange}
                >
                  {[5,4,3,2,1,0].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
              >
                Υποβολή
              </button>
            </form>

            <div className="flex gap-2">
              <Link
                to="/"
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              >
                Επιστροφή
              </Link>
              <Link
                to={`/edit/${recipe._id}`}
                className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition"
              >
                Επεξεργασία
              </Link>
            </div>
          </>
        )
      )}
    </article>
);
}
