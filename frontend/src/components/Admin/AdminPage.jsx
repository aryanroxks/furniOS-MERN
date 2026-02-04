import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../services/api.js";
import { roles } from '../../services/constants.js';

const AdminPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }
    try {

      setLoading(true);

      const response = await api.post("/users/login", {
        username,
        password
      });

      const user = response.data?.data?.user;

      if (user?.roleID.toString() !== roles.admin) {
        setError('Access denied. Admins only.');
        return;
      }
       

      navigate('/dashboard');

    } catch (err) {
      setError(
        err?.response?.data?.message);
    } finally {
      setLoading(false);
    }

  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Admin Login</h1>
        <p className="text-gray-600 mb-6 text-center">
          Access the Admin Dashboard
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#100F57] text-white py-2 rounded 
                       hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>


      </div>
    </div>
  );
};

export default AdminPage;