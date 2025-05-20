// src/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Κατά το mount, δες αν υπάρχει ήδη token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = jwtDecode(token);
      setUser({ username: payload.username });
    }
  }, []);

  // Συνάρτηση login
  const login = async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Σφάλμα σύνδεσης');
    const { token } = await res.json();
    localStorage.setItem('token', token);
    const { username: usern } = jwtDecode(token);
    setUser({ username: usern });
  };

  // Συνάρτηση register
  const register = async (username, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Σφάλμα εγγραφής');
    // μετά εγγραφή κάνουμε αυτόματα login
    return login(username, password);
  };

  // Συνάρτηση logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
