import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import api from '../../services/api';
import { Cidade } from '../../dados';
import { FAVORITOS_KEY } from '../favoritos';
import MapaEvento from '../../components/MapaEvento';

export default function DetalhesCidade() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [cidade, setCidade] = useState<Cidade | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favoritado, setFavoritado] = useState(false);

  useEffect(() => {
    fetchCidade();
    verificarFavorito();
  }, [id]);

  const fetchCidade = async () => {
    try {
      const response = await api.get(`/cidades/${id}`);
      setCidade(response.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar a cidade.');
    } finally {
      setIsLoading(false);
    }
  };

  const verificarFavorito = async () => {
    try {
      const dados = await AsyncStorage.getItem(FAVORITOS_KEY);
      const lista: Cidade[] = dados ? JSON.parse(dados) : [];
      setFavoritado(lista.some((c) => c.id === id));
    } catch {}
  };

  const toggleFavorito = async () => {
    if (!cidade) return;
    try {
      const dados = await AsyncStorage.getItem(FAVORITOS_KEY);
      let lista: Cidade[] = dados ? JSON.parse(dados) : [];

      if (favoritado) {
        lista = lista.filter((c) => c.id !== cidade.id);
      } else {
        lista.push(cidade);
      }

      await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(lista));
      setFavoritado(!favoritado);
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar os favoritos.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  if (!cidade) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.erro}>Cidade não encontrada.</Text>
      </View>
    );
  }

  const lat = parseFloat(cidade.latitude);
  const lng = parseFloat(cidade.longitude);
  const temCoordenadas = !isNaN(lat) && !isNaN(lng);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <View style={styles.bannerRow}>
            <View style={styles.tagBanner}>
              <Text style={styles.tagBannerText}>{cidade.categoria || 'Cidade'}</Text>
            </View>
            <TouchableOpacity onPress={toggleFavorito} style={styles.favBtn}>
              <Ionicons
                name={favoritado ? 'bookmark' : 'bookmark-outline'}
                size={26}
                color={favoritado ? '#38BDF8' : '#fff'}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.bannerTitulo}>{cidade.nome}</Text>
          <Text style={styles.bannerPais}>🌍 {cidade.pais}</Text>
        </View>

        <View style={styles.corpo}>
          <Text style={styles.secaoTitulo}>Sobre a cidade</Text>
          <Text style={styles.descricao}>{cidade.descricao}</Text>

          <Text style={styles.secaoTitulo}>Informações</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcone}>👥</Text>
              <Text style={styles.infoLabel}>População</Text>
              <Text style={styles.infoValor}>{cidade.populacao}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcone}>🎟️</Text>
              <Text style={styles.infoLabel}>Entrada</Text>
              <Text style={[styles.infoValor, { color: '#38BDF8' }]}>{cidade.entrada}</Text>
            </View>
          </View>

          {temCoordenadas && (
            <>
              <Text style={styles.secaoTitulo}>Localização no mapa</Text>
              <MapaEvento
                latitude={lat}
                longitude={lng}
                titulo={cidade.nome}
                local={cidade.pais}
              />
            </>
          )}

          <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
            <Text style={styles.botaoVoltarText}>← Voltar para o guia</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050F1E' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050F1E' },
  erro: { color: '#E8F0FE', textAlign: 'center' },
  banner: {
    paddingTop: 48, paddingBottom: 36, paddingHorizontal: 24,
    backgroundColor: '#0A2540',
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
  },
  bannerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  tagBanner: { backgroundColor: 'rgba(56,189,248,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  tagBannerText: { color: '#38BDF8', fontSize: 12, fontWeight: 'bold' },
  favBtn: { padding: 4 },
  bannerTitulo: { color: '#fff', fontSize: 30, fontWeight: 'bold', lineHeight: 36 },
  bannerPais: { color: '#6699AA', fontSize: 14, marginTop: 6 },

  corpo: { padding: 24 },
  secaoTitulo: {
    color: '#38BDF8', fontSize: 11, fontWeight: 'bold',
    letterSpacing: 1.5, textTransform: 'uppercase',
    marginTop: 28, marginBottom: 12,
  },
  descricao: { color: '#8899AA', fontSize: 15, lineHeight: 24 },
  infoGrid: { flexDirection: 'row', gap: 12 },
  infoCard: {
    flex: 1, backgroundColor: '#0D1F35', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#112244',
  },
  infoIcone: { fontSize: 20, marginBottom: 8 },
  infoLabel: { color: '#556', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  infoValor: { color: '#E8F0FE', fontSize: 15, fontWeight: 'bold' },

  botaoVoltar: {
    marginTop: 32, backgroundColor: '#0D1F35', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#112244',
  },
  botaoVoltarText: { color: '#38BDF8', fontSize: 15, fontWeight: 'bold' },
});
