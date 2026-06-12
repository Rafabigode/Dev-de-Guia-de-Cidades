import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';

const PontoTuristicoCard = ({ ponto, onPress }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favoritado = isFavorite(ponto.id);

  return (
    <TouchableOpacity onPress={onPress} style={styles.touchable}>
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.titulo} numberOfLines={2}>{ponto.nome}</Text>
          <Text style={styles.descricao} numberOfLines={2}>{ponto.descricao}</Text>
          {ponto.categoria && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{ponto.categoria}</Text>
            </View>
          )}
          <Text style={styles.verMais}>Ver detalhes →</Text>
        </View>
        <TouchableOpacity
          onPress={() => toggleFavorite(ponto.id)}
          style={styles.favBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.favIcon}>{favoritado ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: { width: '100%' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    marginVertical: 5,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  info: { flex: 1, marginRight: 10 },
  titulo: { fontSize: 14, fontWeight: 'bold', color: '#1a2b3c', marginBottom: 4, textTransform: 'capitalize' },
  descricao: { fontSize: 12, color: '#666', lineHeight: 17, marginBottom: 6 },
  badge: { backgroundColor: '#e8f0fe', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginBottom: 6 },
  badgeText: { color: '#1a5276', fontSize: 11, fontWeight: '700' },
  verMais: { fontSize: 12, color: '#1a5276', fontWeight: '600' },
  favBtn: { padding: 5 },
  favIcon: { fontSize: 22 },
});

export default PontoTuristicoCard;
