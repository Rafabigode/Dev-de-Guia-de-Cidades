import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const continenteCores = {
  'Ásia': '#e74c3c',
  'Europa': '#3498db',
  'América do Norte': '#9b59b6',
  'América do Sul': '#27ae60',
  'África': '#e67e22',
  'Oceania': '#1abc9c',
  'Europa/Ásia': '#f39c12',
};

const dicasViagem = {
  '1': {
    melhorEpoca: 'Março a Maio / Set a Nov',
    idioma: 'Japonês',
    moeda: 'Iene (¥)',
    dica: 'Compre o JR Pass antes de viajar para se deslocar de trem por todo o Japão com economia!',
  },
  '2': {
    melhorEpoca: 'Abril a Junho / Set a Nov',
    idioma: 'Francês',
    moeda: 'Euro (€)',
    dica: 'Visite o Louvre às quartas ou sextas à noite — tem menos filas e funciona até as 21h45!',
  },
  '3': {
    melhorEpoca: 'Abril a Junho / Set a Nov',
    idioma: 'Inglês',
    moeda: 'Dólar ($)',
    dica: 'Use o MetroCard ilimitado semanal para economizar muito nos deslocamentos pela cidade.',
  },
  '4': {
    melhorEpoca: 'Out a Abril',
    idioma: 'Árabe',
    moeda: 'Libra Egípcia (£E)',
    dica: 'Contrate um guia local para as pirâmides — eles têm histórias incríveis e evitam golpes.',
  },
  '5': {
    melhorEpoca: 'Set a Novembro',
    idioma: 'Inglês',
    moeda: 'Dólar Australiano (A$)',
    dica: 'Faça o tour de caiaque pelo porto ao amanhecer — a vista da Ópera ao nascer do sol é única!',
  },
  '6': {
    melhorEpoca: 'Março a Maio / Set a Nov',
    idioma: 'Espanhol',
    moeda: 'Peso Argentino ($)',
    dica: 'Reserve uma aula de tango no bairro San Telmo — é uma experiência cultural imperdível!',
  },
  '7': {
    melhorEpoca: 'Abril a Junho / Set a Nov',
    idioma: 'Turco',
    moeda: 'Lira Turca (₺)',
    dica: 'Faça o cruzeiro pelo Bósforo ao pôr do sol para ver a cidade dos dois continentes de uma vez!',
  },
  '8': {
    melhorEpoca: 'Março a Outubro',
    idioma: 'Português',
    moeda: 'Euro (€)',
    dica: 'Suba ao Castelo de São Jorge de manhã cedo para evitar filas e ter a melhor vista da cidade!',
  },
};

const DetalhesCidade = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    cidadeId,
    nomeCidade,
    paisCidade,
    emojiCidade,
    continenteCidade,
    populacaoCidade,
    avaliacaoCidade,
    descricaoCidade,
    isFavorito: favInicial,
  } = route.params;

  const [isFavorito, setIsFavorito] = useState(favInicial || false);
  const [visitado, setVisitado] = useState(false);
  const [tempoNaTela, setTempoNaTela] = useState(0);

  const dicas = dicasViagem[cidadeId] || {};
  const corContinente = continenteCores[continenteCidade] || '#555';

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTempoNaTela((t) => t + 1);
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const handleFavoritar = () => {
    setIsFavorito((prev) => !prev);
    Alert.alert(
      isFavorito ? 'Removido dos favoritos' : 'Adicionado às Minhas Viagens!',
      isFavorito
        ? `${nomeCidade} foi removida dos seus favoritos.`
        : `${nomeCidade} foi salva em Minhas Viagens!`
    );
  };

  const handleMarcarVisitado = () => {
    setVisitado((prev) => !prev);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Banner Hero */}
      <View style={styles.heroBanner}>
        <Text style={styles.heroEmoji}>{emojiCidade}</Text>
        <View style={[styles.badgeContinente, { backgroundColor: corContinente }]}>
          <Text style={styles.badgeTexto}>{continenteCidade}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Título e meta */}
        <Text style={styles.nomeTitle}>{nomeCidade}</Text>
        <Text style={styles.paisSubtitle}>📍 {paisCidade}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.avaliacao}>⭐ {avaliacaoCidade} / 5.0</Text>
          <Text style={styles.populacao}>👥 {populacaoCidade}</Text>
          <Text style={styles.tempoTexto}>👁 {tempoNaTela}s</Text>
        </View>

        {/* Sobre a cidade */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>📝 Sobre a cidade</Text>
          <Text style={styles.descricao}>{descricaoCidade}</Text>
        </View>

        {/* Informações de viagem */}
        {dicas.melhorEpoca && (
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📅 Melhor época</Text>
              <Text style={styles.infoValor}>{dicas.melhorEpoca}</Text>
            </View>
            <View style={styles.divisor} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🗣 Idioma</Text>
              <Text style={styles.infoValor}>{dicas.idioma}</Text>
            </View>
            <View style={styles.divisor} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>💵 Moeda</Text>
              <Text style={styles.infoValor}>{dicas.moeda}</Text>
            </View>
          </View>
        )}

        {/* Dica do guia */}
        {dicas.dica && (
          <View style={styles.dicaCard}>
            <Text style={styles.dicaTitulo}>💡 Dica do GNUOcto</Text>
            <Text style={styles.dicaTexto}>{dicas.dica}</Text>
          </View>
        )}

        {/* Botões de ação */}
        <View style={styles.botoesAcao}>
          <TouchableOpacity
            style={[styles.botao, isFavorito ? styles.botaoFavAtivo : styles.botaoFav]}
            onPress={handleFavoritar}
          >
            <Text style={styles.botaoTexto}>
              {isFavorito ? '❤️ Salvo em Minhas Viagens' : '🤍 Salvar em Minhas Viagens'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, visitado ? styles.botaoVisitadoAtivo : styles.botaoVisitado]}
            onPress={handleMarcarVisitado}
          >
            <Text style={styles.botaoTexto}>
              {visitado ? '✅ Já visitei!' : '📌 Marcar como visitada'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Voltar */}
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <Text style={styles.botaoVoltarTexto}>← Voltar para a lista</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1b2a',
  },
  heroBanner: {
    backgroundColor: '#0a1628',
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a5f',
  },
  heroEmoji: {
    fontSize: 80,
  },
  badgeContinente: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeTexto: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    padding: 20,
  },
  nomeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#e8f4ff',
    marginBottom: 4,
  },
  paisSubtitle: {
    fontSize: 16,
    color: '#7eb8f5',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  avaliacao: {
    fontSize: 14,
    color: '#f39c12',
    fontWeight: '700',
  },
  populacao: {
    fontSize: 13,
    color: '#8899bb',
  },
  tempoTexto: {
    fontSize: 13,
    color: '#556688',
    marginLeft: 'auto',
  },
  secao: {
    marginBottom: 16,
  },
  secaoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4db8ff',
    marginBottom: 8,
  },
  descricao: {
    fontSize: 15,
    color: '#aabbd0',
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: '#111f3a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8899bb',
    fontWeight: '500',
  },
  infoValor: {
    fontSize: 14,
    color: '#e8f4ff',
    fontWeight: '600',
  },
  divisor: {
    height: 1,
    backgroundColor: '#1e3a5f',
  },
  dicaCard: {
    backgroundColor: '#1a2a10',
    borderLeftWidth: 4,
    borderLeftColor: '#4db8ff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  dicaTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4db8ff',
    marginBottom: 4,
  },
  dicaTexto: {
    fontSize: 14,
    color: '#aabbd0',
    lineHeight: 20,
  },
  botoesAcao: {
    gap: 10,
    marginBottom: 16,
  },
  botao: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoFav: {
    backgroundColor: '#111f3a',
    borderWidth: 1.5,
    borderColor: '#e74c3c',
  },
  botaoFavAtivo: {
    backgroundColor: '#e74c3c',
  },
  botaoVisitado: {
    backgroundColor: '#111f3a',
    borderWidth: 1.5,
    borderColor: '#27ae60',
  },
  botaoVisitadoAtivo: {
    backgroundColor: '#27ae60',
  },
  botaoTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e8f4ff',
  },
  botaoVoltar: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#0a1628',
    borderWidth: 1,
    borderColor: '#1e3a5f',
    marginBottom: 30,
  },
  botaoVoltarTexto: {
    color: '#4db8ff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default DetalhesCidade;