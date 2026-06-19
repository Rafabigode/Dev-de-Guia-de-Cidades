import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Cidade } from '../dados';

type Props = {
  cidade: Cidade;
  onPress: () => void;
};

const CidadeCard = ({ cidade, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.accentBar, { backgroundColor: cidade.tagColor }]} />

      <View style={styles.conteudo}>
        <View style={styles.tagRow}>
          <View style={[styles.tag, { backgroundColor: cidade.tagColor }]}>
            <Text style={styles.tagText}>{cidade.categoria}</Text>
          </View>
          <Text style={styles.pais}>🌍 {cidade.pais}</Text>
        </View>

        <Text style={styles.titulo}>{cidade.nome}</Text>
        <Text style={styles.descricao} numberOfLines={2}>{cidade.descricao}</Text>

        <View style={styles.rodape}>
          <Text style={styles.populacao}>👥 {cidade.populacao}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cidade.entrada}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0D1F35',
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  accentBar: { width: 4 },
  conteudo: { flex: 1, padding: 16 },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  tagText: { color: '#fff', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  pais: { color: '#667', fontSize: 11 },
  titulo: { fontSize: 17, fontWeight: 'bold', color: '#E8F0FE', marginBottom: 6 },
  descricao: { fontSize: 13, color: '#8899AA', lineHeight: 19, marginBottom: 14 },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#112244',
    paddingTop: 10,
  },
  populacao: { color: '#667', fontSize: 12, flex: 1 },
  badge: {
    backgroundColor: '#0A2540',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1A3A5C',
  },
  badgeText: { color: '#38BDF8', fontSize: 12, fontWeight: 'bold' },
});

export default CidadeCard;
