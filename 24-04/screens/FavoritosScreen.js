import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
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
      {favoriteIds.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={styles.emptyText}>Nenhum ponto favoritado ainda.</Text>
          <Text style={styles.emptySubText}>Explore a lista e adicione seus favoritos!</Text>
        </View>
      ) : (
        <>
          <Text style={styles.contador}>{favoriteIds.length} favorito(s)</Text>
          <FlatList
            data={favoriteIds}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.favIcon}>❤️</Text>
                <Text style={styles.favId}>Ponto ID: {item}</Text>
              </View>
            )}
            contentContainerStyle={styles.lista}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#1a2b3c', marginBottom: 8 },
  emptySubText: { fontSize: 14, color: '#888', textAlign: 'center' },
  contador: { fontSize: 13, color: '#888', padding: 16 },
  lista: { paddingHorizontal: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    gap: 12,
  },
  favIcon: { fontSize: 24 },
  favId: { fontSize: 15, color: '#1a2b3c', fontWeight: '600' },
});

export default FavoritosScreen;
