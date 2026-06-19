import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext({});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user) loadFavorites();
    else setFavorites([]);
  }, [user]);

  const getKey = () => `@gnuocto_favorites_${user?.id}`;

  const loadFavorites = async () => {
    try {
      const data = await AsyncStorage.getItem(getKey());
      if (data) setFavorites(JSON.parse(data));
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (updated) => {
    await AsyncStorage.setItem(getKey(), JSON.stringify(updated));
    setFavorites(updated);
  };

  const addFavorite = async (city) => {
    const updated = [...favorites, { ...city, savedAt: new Date().toISOString() }];
    await saveFavorites(updated);
  };

  const removeFavorite = async (cityId) => {
    const updated = favorites.filter(f => f.id !== cityId);
    await saveFavorites(updated);
  };

  const isFavorite = (cityId) => favorites.some(f => f.id === cityId);

  const toggleFavorite = async (city) => {
    if (isFavorite(city.id)) {
      await removeFavorite(city.id);
    } else {
      await addFavorite(city);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
