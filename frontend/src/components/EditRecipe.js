// frontend/src/components/EditRecipe.js
import React, { useState, useEffect } from 'react';
import { fetchRecipe, updateRecipe } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    category: '',
    ingredients: [''],
    steps: [''],
    servings: 1,
    unit: 'pieces',
    imageFile: null,      // το αρχείο που επέλεξε ο χρήστης
    imageUrl: 'https://images.app.goo.gl/DHquqod4DUTt6cd38',          // το URL της υπάρχουσας εικόνας
    preparationTime: 0,   // χρόνος προετοιμασίας σε λεπτά
    cookingTime: 0        // χρόνος μαγειρέματος σε λεπτά
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Φόρτωση αρχικών δεδομένων
  useEffect(() => {
    setLoading(true);
    fetchRecipe(id)
      .then(res => {
        const {
          title,
          category,
          ingredients,
          steps,
          servings,
          unit,
          imageUrl,
          preparationTime,
          cookingTime
        } = res.data;
        setForm({
          title,
          category,
          ingredients,
          steps,
          servings,
          unit,
          imageFile: null,
          imageUrl: imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Arta_Bridge_Epirus_Greece.jpg/960px-Arta_Bridge_Epirus_Greece.jpg',
          preparationTime: preparationTime || 0,
          cookingTime: cookingTime || 0
        });
        setError('');
      })
      .catch(() => {
        setError('Σφάλμα κατά τη φόρτωση της συνταγής');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const onChangeArray = (e, idx, field) => {
    const arr = [...form[field]];
    arr[idx] = e.target.value;
    setForm({ ...form, [field]: arr });
  };

  const addField = field => {
    setForm({ ...form, [field]: [...form[field], ''] });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    
    if (
      !form.title.trim() ||
      form.ingredients.some(i => !i.trim()) ||
      form.steps.some(s => !s.trim())
    ) {
      setError('Συμπλήρωσε όλα τα υποχρεωτικά πεδία.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      
      await updateRecipe(id, {
        title: form.title,
        category: form.category,
        ingredients: form.ingredients,
        steps: form.steps,
        servings: form.servings,
        unit: form.unit,
        preparationTime: form.preparationTime,
        cookingTime: form.cookingTime
      });

      if (form.imageFile) {
        const fd = new FormData();
        fd.append('image', form.imageFile);
        await fetch(`/api/recipes/${id}/upload`, {
          method: 'POST',
          body: fd
        });
      }

      
      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error(err);
      setError('Σφάλμα κατά την αποθήκευση της συνταγής.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin h-12 w-12 border-4 border-t-primary rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-serif text-primary dark:text-primary-light">
        Επεξεργασία Συνταγής
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Τίτλος</label>
          <input
            type="text"
            required
            className="w-full border rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Current Image Preview */}
        {form.imageUrl && (
          <div>
            <label className="block text-sm font-medium mb-1">Υπάρχουσα Εικόνα</label>
            <img
              src={form.imageUrl}
              alt={form.title}
              className="w-full max-h-64 object-cover rounded-md mb-4"
            />
          </div>
        )}

        {/* Upload New Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Νέα Εικόνα</label>
          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={e => {
              const file = e.target.files[0];
              setForm({ ...form, imageFile: file });
            }}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Κατηγορία</label>
          <input
            type="text"
            placeholder="π.χ. Desserts"
            className="w-full border rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />
        </div>

        {/* Preparation & Cooking Times */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Χρόνος Προετοιμασίας (λεπτά)</label>
            <input
              type="number"
              min="0"
              className="w-full border rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
              value={form.preparationTime}
              onChange={e => setForm({ ...form, preparationTime: parseInt(e.target.value, 10) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Χρόνος Μαγειρέματος (λεπτά)</label>
            <input
              type="number"
              min="0"
              className="w-full border rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
              value={form.cookingTime}
              onChange={e => setForm({ ...form, cookingTime: parseInt(e.target.value, 10) || 0 })}
            />
          </div>
        </div>


        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium mb-1">Υλικά</label>
          <div className="space-y-2">
            {form.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  required
                  className="flex-1 border rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  value={ing}
                  onChange={e => onChangeArray(e, i, 'ingredients')}
                />
                {i === form.ingredients.length - 1 && (
                  <button
                    type="button"
                    className="px-2 py-1 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                    onClick={() => addField('ingredients')}
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div>
          <label className="block text-sm font-medium mb-1">Βήματα</label>
          <div className="space-y-2">
            {form.steps.map((step, i) => (
              <div key={i} className="flex items-start space-x-2">
                <textarea
                  required
                  rows="2"
                  className="flex-1 border rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  value={step}
                  onChange={e => onChangeArray(e, i, 'steps')}
                />
                {i === form.steps.length - 1 && (
                  <button
                    type="button"
                    className="px-2 py-1 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                    onClick={() => addField('steps')}
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Servings & Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Μερίδες</label>
            <input
              type="number"
              min="1"
              required
              className="w-full border rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
              value={form.servings}
              onChange={e =>
                setForm({ ...form, servings: parseInt(e.target.value, 10) })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Μονάδα</label>
            <select
              className="w-full border rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
              value={form.unit}
              onChange={e => setForm({ ...form, unit: e.target.value })}
            >
              <option value="grams">grams</option>
              <option value="pieces">pieces</option>
              <option value="ml">ml</option>
              <option value="cups">cups</option>
              <option value="tbsp">tbsp</option>
              <option value="tsp">tsp</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="inline-flex items-center">
              <span className="animate-spin h-4 w-4 border-2 border-t-white rounded-full mr-2" />
              Αποθήκευση...
            </span>
          ) : (
            'Αποθήκευση'
          )}
        </button>
      </form>
    </div>
  );
}




