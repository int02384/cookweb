import React, { useState } from 'react';
import { createRecipe } from '../api';
import { useNavigate } from 'react-router-dom';

export default function RecipeForm() {
  const [form, setForm] = useState({
    title: '',
    ingredients: [''],
    steps: [''],
    servings: 1,
    unit: 'pieces',
    category: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) {
      errs.title = 'Ο τίτλος είναι υποχρεωτικός';
    }
    if (
      form.ingredients.length === 0 ||
      form.ingredients.some(i => !i.trim())
    ) {
      errs.ingredients = 'Πρέπει να βάλεις τουλάχιστον ένα υλικό (μη κενό)';
    }
    if (
      form.steps.length === 0 ||
      form.steps.some(s => !s.trim())
    ) {
      errs.steps = 'Πρέπει να γράψεις τουλάχιστον ένα βήμα (μη κενό)';
    }
    if (!form.servings || form.servings < 1) {
      errs.servings = 'Οι μερίδες πρέπει να είναι θετικός αριθμός';
    }
    if (!form.category.trim()) {
      errs.category = 'Η κατηγορία είναι υποχρεωτική';
    }
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    try {
      await createRecipe(form);
      navigate('/');
    } catch (err) {
      console.error(err);
      setErrors(err);
      // μπορείτε να βάλετε setErrors({ api: 'Σφάλμα κατά τη δημιουργία' })
    }
  };

  const onChange = (e, idx, field) => {
    const updated = [...form[field]];
    updated[idx] = e.target.value;
    setForm({ ...form, [field]: updated });
  };
  const onAdd = field => {
    setForm({ ...form, [field]: [...form[field], ''] });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Νέα Συνταγή</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Τίτλος</label>
          <input
            type="text"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && (
            <div className="invalid-feedback">
              {errors.title}
            </div>
          )}
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label">Κατηγορία</label>
          <input
            type="text"
            className={`form-control ${errors.category ? 'is-invalid' : ''}`}
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />
          {errors.category && (
            <div className="invalid-feedback">
              {errors.category}
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className="mb-3">
          <label className="form-label">Υλικά</label>
          {form.ingredients.map((ing, i) => (
            <div className="input-group mb-2" key={i}>
              <input
                type="text"
                className={`form-control ${errors.ingredients ? 'is-invalid' : ''}`}
                value={ing}
                onChange={e => onChange(e, i, 'ingredients')}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => onAdd('ingredients')}
              >
                +
              </button>
            </div>
          ))}
          {errors.ingredients && (
            <div className="invalid-feedback d-block">
              {errors.ingredients}
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="mb-3">
          <label className="form-label">Βήματα</label>
          {form.steps.map((step, i) => (
            <div className="input-group mb-2" key={i}>
              <textarea
                className={`form-control ${errors.steps ? 'is-invalid' : ''}`}
                value={step}
                onChange={e => onChange(e, i, 'steps')}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => onAdd('steps')}
              >
                +
              </button>
            </div>
          ))}
          {errors.steps && (
            <div className="invalid-feedback d-block">
              {errors.steps}
            </div>
          )}
        </div>

        {/* Servings & Unit */}
        <div className="mb-3 row g-2 align-items-center">
          <div className="col-auto">
            <label className="form-label">Μερίδες</label>
            <input
              type="number"
              min="1"
              className={`form-control ${errors.servings ? 'is-invalid' : ''}`}
              value={form.servings}
              onChange={e => setForm({ ...form, servings: Number(e.target.value) })}
            />
            {errors.servings && (
              <div className="invalid-feedback">
                {errors.servings}
              </div>
            )}
          </div>
          <div className="col-auto">
            <label className="form-label">Μονάδα</label>
            <select
              className="form-select"
              value={form.unit}
              onChange={e => setForm({ ...form, unit: e.target.value })}
            >
              <option value="pieces">pieces</option>
              <option value="grams">grams</option>
              <option value="cups">cups</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Αποθήκευση
        </button>
      </form>
    </div>
  );
}



