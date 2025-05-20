import React from 'react';
import MealPlanner from './MealPlanner';
import RecipeList from './RecipeList';

export default function Dashboard() {
  return (
    <div className="space-y-12">
      <MealPlanner />
      <hr className="border-gray-300 dark:border-gray-600" />
      <RecipeList />
    </div>
  );
}
