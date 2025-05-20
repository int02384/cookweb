// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center py-12 space-y-6">
      <h2 className="text-2xl font-semibold">Καλώς ήρθατε!</h2>
      <p>Συνδεθείτε ή εγγραφείτε για να συνεχίσετε.</p>
      <div className="flex justify-center space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

