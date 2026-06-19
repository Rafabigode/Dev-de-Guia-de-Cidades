import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CidadeCard from '../constants/CidadeCard';
import { Cidade } from '../dados';
import api from '../services/api';

const CORES: Record<string, string> = {
  'Histórica':    '#C0834A',
  'Moderna':      '#38BDF8',
  'Cultural':     '#A855F7',
  'Tecnologia':   '#22C55E',
  'Gastronômica': '#F97316',
  'Natureza':     '#10B981',
};

const CORES_PADRAO = [
  '#38BDF8', '#A855F7', '#F97316', '#22C55E',
  '#C0834A', '#10B981', '#EF4444', '#F59E0B',
];

export default function Explorar() {
  const router = useRouter();

  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [filtradas, setFiltradas] = useState<Cidade[]>([]);
  const [categorias, setCategorias] = useState<string[]>(['Todas']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas');

  useEffect(() => { fetchCidades(); }, []);
  useEffect(() => { filtrar(); }, [busca, categoriaSelecionada, cidades]);

  const fetchCidades = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/cidades');
      setCidades(response.data);

      const cats: string[] = ['Todas', ...Array.from(
        new Set(response.data.map((c: Cidade) => c.categoria).filter(Boolean))
      ) as string[]];
      setCategorias(cats);
    } catch {
      setError('Não foi possível carregar as cidades.');
    } finally {
      setIsLoading(false);
    }
  };

  const filtrar = () => {
    let resultado = [...cidades];
    if (categoriaSelecionada !== 'Todas') {
      resultado = resultado.filter(c => c.categoria === categoriaSelecionada);
    }
    if (busca.trim()) {
      resultado = resultado.filter(c =>
        c.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        c.pais?.toLowerCase().includes(busca.toLowerCase())
      );
    }
    setFiltradas(resultado);
  };

  const getCorCategoria = (cat: string, index: number) =>
    CORES[cat] || CORES_PADRAO[index % CORES_PADRAO.length];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={styles.loadingText}>Carregando cidades...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="wifi-outline" size={48} color="#38BDF8" style={{ marginBottom: 16 }} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchCidades}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#556" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar cidade ou país..."
          placeholderTextColor="#445"
          value={busca}
          onChangeText={setBusca}
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Ionicons name="close-circle" size={18} color="#556" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filtroWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtroContent}
        >
          {categorias.map((cat, index) => {
            const ativo = categoriaSelecionada === cat;
            const cor = cat === 'Todas' ? '#38BDF8' : getCorCategoria(cat, index);
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filtroBtn,
                  ativo && { backgroundColor: cor, borderColor: cor },
                ]}
                onPress={() => setCategoriaSelecionada(cat)}
              >
                <Text style={[styles.filtroText, ativo && styles.filtroTextAtivo]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma cidade encontrada.</Text>
        }
        renderItem={({ item, index }) => (
          <CidadeCard
            cidade={{
              ...item,
              tagColor: getCorCategoria(item.categoria, index),
            }}
            onPress={() => router.push(`/detalhes/${item.id}` as any)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050F1E' },
  listContent: { paddingBottom: 40, paddingTop: 8 },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1F35',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#112244',
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#E8F0FE', fontSize: 14 },

  filtroWrapper: { height: 52, marginBottom: 8 },
  filtroContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  filtroBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0D1F35',
    borderWidth: 1,
    borderColor: '#112244',
  },
  filtroText: { color: '#778', fontSize: 13 },
  filtroTextAtivo: { color: '#fff', fontWeight: 'bold' },

  emptyText: { color: '#445', textAlign: 'center', marginTop: 40, fontSize: 14 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050F1E' },
  loadingText: { marginTop: 12, fontSize: 15, color: '#556' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050F1E', padding: 24 },
  errorText: { fontSize: 15, color: '#38BDF8', textAlign: 'center', marginBottom: 16 },
  retryBtn: { backgroundColor: '#38BDF8', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  retryText: { color: '#050F1E', fontWeight: 'bold' },
});
