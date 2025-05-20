import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

export const fetchRecipes  = () => API.get('/recipes');
export const fetchRecipe   = id => API.get(`/recipes/${id}`);
export const createRecipe  = data => API.post('/recipes', data);
export const updateRecipe  = (id, data) => API.put(`/recipes/${id}`, data);
export const deleteRecipe  = id => API.delete(`/recipes/${id}`);

// Σχόλια
export const addComment    = (id, data) =>
  API.post(`/recipes/${id}/comments`, data);

// Meal Planner
export const fetchPlan = weekStart =>
  API.get(`/plans/${weekStart}`);

export const savePlan  = planData =>
  API.post('/plans', planData);

export const registerUser = credentials =>
  API.post('/auth/register', credentials);

export const loginUser = credentials =>
  API.post('/auth/login', credentials);