import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [applicant, setApplicant] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      const storedApplicant = await AsyncStorage.getItem('applicant');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedApplicant) {
          setApplicant(JSON.parse(storedApplicant));
        }

        // Verify with server in background
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            if (res.data.applicant) {
              setApplicant(res.data.applicant);
              await AsyncStorage.setItem('applicant', JSON.stringify(res.data.applicant));
            }
          }
        } catch (e) {
          console.warn('Token validation skipped or failed:', e.message);
        }
      }
    } catch (err) {
      console.warn('Failed loading stored auth state:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, expectedRole) => {
    const res = await api.post('/auth/login', {
      email,
      password,
      expectedRole,
    });

    if (res.data.success) {
      const { token: newToken, user: newUser, applicant: newApplicant } = res.data;
      setToken(newToken);
      setUser(newUser);
      setApplicant(newApplicant || null);

      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      if (newApplicant) {
        await AsyncStorage.setItem('applicant', JSON.stringify(newApplicant));
      }
      return { success: true, user: newUser };
    }
    return { success: false, message: res.data.message };
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      const { token: newToken, user: newUser, applicant: newApplicant } = res.data;
      setToken(newToken);
      setUser(newUser);
      setApplicant(newApplicant || null);

      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      if (newApplicant) {
        await AsyncStorage.setItem('applicant', JSON.stringify(newApplicant));
      }
      return { success: true, user: newUser };
    }
    return { success: false, message: res.data.message };
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setApplicant(null);
    await AsyncStorage.multiRemove(['token', 'user', 'applicant']);
  };

  const updateApplicantProfile = (updated) => {
    setApplicant(updated);
    AsyncStorage.setItem('applicant', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        applicant,
        token,
        loading,
        role: user?.role,
        login,
        register,
        logout,
        updateApplicantProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
