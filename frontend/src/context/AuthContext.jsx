import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, getToken, onUnauthorized, setToken } from '../services/api';

const AuthContext = createContext(null);

const USER_KEY = 'eventify_admin_user';

// Reads the expiry from the JWT payload. The server still verifies the
// signature; this only avoids showing the admin panel with a dead session.
function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function loadSession() {
  const token = getToken();
  if (!isTokenValid(token)) {
    setToken(null);
    return { token: null, user: null };
  }
  try {
    return { token, user: JSON.parse(localStorage.getItem(USER_KEY)) };
  } catch {
    return { token, user: null };
  }
}

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(loadSession);

  const logout = useCallback(() => {
    setToken(null);
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
    setSession({ token: null, user: null });
  }, []);

  // Any 401 from an admin request ends the session.
  useEffect(() => {
    onUnauthorized(logout);
    return () => onUnauthorized(null);
  }, [logout]);

  // Log out exactly when the token expires if the tab stays open.
  useEffect(() => {
    if (!session.token) return undefined;
    try {
      const { exp } = JSON.parse(atob(session.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      const timer = setTimeout(logout, Math.max(0, exp * 1000 - Date.now()));
      return () => clearTimeout(timer);
    } catch {
      return undefined;
    }
  }, [session.token, logout]);

  const login = async (username, password) => {
    const res = await api.login(username, password);
    const user = res.admin ?? { username };
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
    setSession({ token: res.token, user });
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        token: session.token,
        adminUser: session.user,
        isAuthenticated: !!session.token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
