// context/FavoritesContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  // Carrega os favoritos salvos ao iniciar o app
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('@favorites');
        if (stored !== null) {
          setFavoriteIds(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      } finally {
        setIsLoadingFavorites(false);
      }
    };
    loadFavorites();
  }, []);

  // Adiciona ou remove um favorito
  const toggleFavorite = async (id) => {
    try {
      let updated;
      if (favoriteIds.includes(id)) {
        updated = favoriteIds.filter(fav => fav !== id);
      } else {
        updated = [...favoriteIds, id];
      }
      setFavoriteIds(updated);
      await AsyncStorage.setItem('@favorites', JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao salvar favorito:', error);
    }
  };

  const isFavorite = (id) => favoriteIds.includes(id);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isLoadingFavorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);