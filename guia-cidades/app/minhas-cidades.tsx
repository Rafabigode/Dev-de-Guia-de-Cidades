import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Cidade } from '../dados';
import api from '../services/api';

const FORM_VAZIO = {
  nome: '', descricao: '', categoria: '',
  populacao: '', pais: '', entrada: '',
  latitude: '', longitude: '',
};

export default function MinhasCidades() {
  const [logado, setLogado] = useState(false);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [cidadeParaExcluir, setCidadeParaExcluir] = useState<Cidade | null>(null);
  const [editando, setEditando] = useState<Cidade | null>(null);
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  useFocusEffect(
    useCallback(() => { verificarSessao(); }, [])
  );

  const verificarSessao = async () => {
    const sessao = await AsyncStorage.getItem('@sessao_usuario');
    if (sessao) {
      setLogado(true);
      fetchCidades();
    } else {
      setLogado(false);
      setIsLoading(false);
    }
  };

  const fetchCidades = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/cidades');
      setCidades(response.data);
    } catch {
      // silencioso
    } finally {
      setIsLoading(false);
    }
  };

  const abrirCriar = () => {
    setEditando(null);
    setForm(FORM_VAZIO);
    setModalVisivel(true);
  };

  const abrirEditar = (cidade: Cidade) => {
    setEditando(cidade);
    setForm({
      nome: cidade.nome,
      descricao: cidade.descricao,
      categoria: cidade.categoria,
      populacao: cidade.populacao,
      pais: cidade.pais,
      entrada: cidade.entrada,
      latitude: cidade.latitude,
      longitude: cidade.longitude,
    });
    setModalVisivel(true);
  };

  const salvar = async () => {
    if (!form.nome.trim() || !form.descricao.trim()) return;
    try {
      setSalvando(true);
      if (editando) {
        await api.put(`/cidades/${editando.id}`, form);
      } else {
        await api.post('/cidades', form);
      }
      setModalVisivel(false);
      fetchCidades();
    } catch {
      // silencioso
    } finally {
      setSalvando(false);
    }
  };

  const pedirConfirmacaoExcluir = (cidade: Cidade) => {
    setCidadeParaExcluir(cidade);
    setModalConfirmar(true);
  };

  const confirmarExcluir = async () => {
    if (!cidadeParaExcluir) return;
    try {
      setExcluindo(true);
      await api.delete(`/cidades/${cidadeParaExcluir.id}`);
      setModalConfirmar(false);
      setCidadeParaExcluir(null);
      fetchCidades();
    } catch {
      // silencioso
    } finally {
      setExcluindo(false);
    }
  };

  if (!logado) {
    return (
      <View style={styles.bloqueio}>
        <Ionicons name="lock-closed" size={56} color="#112244" />
        <Text style={styles.bloqueioTitulo}>Acesso restrito</Text>
        <Text style={styles.bloqueioSub}>
          Faça login na aba "Perfil" para criar, editar e excluir cidades.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={cidades}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <TouchableOpacity style={styles.criarBtn} onPress={abrirCriar}>
            <Ionicons name="add-circle-outline" size={20} color="#050F1E" />
            <Text style={styles.criarText}>Nova Cidade</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma cidade cadastrada ainda.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemNome} numberOfLines={1}>{item.nome}</Text>
              <Text style={styles.itemPais} numberOfLines={1}>🌍 {item.pais}</Text>
            </View>
            <View style={styles.itemAcoes}>
              <TouchableOpacity style={styles.editBtn} onPress={() => abrirEditar(item)}>
                <Ionicons name="pencil" size={16} color="#38BDF8" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => pedirConfirmacaoExcluir(item)}>
                <Ionicons name="trash" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal confirmação excluir */}
      <Modal visible={modalConfirmar} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.confirmarBox}>
            <Ionicons name="warning-outline" size={36} color="#EF4444" style={{ marginBottom: 12 }} />
            <Text style={styles.confirmarTitulo}>Excluir cidade?</Text>
            <Text style={styles.confirmarSub} numberOfLines={2}>
              "{cidadeParaExcluir?.nome}"
            </Text>
            <View style={styles.confirmarBtns}>
              <TouchableOpacity
                style={styles.cancelarBtn}
                onPress={() => { setModalConfirmar(false); setCidadeParaExcluir(null); }}
              >
                <Text style={styles.cancelarText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.excluirBtn, excluindo && { opacity: 0.6 }]}
                onPress={confirmarExcluir}
                disabled={excluindo}
              >
                {excluindo
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.excluirText}>Excluir</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal criar / editar */}
      <Modal visible={modalVisivel} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>
              {editando ? 'Editar Cidade' : 'Nova Cidade'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisivel(false)}>
              <Ionicons name="close" size={24} color="#E8F0FE" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalForm}>
            {([
              { label: 'Nome *', key: 'nome', placeholder: 'Nome da cidade' },
              { label: 'Descrição *', key: 'descricao', placeholder: 'Descrição da cidade' },
              { label: 'Categoria', key: 'categoria', placeholder: 'Ex: Histórica, Moderna...' },
              { label: 'País', key: 'pais', placeholder: 'Ex: Brasil' },
              { label: 'População', key: 'populacao', placeholder: 'Ex: 12 milhões' },
              { label: 'Entrada / Custo', key: 'entrada', placeholder: 'Ex: Gratuito ou R$ 50' },
              { label: 'Latitude', key: 'latitude', placeholder: 'Ex: -23.5505' },
              { label: 'Longitude', key: 'longitude', placeholder: 'Ex: -46.6333' },
            ] as { label: string; key: keyof typeof FORM_VAZIO; placeholder: string }[]).map((campo) => (
              <View key={campo.key} style={styles.campoContainer}>
                <Text style={styles.campoLabel}>{campo.label}</Text>
                <TextInput
                  style={[styles.campoInput, campo.key === 'descricao' && { height: 80 }]}
                  placeholder={campo.placeholder}
                  placeholderTextColor="#334"
                  value={form[campo.key]}
                  onChangeText={(v) => setForm({ ...form, [campo.key]: v })}
                  multiline={campo.key === 'descricao'}
                />
              </View>
            ))}

            <TouchableOpacity
              style={[styles.salvarBtn, salvando && { opacity: 0.6 }]}
              onPress={salvar}
              disabled={salvando}
            >
              {salvando
                ? <ActivityIndicator color="#050F1E" />
                : <Text style={styles.salvarText}>{editando ? 'Salvar alterações' : 'Criar cidade'}</Text>
              }
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050F1E' },
  listContent: { padding: 16, paddingBottom: 40 },

  criarBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#38BDF8', borderRadius: 12,
    paddingVertical: 14, justifyContent: 'center', marginBottom: 16,
  },
  criarText: { color: '#050F1E', fontWeight: 'bold', fontSize: 15 },

  itemCard: {
    backgroundColor: '#0D1F35', borderRadius: 12, padding: 14,
    marginBottom: 10, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#112244',
  },
  itemInfo: { flex: 1 },
  itemNome: { color: '#E8F0FE', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  itemPais: { color: '#667', fontSize: 12 },
  itemAcoes: { flexDirection: 'row', gap: 8 },
  editBtn: { backgroundColor: '#0A2540', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#1A3A5C' },
  deleteBtn: { backgroundColor: '#1A0A0A', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#3A1010' },

  emptyText: { color: '#334', textAlign: 'center', marginTop: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050F1E' },

  bloqueio: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050F1E', padding: 32 },
  bloqueioTitulo: { color: '#E8F0FE', fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  bloqueioSub: { color: '#556', fontSize: 14, textAlign: 'center', lineHeight: 22 },

  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  confirmarBox: {
    backgroundColor: '#0D1F35', borderRadius: 20, padding: 28,
    alignItems: 'center', width: '100%', maxWidth: 340,
    borderWidth: 1, borderColor: '#112244',
  },
  confirmarTitulo: { color: '#E8F0FE', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  confirmarSub: { color: '#778', fontSize: 14, textAlign: 'center', marginBottom: 24 },
  confirmarBtns: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelarBtn: {
    flex: 1, backgroundColor: '#112244', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  cancelarText: { color: '#E8F0FE', fontWeight: 'bold' },
  excluirBtn: {
    flex: 1, backgroundColor: '#EF4444', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  excluirText: { color: '#fff', fontWeight: 'bold' },

  modal: { flex: 1, backgroundColor: '#050F1E' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, backgroundColor: '#0A2540',
    borderBottomWidth: 1, borderBottomColor: '#112244',
  },
  modalTitulo: { color: '#E8F0FE', fontSize: 18, fontWeight: 'bold' },
  modalForm: { padding: 20 },

  campoContainer: { marginBottom: 16 },
  campoLabel: { color: '#778', fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' },
  campoInput: {
    backgroundColor: '#0D1F35', color: '#E8F0FE', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14,
    borderWidth: 1, borderColor: '#112244',
  },
  salvarBtn: {
    backgroundColor: '#38BDF8', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  salvarText: { color: '#050F1E', fontWeight: 'bold', fontSize: 16 },
});
