import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const pontosTuristicos = [
  {
    id: '1',
    nome: 'Parque Barigui',
    descricao:
      'Um dos maiores e mais frequentados parques de Curitiba, com lago, trilhas e vida selvagem, incluindo capivaras.',
    categoria: 'Parque',
    emoji: '🌳',
    avaliacao: 4.8,
  },
  {
    id: '2',
    nome: 'Jardim Botânico',
    descricao:
      'Famoso pela sua estufa de ferro e vidro inspirada no Crystal Palace de Londres, com jardins formais belíssimos.',
    categoria: 'Jardim',
    emoji: '🌸',
    avaliacao: 4.9,
  },
  {
    id: '3',
    nome: 'Ópera de Arame',
    descricao:
      'Teatro único construído com estrutura tubular de aço e paredes de vidro, localizado dentro de uma antiga pedreira.',
    categoria: 'Cultura',
    emoji: '🎭',
    avaliacao: 4.7,
  },
  {
    id: '4',
    nome: 'Museu Oscar Niemeyer',
    descricao:
      'Conhecido como o "Museu do Olho" pela sua escultura em formato de olho, é um dos maiores museus de arte do Brasil.',
    categoria: 'Museu',
    emoji: '🏛️',
    avaliacao: 4.6,
  },
  {
    id: '5',
    nome: 'Largo da Ordem',
    descricao:
      'Centro histórico de Curitiba, com feiras de artesanato aos domingos, bares, restaurantes e arquitetura colonial.',
    categoria: 'Histórico',
    emoji: '🏙️',
    avaliacao: 4.5,
  },
  {
    id: '6',
    nome: 'Parque Tanguá',
    descricao:
      'Parque em antiga pedreira com lagos, cascata artificial, túnel e mirante com vista panorâmica da cidade.',
    categoria: 'Parque',
    emoji: '⛲',
    avaliacao: 4.7,
  },
];

const categoriasCores = {
  Parque: '#27ae60',
  Jardim: '#8e44ad',
  Cultura: '#e67e22',
  Museu: '#2980b9',
  Histórico: '#c0392b',
};

const ListaPontosTuristicos = () => {
  const navigation = useNavigation();
  const [favoritos, setFavoritos] = useState([]);

  const toggleFavorito = (id) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const irParaDetalhes = (ponto) => {
    navigation.navigate('DetalhesPonto', {
      pontoId: ponto.id,
      nomePonto: ponto.nome,
      descricaoPonto: ponto.descricao,
      categoriaPonto: ponto.categoria,
      emojiPonto: ponto.emoji,
      avaliacaoPonto: ponto.avaliacao,
      isFavorito: favoritos.includes(ponto.id),
    });
  };

  const renderItem = ({ item }) => {
    const corCategoria = categoriasCores[item.categoria] || '#555';
    const isFav = favoritos.includes(item.id);

    return (
      <TouchableOpacity style={styles.card} onPress={() => irParaDetalhes(item)}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardEmoji}>{item.emoji}</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardNome}>{item.nome}</Text>
            <View style={[styles.badgeCategoria, { backgroundColor: corCategoria }]}>
              <Text style={styles.badgeTexto}>{item.categoria}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => toggleFavorito(item.id)}>
            <Text style={styles.favIcon}>{isFav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cardDescricao} numberOfLines={2}>
          {item.descricao}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.avaliacao}>⭐ {item.avaliacao}</Text>
          <Text style={styles.verMais}>Ver detalhes →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTexto}>
          {favoritos.length > 0
            ? `❤️ ${favoritos.length} favorito(s) selecionado(s)`
            : '🗺️ Explore Curitiba'}
        </Text>
      </View>
      <FlatList
        data={pontosTuristicos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    backgroundColor: '#1a5276',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  lista: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  cardEmoji: {
    fontSize: 36,
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a2b3c',
  },
  badgeCategoria: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeTexto: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  favIcon: {
    fontSize: 22,
  },
  cardDescricao: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  avaliacao: {
    fontSize: 13,
    color: '#e67e22',
    fontWeight: '600',
  },
  verMais: {
    fontSize: 13,
    color: '#1a5276',
    fontWeight: '600',
  },
});

export default ListaPontosTuristicos;
