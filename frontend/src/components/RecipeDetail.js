import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRecipe, addComment } from '../api';
import { AuthContext } from '../AuthContext';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating]   = useState(0);      // ← νέο state για το rating
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchRecipe(id)
      .then(res => {
        setRecipe(res.data);
        setComments(res.data.comments || []);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to load recipe:', err);
        setError('Σφάλμα κατά τη φόρτωση συνταγής');
      });
  }, [id]);

  const handleCommentSubmit = async e => {
    e.preventDefault();
    const text = comment.trim();
    if (!text) return;

    try {
      const res = await addComment(id, { text, rating });
      setComments(prev => [...prev, res.data.comments?.slice(-1)[0] || res.data]);
      setComment('');
      setRating(0);
    } catch (err) {
      console.error('Comment submission failed:', err);
      alert('Σφάλμα κατά την αποστολή σχολίου');
    }
  };

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!recipe) return <div className="p-4">Φόρτωση...</div>;
    const ingredientsArray = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : recipe.ingredients
    ? recipe.ingredients.split('\n')
    : [];

  const stepsArray = Array.isArray(recipe.steps)
    ? recipe.steps
    : Array.isArray(recipe.instructions)
    ? recipe.instructions
    : recipe.instructions
    ? recipe.instructions.split('\n')
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900 rounded-lg">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{recipe.title}</h2>
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-96 object-cover rounded-lg shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <p><span className="font-semibold">Χρόνος προετοιμασίας:</span> {recipe.preparationTime}</p>
        <p><span className="font-semibold">Χρόνος μαγειρέματος:</span> {recipe.cookingTime}</p>
      </div>

      <div className="space-y-4 text-gray-800">
        <div>
          <h3 className="text-xl font-semibold mb-1">Συστατικά</h3>
          {ingredientsArray.length > 0 ? (
            ingredientsArray.map((step, idx) => (
              <p
                key={idx}
                className="whitespace-pre-line text-gray-700 dark:text-gray-300 mb-2"
              >
                ➡ {step}
              </p>
            ))
          ) : (
            <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
              Δεν υπάρχουν υλικά.
            </p>
          )}      
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-1">Οδηγίες</h3>
          {stepsArray.length > 0 ? (
              stepsArray.map((step, idx) => (
                <p
                  key={idx}
                  className="whitespace-pre-line text-gray-700 dark:text-gray-300 mb-2"
                >
                  ➡ {step}
                </p>
              ))
            ) : (
              <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                Δεν υπάρχουν οδηγίες.
              </p>
            )}        
        </div>
      </div>

      <section className="pt-6 border-t border-gray-200 dark:border-gray-600">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Σχόλια</h3>
        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map(c => (
              <li className="p-3 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>{c.user}</strong></p>
                {/* Εμφάνιση αστεριών rating δίπλα στο username */}
                <span className="ml-2 text-yellow-400">
                  {'★'.repeat(c.rating) + '☆'.repeat(5 - c.rating)}
                </span>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">Δεν υπάρχουν σχόλια ακόμη.</p>
        )}

        {user ? (
          <form onSubmit={handleCommentSubmit} className="mt-6 space-y-2">
            <div className="flex space-x-1 mb-2">
            {[1,2,3,4,5].map(value => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`text-2xl focus:outline-none ${
                  value <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
              ))}
            </div>
            <textarea
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Γράψτε το σχόλιό σας..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary dark:bg-primary-light text-white font-semibold rounded-md hover:bg-primary-dark transition"
            >
              Υποβολή Σχολίου
            </button>
          </form>
        ) : (
          <p className="mt-4 text-gray-600">
            Παρακαλώ{' '}
            <Link to="/login" className="text-primary font-medium underline">
              συνδεθείτε
            </Link>{' '}
            για να σχολιάσετε.
          </p>
        )}
      </section>
    </div>
  );
}
