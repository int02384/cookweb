// frontend/src/components/MealPlanner.js
import React, { useState, useEffect } from 'react';
import { fetchRecipes, fetchPlan, savePlan } from '../api';

const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const meals = ['Breakfast','Lunch','Dinner'];

// Υπολογίζει την ημερομηνία της Δευτέρας για τη δεδομένη μέρα
function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();            // Κυριακή=0, Δευτέρα=1, …
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

export default function MealPlanner() {
  const [recipes, setRecipes] = useState([]);
  const [plan, setPlan]       = useState({ slots: [] });
  const monday               = getMonday(new Date());
  const weekStart           = monday.toISOString();

  // Φόρτωμα δεδομένων
  useEffect(() => {
    fetchRecipes().then(res => setRecipes(res.data));
    fetchPlan(weekStart).then(res => {
      // res.data αν υπάρχει, αλλιώς res
      setPlan(res.data || res);
    });
  }, [weekStart]);

  // Επιστρέφει το recipeId για ένα slot (ή '' αν κενό)
  const getRecipeId = (day, mealType) => {
    const slot = plan.slots.find(
      s => s.day === day && s.mealType === mealType
    );
    return slot ? slot.recipe._id || slot.recipe : '';
  };

  // Όταν αλλάζει <select>, ενημέρωσε local state
   const onSlotChange = (day, mealType, recipeId) => {
  // 1) λίγα logs για debugging
  console.log('🍽️ onSlotChange:', { day, mealType, recipeId });

  // 2) φιλτράρουμε όλα τα άλλα slots
  const otherSlots = plan.slots.filter(
    s => !(s.day === day && s.mealType === mealType)
  );

  // 3) συνθέτουμε το καινούριο plan.slots
  const updated = {
    ...plan,
    slots: [...otherSlots, { day, mealType, recipe: recipeId }]
  };

  console.log('🍱 New plan.slots:', updated.slots);

  // 4) ενημερώνουμε state
  setPlan(updated);
};


  // Αποθήκευση στο backend
  const handleSave = () => {

     const payload = {
    weekStart,
    slots: plan.slots.map(s => ({
      day: s.day,
      mealType: s.mealType,
      recipe: typeof s.recipe === 'string' ? s.recipe : s.recipe._id
    }))
  };
   savePlan(payload)
    .then(() => alert('Το πλάνο αποθηκεύτηκε!'))
    .catch(err => {
      console.error(err);
      alert('Σφάλμα κατά την αποθήκευση.');
    });
};

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-primary dark:text-primary-light">
        Πλάνο Γευμάτων (Εβδομάδα από {monday.toLocaleDateString()})
      </h1>

      <div className="overflow-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1"></th>
              {days.map(d => (
                <th key={d} className="border px-2 py-1 text-center">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meals.map(meal => (
              <tr key={meal}>
                <td className="border px-2 py-1 font-medium">
                  {meal}
                </td>
                {days.map(day => (
                  <td key={day} className="border px-2 py-1">
                    <select
                      className="w-full border rounded px-2 py-1 focus:ring-primary focus:border-primary"
                      value={getRecipeId(day, meal)}
                      onChange={e =>
                        onSlotChange(day, meal, e.target.value)
                      }
                    >
                      <option value="">–</option>
                      {recipes.map(r => (
                        <option key={r._id} value={r._id}>
                          {r.title}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSave}
        className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
      >
        Αποθήκευση Πλάνου
      </button>
    </div>
  );
}
