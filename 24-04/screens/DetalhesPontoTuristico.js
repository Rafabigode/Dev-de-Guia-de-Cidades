import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFavorites } from '../context/FavoritesContext';

const DetalhesPontoTuristico = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { pontoDetalhes } = route.params;

  if (!pontoDetalhes) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Detalhes não encontrados.</Text>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <Text style={styles.botaoVoltarTexto}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const favoritado = isFavorite(pontoDetalhes.id);

  return (
    <ScrollView style={styles.scrollContainer}>
      <Image source={{ uri: pontoDetalhes.imagem }} style={styles.imagem} resizeMode="cover" />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.titulo}>{pontoDetalhes.nome}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(pontoDetalhes.id)} style={styles.favBtn}>
            <Text style={styles.favIcon}>{favoritado ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.id}>ID: #{pontoDetalhes.id}</Text>
        {pontoDetalhes.categoria && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pontoDetalhes.categoria}</Text>
          </View>
        )}

        <View style={styles.divisor} />
        <Text style={styles.secaoTitulo}>📝 Descrição</Text>
        <Text style={styles.descricao}>{pontoDetalhes.descricao}</Text>

        <View style={styles.divisor} />
        <Text style={styles.secaoTitulo}>📋 Detalhes Completos</Text>
        <Text style={styles.detalhes}>{pontoDetalhes.detalhesCompletos}</Text>

        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <Text style={styles.botaoVoltarTexto}>← Voltar para a Lista</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: '#f0f4f8' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  imagem: { width: '100%', height: 220, backgroundColor: '#ccc' },
  content: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#1a2b3c', flex: 1, marginRight: 10, textTransform: 'capitalize' },
  favBtn: { padding: 4 },
  favIcon: { fontSize: 26 },
  id: { fontSize: 13, color: '#999', marginBottom: 8 },
  badge: { backgroundColor: '#1a5276', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  divisor: { height: 1, backgroundColor: '#dde3ea', marginVertical: 14 },
  secaoTitulo: { fontSize: 14, fontWeight: '700', color: '#1a5276', marginBottom: 8 },
  descricao: { fontSize: 15, color: '#444', lineHeight: 22, textAlign: 'justify' },
  detalhes: { fontSize: 13, fontStyle: 'italic', color: '#888', lineHeight: 20, marginBottom: 30 },
  botaoVoltar: { backgroundColor: '#1a5276', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 30 },
  botaoVoltarTexto: { color: '#fff', fontSize: 15, fontWeight: '600' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginBottom: 20 },
});

export default DetalhesPontoTuristico;
