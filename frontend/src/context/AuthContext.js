import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const saved = localStorage.getItem('user');
      // FIX: check saved is not null or "undefined" string before parsing
      if (token && saved && saved !== 'undefined') {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      // If anything goes wrong just clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    const decoded = jwtDecode(data.token);
    const userData = {
      id: decoded.id,
      role: decoded.role,
      name: decoded.name || email.split('@')[0],
      email: email,
    };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    await registerUser(formData);
    return await login(formData.email, formData.password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};