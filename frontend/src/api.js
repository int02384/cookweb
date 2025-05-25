import axios from 'axios';
// 🌍 Axios Global Defaults
axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;

// Συνταγές
export const fetchRecipes  = () => axios.get('/recipes');
export const fetchRecipe   = id => axios.get(`/recipes/${id}`);
export const createRecipe  = data => axios.post('/recipes/add', data);
export const updateRecipe  = (id, data) => axios.put(`/recipes/${id}`, data);
export const deleteRecipe  = id => axios.delete(`/recipes/${id}`);

// Σχόλια
export const addComment    = (id, data) => axios.post(`/recipes/${id}/comments`, data);

// Meal Planner
export const fetchPlan     = weekStart => axios.get(`/plans/${weekStart}`);
export const savePlan      = planData => axios.post('/plans', planData);

// Authentication
export const registerUser  = credentials => axios.post('/auth/register', credentials);
export const loginUser     = credentials => axios.post('/auth/login', credentials);
export const logOut = () => axios.post('/auth/logout');