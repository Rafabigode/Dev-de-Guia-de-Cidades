import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PontoTuristicoCard = ({ nome, descricao, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.touchable}>
      <View style={styles.card}>
        <Text style={styles.titulo} numberOfLines={2}>{nome}</Text>
        <Text style={styles.descricao} numberOfLines={3}>{descricao}</Text>
        <Text style={styles.verMais}>Ver detalhes →</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1a2b3c',
  },
  descricao: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  verMais: {
    fontSize: 13,
    color: '#1a5276',
    fontWeight: '600',
  },
});

export default PontoTuristicoCard;
