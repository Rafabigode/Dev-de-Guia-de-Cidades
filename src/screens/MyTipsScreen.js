import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTips } from '../context/TipsContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const CATEGORIES = ['Todas', 'Gastronomia', 'Transporte', 'Hospedagem', 'Cultura', 'Segurança', 'Geral'];

export default function MyTipsScreen() {
  const { getMyTips, deleteTip } = useTips();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const allTips = getMyTips();
  const tips = selectedCategory === 'Todas'
    ? allTips
    : allTips.filter(t => t.category === selectedCategory);

  const handleDelete = (tip) => {
    Alert.alert(
      'Excluir dica',
      `Excluir "${tip.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTip(tip.id);
            } catch (e) {
              Alert.alert('Erro', e.message);
            }
          },
        },
      ]
    );
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  const renderTip = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardMeta}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.cityLabel}>📍 {item.cityName}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('AddEditTip', { tip: item })}
          >
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.tipTitle}>{item.title}</Text>
      <Text style={styles.tipDesc} numberOfLines={2}>{item.description}</Text>

      <View style={styles.cardFooter}>
        {item.photos?.length > 0 && (
          <Text style={styles.photoCount}>📸 {item.photos.length} foto{item.photos.length !== 1 ? 's' : ''}</Text>
        )}
        <Text style={styles.dateText}>
          {item.updatedAt !== item.createdAt ? `Editado ${formatDate(item.updatedAt)}` : `Criado ${formatDate(item.createdAt)}`}
        </Text>
      </View>
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authGate}>
          <Text style={styles.authIcon}>🔐</Text>
          <Text style={styles.authTitle}>Login necessário</Text>
          <Text style={styles.authText}>Faça login para gerenciar suas dicas de viagem</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>💡 Minhas Dicas</Text>
            <Text style={styles.headerSub}>{allTips.length} dica{allTips.length !== 1 ? 's' : ''} criada{allTips.length !== 1 ? 's' : ''}</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddEditTip', {})}
          >
            <Text style={styles.addBtnText}>+ Nova</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category filter */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        keyExtractor={(i) => i}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, selectedCategory === item && styles.chipActive]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[styles.chipText, selectedCategory === item && styles.chipTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Tips list */}
      {tips.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>✍️</Text>
          <Text style={styles.emptyTitle}>{allTips.length === 0 ? 'Nenhuma dica ainda' : 'Nenhuma dica nesta categoria'}</Text>
          <Text style={styles.emptyText}>
            {allTips.length === 0
              ? 'Explore cidades e compartilhe suas dicas de viagem'
              : 'Tente outra categoria'}
          </Text>
          {allTips.length === 0 && (
            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => navigation.navigate('AddEditTip', {})}
            >
              <Text style={styles.createBtnText}>Criar primeira dica</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={tips}
          keyExtractor={(item) => item.id}
          renderItem={renderTip}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  headerSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  filterList: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, gap: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  list: { padding: SPACING.lg },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    ...SHADOWS.small,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.sm },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 },
  categoryBadge: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  categoryText: { fontSize: 10, color: COLORS.accent, fontWeight: '700' },
  cityLabel: { fontSize: 11, color: COLORS.textMuted },
  cardActions: { flexDirection: 'row', gap: SPACING.sm },
  editBtn: { padding: 4 },
  editIcon: { fontSize: 16 },
  deleteBtn: { padding: 4 },
  deleteIcon: { fontSize: 16 },
  tipTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  tipDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm },
  photoCount: { fontSize: 11, color: COLORS.textMuted },
  dateText: { fontSize: 11, color: COLORS.textMuted },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl, gap: SPACING.md },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  createBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
  },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  authGate: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl, gap: SPACING.md },
  authIcon: { fontSize: 64 },
  authTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  authText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
});
