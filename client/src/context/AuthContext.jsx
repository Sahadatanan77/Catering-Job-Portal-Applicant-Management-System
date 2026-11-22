import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [applicant, setApplicant] = useState(() => {
    const saved = localStorage.getItem('applicant');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    const loadSession = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const data = await authService.getMe();
          if (data.success) {
            setUser(data.user);
            setApplicant(data.applicant || null);
            localStorage.setItem('user', JSON.stringify(data.user));
            if (data.applicant) {
              localStorage.setItem('applicant', JSON.stringify(data.applicant));
            }
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    loadSession();
  }, []);

  // Login action
  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      setApplicant(res.applicant || null);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      if (res.applicant) {
        localStorage.setItem('applicant', JSON.stringify(res.applicant));
      }
    }
    return res;
  };

  // Register action
  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      setApplicant(res.applicant || null);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      if (res.applicant) {
        localStorage.setItem('applicant', JSON.stringify(res.applicant));
      }
    }
    return res;
  };

  // Logout action
  const logout = () => {
    setToken('');
    setUser(null);
    setApplicant(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('applicant');
  };

  // Update local applicant state when profile is edited
  const updateApplicantState = (updatedApplicant) => {
    setApplicant(updatedApplicant);
    if (updatedApplicant) {
      localStorage.setItem('applicant', JSON.stringify(updatedApplicant));
    } else {
      localStorage.removeItem('applicant');
    }
  };

  const refreshUser = async () => {
    try {
      const data = await authService.getMe();
      if (data.success) {
        setUser(data.user);
        setApplicant(data.applicant || null);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.applicant) {
          localStorage.setItem('applicant', JSON.stringify(data.applicant));
        }
      }
    } catch (err) {
      console.warn('Failed to refresh user:', err.message);
    }
  };

  const isApplicant = user?.role === 'applicant';
  const isHirer = user?.role === 'hirer';

  return (
    <AuthContext.Provider
      value={{
        user,
        applicant,
        token,
        loading,
        isAuthenticated: Boolean(token && user),
        isApplicant,
        isHirer,
        login,
        register,
        logout,
        updateApplicantState,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
