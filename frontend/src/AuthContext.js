// src/AuthContext.js
import React, { createContext, useState } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister } from './api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Store authenticated user info
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Login: call API, store user data
  const login = async (username, password) => {
    const { data } = await apiLogin({ username, password });
    // Expect server to return { user: { id, username, role }, token }
    const { user: userData, token } = data;
    // Save user + token for requests
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Register then login
  const register = async (username, password) => {
    await apiRegister({ username, password });
    return login(username, password);
  };

  // Logout: clear everything
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
