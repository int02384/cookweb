import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../api';

export default function Header() {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false);

    // Ανίχνευση & εφαρμογή theme
    useEffect(() => {
    const stored = localStorage.getItem('theme'); // "dark" | "light" | null
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // if stored is null, coalesce to `'dark'` or `'light'` based on systemPrefersDark
    const theme = stored ?? (systemPrefersDark ? 'dark' : 'light');
    const shouldBeDark = (theme === 'dark');

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
    }, []);
    // Εναλλαγή θεμάτων
    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        document.documentElement.classList.toggle('dark', newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };


    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <nav className="container mx-auto flex justify-between items-center p-4">
                <a  onClick={() => navigate('/')} className="text-2xl font-bold text-primary dark:text-primary-light">
                    Πλατφόρμα Συνταγών
                </a>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="text-xl px-2 py-1 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Εναλλαγή Θέματος"
                    >
                        {isDark ? '🌙' : '🌞'}
                    </button>
                    {user?.role === 'admin' && (
                        <Link
                        to="/new"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                        >
                        Προσθήκη Συνταγής
                        </Link>
                    )}
                    {user ? (
                        <button
                            onClick={() => navigate('/logout')}
                            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                        Logout
                        </button>
                    ) : (
                        <>
                        <Link
                            to="/login"
                            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Register
                        </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
