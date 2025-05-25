import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Logout() {
  const { logout } = useContext(AuthContext); // 🔥 this gives you access to AuthProvider's logout()
  const navigate = useNavigate();

  useEffect(() => {
    const runLogout = async () => {
      await logout();         // 🔁 Calls the logout logic from AuthProvider
      navigate('/');     // ✅ Redirect to login
    };

    runLogout();
  }, [logout, navigate]);

  return null;
}