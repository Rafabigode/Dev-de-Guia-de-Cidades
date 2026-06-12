import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  FlatList, TextInput, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PontoTuristicoCard from '../components/PontoTuristicoCard';
import api from '../services/api';

const CATEGORIAS = ['Todos', 'Parque', 'Museu', 'Teatro'];

const ListaPontosTuristicos = () => {
  const navigation = useNavigation();
  const [pontosTuristicos, setPontosTuristicos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Debounce
  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    const fetchPontos = async () => {
      try {
        const response = await api.get('/posts');
        const dados = response.data.map(item => ({
          id: String(item.id),
          nome: item.title,
          descricao: item.body,
          imagem: `https://picsum.photos/id/${item.id % 100}/150/150`,
          latitude: -25.4284 + (Math.random() - 0.5) * 0.1,
          longitude: -49.2733 + (Math.random() - 0.5) * 0.1,
          detalhesCompletos: item.body + ' ' + item.title,
          categoria: item.id % 3 === 0 ? 'Parque' : item.id % 3 === 1 ? 'Museu' : 'Teatro',
        }));
        setPontosTuristicos(dados);
      } catch (err) {
        setError('Não foi possível carregar os pontos turísticos.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPontos();
  }, []);

  const filteredPontos = useMemo(() => {
    let lista = pontosTuristicos;
    if (debouncedSearchTerm) {
      const termo = debouncedSearchTerm.toLowerCase();
      lista = lista.filter(p =>
        p.nome.toLowerCase().includes(termo) ||
        p.descricao.toLowerCase().includes(termo)
      );
    }
    if (selectedCategory !== 'Todos') {
      lista = lista.filter(p => p.categoria === selectedCategory);
    }
    return lista;
  }, [pontosTuristicos, debouncedSearchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a5276" />
        <Text style={styles.loadingText}>Carregando pontos turísticos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Buscar pontos turísticos..."
        placeholderTextColor="#aaa"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <View style={styles.categoryContainer}>
        {CATEGORIAS.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.categoryTxt, selectedCategory === cat && styles.categoryTxtActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.contador}>{filteredPontos.length} resultado(s)</Text>

      {filteredPontos.length === 0 ? (
        <Text style={styles.noResults}>Nenhum resultado para "{debouncedSearchTerm}"</Text>
      ) : (
        <FlatList
          data={filteredPontos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PontoTuristicoCard
              ponto={item}
              onPress={() => navigation.navigate('DetalhesPonto', { pontoDetalhes: item })}
            />
          )}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  searchInput: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 8,
  },
  categoryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  categoryBtnActive: { backgroundColor: '#1a5276' },
  categoryTxt: { fontSize: 13, color: '#333', fontWeight: '600' },
  categoryTxtActive: { color: '#fff' },
  contador: { fontSize: 12, color: '#888', paddingHorizontal: 16, marginBottom: 4 },
  lista: { paddingVertical: 6, paddingBottom: 20 },
  noResults: { textAlign: 'center', marginTop: 40, fontSize: 15, color: '#888' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' },
  loadingText: { marginTop: 10, fontSize: 15, color: '#666' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 15, color: 'red', textAlign: 'center' },
});

export default ListaPontosTuristicos;
