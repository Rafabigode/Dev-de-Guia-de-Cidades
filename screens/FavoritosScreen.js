// screens/FavoritosScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';

const FavoritosScreen = () => {
  const { favoriteIds, isLoadingFavorites } = useFavorites();

  if (isLoadingFavorites) {
    return (
      <View style={styles.container}>
        <Text>Carregando favoritos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Cidades Favoritas</Text>
      {favoriteIds.length === 0 ? (
        <Text style={styles.empty}>Nenhuma cidade favoritada ainda.</Text>
      ) : (
        <Text style={styles.ids}>IDs Favoritos: {favoriteIds.join(', ')}</Text>
        // Em aulas futuras, você listará os cards completos aqui
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  empty: {
    fontSize: 16,
    color: '#888',
  },
  ids: {
    fontSize: 16,
    color: '#555',
    paddingHorizontal: 20,
    textAlign: 'center',
  },
});

export default FavoritosScreen;