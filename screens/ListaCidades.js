import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const cidades = [
  {
    id: '1',
    nome: 'Tokyo',
    pais: 'Japão',
    emoji: '🗼',
    continente: 'Ásia',
    populacao: '13.96 milhões',
    avaliacao: 4.9,
    descricao:
      'Capital do Japão, Tokyo é uma metrópole vibrante que mistura tradição milenar com tecnologia de ponta, oferecendo culinária única e atrações culturais inesquecíveis.',
  },
  {
    id: '2',
    nome: 'Paris',
    pais: 'França',
    emoji: '🗽',
    continente: 'Europa',
    populacao: '2.16 milhões',
    avaliacao: 4.8,
    descricao:
      'A Cidade Luz encanta com sua arquitetura clássica, museus de classe mundial como o Louvre, alta gastronomia e o icônico símbolo da Torre Eiffel.',
  },
  {
    id: '3',
    nome: 'Nova York',
    pais: 'EUA',
    emoji: '🗽',
    continente: 'América do Norte',
    populacao: '8.34 milhões',
    avaliacao: 4.7,
    descricao:
      'A cidade que nunca dorme oferece uma mistura única de culturas, arranha-céus imponentes, Broadway, Central Park e uma gastronomia verdadeiramente global.',
  },
  {
    id: '4',
    nome: 'Cairo',
    pais: 'Egito',
    emoji: '🏛️',
    continente: 'África',
    populacao: '20.9 milhões',
    avaliacao: 4.6,
    descricao:
      'Cidade milenar às margens do Nilo, Cairo guarda as Pirâmides de Gizé, a Esfinge e um dos maiores acervos da história da humanidade no Museu Egípcio.',
  },
  {
    id: '5',
    nome: 'Sydney',
    pais: 'Austrália',
    emoji: '🦘',
    continente: 'Oceania',
    populacao: '5.31 milhões',
    avaliacao: 4.8,
    descricao:
      'Com a Ópera de Sydney como cartão-postal, a cidade combina belas praias, vida urbana sofisticada e uma natureza selvagem única ao redor da baía.',
  },
  {
    id: '6',
    nome: 'Buenos Aires',
    pais: 'Argentina',
    emoji: '💃',
    continente: 'América do Sul',
    populacao: '3.06 milhões',
    avaliacao: 4.7,
    descricao:
      'A Paris da América do Sul é berço do tango, com bairros coloridos como La Boca, gastronomia de churrasco inigualável e uma vida noturna efervescente.',
  },
  {
    id: '7',
    nome: 'Istambul',
    pais: 'Turquia',
    emoji: '🕌',
    continente: 'Europa/Ásia',
    populacao: '15.46 milhões',
    avaliacao: 4.8,
    descricao:
      'Única cidade no mundo entre dois continentes, Istambul impressiona com a Hagia Sophia, o Grande Bazar e a fusão fascinante entre culturas do Oriente e Ocidente.',
  },
  {
    id: '8',
    nome: 'Lisboa',
    pais: 'Portugal',
    emoji: '🎵',
    continente: 'Europa',
    populacao: '544 mil',
    avaliacao: 4.9,
    descricao:
      'Com seus bondes históricos, pastéis de nata e o melancólico fado ecoando pelos becos do Alfama, Lisboa é uma das capitais mais charmosas e acolhedoras da Europa.',
  },
];

const continenteCores = {
  'Ásia': '#e74c3c',
  'Europa': '#3498db',
  'América do Norte': '#9b59b6',
  'América do Sul': '#27ae60',
  'África': '#e67e22',
  'Oceania': '#1abc9c',
  'Europa/Ásia': '#f39c12',
};

const ListaCidades = () => {
  const navigation = useNavigation();
  const [favoritos, setFavoritos] = useState([]);

  const toggleFavorito = (id) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const irParaDetalhes = (cidade) => {
    navigation.navigate('DetalhesCidade', {
      cidadeId: cidade.id,
      nomeCidade: cidade.nome,
      paisCidade: cidade.pais,
      emojiCidade: cidade.emoji,
      continenteCidade: cidade.continente,
      populacaoCidade: cidade.populacao,
      avaliacaoCidade: cidade.avaliacao,
      descricaoCidade: cidade.descricao,
      isFavorito: favoritos.includes(cidade.id),
    });
  };

  const renderItem = ({ item }) => {
    const corContinente = continenteCores[item.continente] || '#555';
    const isFav = favoritos.includes(item.id);

    return (
      <TouchableOpacity style={styles.card} onPress={() => irParaDetalhes(item)}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardEmoji}>{item.emoji}</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardNome}>{item.nome}</Text>
            <Text style={styles.cardPais}>📍 {item.pais}</Text>
            <View style={[styles.badgeContinente, { backgroundColor: corContinente }]}>
              <Text style={styles.badgeTexto}>{item.continente}</Text>
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
            ? `❤️ ${favoritos.length} cidade(s) favoritada(s)`
            : '🌐 Explore cidades ao redor do mundo'}
        </Text>
      </View>
      <FlatList
        data={cidades}
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
    backgroundColor: '#0d1b2a',
  },
  header: {
    backgroundColor: '#0a1628',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a5f',
  },
  headerTexto: {
    color: '#7eb8f5',
    fontSize: 14,
    fontWeight: '500',
  },
  lista: {
    padding: 16,
  },
  card: {
    backgroundColor: '#111f3a',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1e3a5f',
    shadowColor: '#4db8ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  cardEmoji: {
    fontSize: 38,
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  cardNome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#e8f4ff',
  },
  cardPais: {
    fontSize: 13,
    color: '#7eb8f5',
  },
  badgeContinente: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 2,
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
    color: '#8899bb',
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e3a5f',
    paddingTop: 8,
  },
  avaliacao: {
    fontSize: 13,
    color: '#f39c12',
    fontWeight: '600',
  },
  verMais: {
    fontSize: 13,
    color: '#4db8ff',
    fontWeight: '600',
  },
});

export default ListaCidades;