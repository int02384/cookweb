import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RecipeList   from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import RecipeForm   from './components/RecipeForm';
import EditRecipe   from './components/EditRecipe';
import Header from './components/Header';
// import MealPlanner  from './components/MealPlanner';
import Login        from './components/Login';
import Logout       from './components/Logout';
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
        <Header/>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<RecipeList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/logout" element={<Logout />} />
        
          {/* Private routes */}
          <Route path="/new" element={<PrivateRoute><RecipeForm/></PrivateRoute>}/>
          <Route path="/edit/:id" element={<PrivateRoute><EditRecipe/></PrivateRoute>}/>
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
