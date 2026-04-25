import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const categoriasCores = {
  Parque: '#27ae60',
  Jardim: '#8e44ad',
  Cultura: '#e67e22',
  Museu: '#2980b9',
  Histórico: '#c0392b',
};

const informacoesExtras = {
  '1': {
    horario: '24 horas',
    entrada: 'Gratuita',
    endereco: 'Rod. dos Pioneiros, Curitiba - PR',
    dica: 'Melhor visitado no final da tarde para ver as capivaras perto do lago!',
  },
  '2': {
    horario: 'Ter-Dom: 9h às 18h',
    entrada: 'Gratuita',
    endereco: 'R. Eng. Ostoja Roguski, s/n - Jardim Botânico',
    dica: 'Não perca a foto na frente da estufa de vidro — é o cartão-postal de Curitiba!',
  },
  '3': {
    horario: 'Seg-Sex: 9h às 18h',
    entrada: 'Gratuita (área externa)',
    endereco: 'R. João Gava, 970 - Abranches',
    dica: 'A estrutura é linda à noite com iluminação. Confira a programação de shows!',
  },
  '4': {
    horario: 'Ter-Dom: 10h às 18h',
    entrada: 'R$ 20,00 (meia para estudantes)',
    endereco: 'R. Marechal Hermes, 999 - Centro Cívico',
    dica: 'Reserve pelo menos 2 horas. A exposição de arte contemporânea é incrível.',
  },
  '5': {
    horario: 'Feira: Dom 9h às 14h',
    entrada: 'Gratuita',
    endereco: 'Largo da Ordem - São Francisco',
    dica: 'Vá na feira de domingo! Artesanato, antiguidades e comida típica paranaense.',
  },
  '6': {
    horario: '24 horas',
    entrada: 'Gratuita',
    endereco: 'R. Augusto Stresser, 1 - Pilarzinho',
    dica: 'Suba até o mirante para uma vista panorâmica incrível da cidade!',
  },
};

const DetalhesPontoTuristico = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    pontoId,
    nomePonto,
    descricaoPonto,
    categoriaPonto,
    emojiPonto,
    avaliacaoPonto,
    isFavorito: favInicial,
  } = route.params;

  const [isFavorito, setIsFavorito] = useState(favInicial || false);
  const [visitado, setVisitado] = useState(false);
  const [tempoNaTela, setTempoNaTela] = useState(0);

  const extras = informacoesExtras[pontoId] || {};
  const corCategoria = categoriasCores[categoriaPonto] || '#555';

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTempoNaTela((t) => t + 1);
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const handleFavoritar = () => {
    setIsFavorito((prev) => !prev);
    Alert.alert(
      isFavorito ? 'Removido dos favoritos' : 'Adicionado aos favoritos!',
      isFavorito
        ? `${nomePonto} foi removido dos seus favoritos.`
        : `${nomePonto} foi salvo nos seus favoritos!`
    );
  };

  const handleMarcarVisitado = () => {
    setVisitado((prev) => !prev);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroBanner}>
        <Text style={styles.heroEmoji}>{emojiPonto}</Text>
        <View style={[styles.badgeCategoria, { backgroundColor: corCategoria }]}>
          <Text style={styles.badgeTexto}>{categoriaPonto}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.nomeTitle}>{nomePonto}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.avaliacao}>⭐ {avaliacaoPonto} / 5.0</Text>
          <Text style={styles.idTexto}>ID: #{pontoId}</Text>
          <Text style={styles.tempoTexto}>👁 {tempoNaTela}s</Text>
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>📝 Sobre o local</Text>
          <Text style={styles.descricao}>{descricaoPonto}</Text>
        </View>

        {extras.horario && (
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🕐 Horário</Text>
              <Text style={styles.infoValor}>{extras.horario}</Text>
            </View>
            <View style={styles.divisor} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🎟 Entrada</Text>
              <Text style={styles.infoValor}>{extras.entrada}</Text>
            </View>
            <View style={styles.divisor} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Endereço</Text>
              <Text style={[styles.infoValor, { flex: 1, textAlign: 'right' }]}>
                {extras.endereco}
              </Text>
            </View>
          </View>
        )}

        {extras.dica && (
          <View style={styles.dicaCard}>
            <Text style={styles.dicaTitulo}>💡 Dica do guia</Text>
            <Text style={styles.dicaTexto}>{extras.dica}</Text>
          </View>
        )}

        <View style={styles.botoesAcao}>
          <TouchableOpacity
            style={[styles.botao, isFavorito ? styles.botaoFavAtivo : styles.botaoFav]}
            onPress={handleFavoritar}
          >
            <Text style={styles.botaoTexto}>
              {isFavorito ? '❤️ Favoritado' : '🤍 Favoritar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, visitado ? styles.botaoVisitadoAtivo : styles.botaoVisitado]}
            onPress={handleMarcarVisitado}
          >
            <Text style={styles.botaoTexto}>
              {visitado ? '✅ Visitei!' : '📌 Marcar como visitado'}
            </Text>
          </TouchableOpacity>
        </View>

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
    backgroundColor: '#f0f4f8',
  },
  heroBanner: {
    backgroundColor: '#1a5276',
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  heroEmoji: {
    fontSize: 72,
  },
  badgeCategoria: {
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a2b3c',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  avaliacao: {
    fontSize: 14,
    color: '#e67e22',
    fontWeight: '700',
  },
  idTexto: {
    fontSize: 13,
    color: '#999',
  },
  tempoTexto: {
    fontSize: 13,
    color: '#999',
    marginLeft: 'auto',
  },
  secao: {
    marginBottom: 16,
  },
  secaoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a5276',
    marginBottom: 8,
  },
  descricao: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValor: {
    fontSize: 14,
    color: '#1a2b3c',
    fontWeight: '600',
  },
  divisor: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  dicaCard: {
    backgroundColor: '#fff9e6',
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  dicaTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#c47c00',
    marginBottom: 4,
  },
  dicaTexto: {
    fontSize: 14,
    color: '#7a5500',
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
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#c0392b',
  },
  botaoFavAtivo: {
    backgroundColor: '#c0392b',
  },
  botaoVisitado: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#27ae60',
  },
  botaoVisitadoAtivo: {
    backgroundColor: '#27ae60',
  },
  botaoTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a2b3c',
  },
  botaoVoltar: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#1a5276',
    marginBottom: 30,
  },
  botaoVoltarTexto: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default DetalhesPontoTuristico;
