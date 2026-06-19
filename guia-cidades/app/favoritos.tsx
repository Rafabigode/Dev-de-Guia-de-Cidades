import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import CidadeCard from '../constants/CidadeCard';
import { Cidade } from '../dados';

export const FAVORITOS_KEY = '@favoritos_cidades';

export default function Favoritos() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState<Cidade[]>([]);

  useFocusEffect(
    useCallback(() => {
      carregarFavoritos();
    }, [])
  );

  const carregarFavoritos = async () => {
    try {
      const dados = await AsyncStorage.getItem(FAVORITOS_KEY);
      setFavoritos(dados ? JSON.parse(dados) : []);
    } catch {
      setFavoritos([]);
    }
  };

  const removerFavorito = async (id: string) => {
    const novos = favoritos.filter((c) => c.id !== id);
    await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(novos));
    setFavoritos(novos);
  };

  if (favoritos.length === 0) {
    return (
      <View style={styles.vazio}>
        <Ionicons name="bookmark-outline" size={64} color="#112244" />
        <Text style={styles.vazioTitulo}>Nenhum favorito ainda</Text>
        <Text style={styles.vazioSub}>
          Explore cidades e toque no marcador para salvar seus destinos favoritos.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.count}>{favoritos.length} cidade(s) favorita(s)</Text>
        }
        renderItem={({ item }) => (
          <View>
            <CidadeCard
              cidade={item}
              onPress={() => router.push(`/detalhes/${item.id}` as any)}
            />
            <TouchableOpacity
              style={styles.removerBtn}
              onPress={() => removerFavorito(item.id)}
            >
              <Ionicons name="bookmark-outline" size={14} color="#EF4444" />
              <Text style={styles.removerText}>Remover dos favoritos</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050F1E' },
  listContent: { paddingBottom: 40, paddingTop: 8 },
  count: { color: '#334', fontSize: 12, paddingHorizontal: 24, paddingVertical: 8 },

  removerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 20,
    marginTop: -4,
    marginBottom: 8,
  },
  removerText: { color: '#EF4444', fontSize: 12 },

  vazio: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050F1E', padding: 32 },
  vazioTitulo: { color: '#E8F0FE', fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  vazioSub: { color: '#556', fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
