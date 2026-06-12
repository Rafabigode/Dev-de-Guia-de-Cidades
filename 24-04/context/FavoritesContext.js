import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();
const FAVORITES_KEY = '@GuiaTuristico:favorites';

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored !== null) setFavoriteIds(JSON.parse(stored));
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setIsLoadingFavorites(false);
    }
  }, []);

  const saveFavorites = useCallback(async (ids) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }, []);

  useEffect(() => { loadFavorites(); }, [loadFavorites]);
  useEffect(() => {
    if (!isLoadingFavorites) saveFavorites(favoriteIds);
  }, [favoriteIds, isLoadingFavorites, saveFavorites]);

  const toggleFavorite = (pontoId) => {
    setFavoriteIds(prev =>
      prev.includes(pontoId) ? prev.filter(id => id !== pontoId) : [...prev, pontoId]
    );
  };

  const isFavorite = useCallback((pontoId) => favoriteIds.includes(pontoId), [favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isLoadingFavorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
