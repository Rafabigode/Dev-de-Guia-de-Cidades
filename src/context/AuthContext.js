import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('@gnuocto_user');
      if (userData) setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    // Simulate login - replace with real API
    if (!email || !password) throw new Error('Preencha todos os campos');
    if (password.length < 6) throw new Error('Senha deve ter pelo menos 6 caracteres');

    const userData = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      avatar: null,
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem('@gnuocto_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    if (!name || !email || !password) throw new Error('Preencha todos os campos');
    if (password.length < 6) throw new Error('Senha deve ter pelo menos 6 caracteres');

    const userData = {
      id: Date.now().toString(),
      name,
      email,
      avatar: null,
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem('@gnuocto_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@gnuocto_user');
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const updated = { ...user, ...updates };
    await AsyncStorage.setItem('@gnuocto_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
