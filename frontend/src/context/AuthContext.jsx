import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => localStorage.getItem('eventify_admin_token'));
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('eventify_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('eventify_admin_token');
    if (savedToken) {
      setTokenState(savedToken);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await api.login(username, password);
    setTokenState(res.token);
    const userObj = { username };
    setAdminUser(userObj);
    localStorage.setItem('eventify_admin_user', JSON.stringify(userObj));
    return res;
  };

  const logout = () => {
    setToken(null);
    setTokenState(null);
    setAdminUser(null);
    localStorage.removeItem('eventify_admin_user');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, adminUser, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
