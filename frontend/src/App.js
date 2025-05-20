import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RecipeList   from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import RecipeForm   from './components/RecipeForm';
import EditRecipe   from './components/EditRecipe';
import MealPlanner  from './components/MealPlanner';
import Login        from './components/Login';
import Register     from './components/Register';
import Home         from './components/Home';
import { AuthProvider, AuthContext } from './AuthContext';

// Wrapper για προστατευμένες routes
function PrivateRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  return user
    ? children
    : <Navigate to="/login" replace />;

}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="container mx-auto p-4 space-y-8">
          <h1 className="text-3xl font-bold text-center">
            Πλατφόρμα Συνταγών Μαγειρικής
          </h1>
          <Routes>
            {/* Public routes */}
            <Route path="/"        element={<Home />} />
            <Route path="/login"   element={<Login />} />
            <Route path="/register"element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/app"
              element={
                <PrivateRoute>
                  <div className="space-y-12">
                    <MealPlanner />
                    <RecipeList />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/new"
              element={
                <PrivateRoute>
                  <RecipeForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <PrivateRoute>
                  <EditRecipe />
                </PrivateRoute>
              }
            />
            <Route
              path="/recipes/:id"
              element={
                <PrivateRoute>
                  <RecipeDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/planner"
              element={
                <PrivateRoute>
                  <MealPlanner />
                </PrivateRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

