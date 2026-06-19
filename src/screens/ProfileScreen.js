import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useTips } from '../context/TipsContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { getMyTips } = useTips();

  const myTips = getMyTips();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const STATS = [
    { icon: '❤️', value: favorites.length, label: 'Viagens Salvas' },
    { icon: '💡', value: myTips.length, label: 'Dicas Criadas' },
    { icon: '📸', value: myTips.reduce((a, t) => a + (t.photos?.length || 0), 0), label: 'Fotos Adicionadas' },
  ];

  const MENU_ITEMS = [
    { icon: '🌍', label: 'Sobre o GNUOcto', onPress: () => Alert.alert('GNUOcto', 'Guia de Cidades v1.0.0\n\nExplorando o mundo, uma cidade por vez.') },
    { icon: '🔑', label: 'Alterar Senha', onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') },
    { icon: '📱', label: 'Notificações', onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') },
    { icon: '🔒', label: 'Privacidade', onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento') },
  ];

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name?.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.memberSince}>Membro desde {formatDate(user.createdAt)}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map(({ icon, value, label }) => (
            <View key={label} style={styles.statCard}>
              <Text style={styles.statIcon}>{icon}</Text>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          {MENU_ITEMS.map(({ icon, label, onPress }) => (
            <TouchableOpacity key={label} style={styles.menuItem} onPress={onPress}>
              <View style={styles.menuLeft}>
                <Text style={styles.menuIcon}>{icon}</Text>
                <Text style={styles.menuLabel}>{label}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.version}>GNUOcto v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  profileCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  userName: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  userEmail: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  memberSince: { fontSize: 12, color: COLORS.textMuted, marginTop: 6 },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', marginTop: 2, fontWeight: '600' },
  section: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  menuIcon: { fontSize: 18 },
  menuLabel: { fontSize: 15, color: COLORS.text, fontWeight: '500' },
  menuArrow: { fontSize: 20, color: COLORS.textMuted },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.error + '40',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  logoutIcon: { fontSize: 18 },
  logoutText: { color: COLORS.error, fontWeight: '700', fontSize: 15 },
  version: { textAlign: 'center', color: COLORS.textMuted, fontSize: 12, marginBottom: SPACING.xl },
});
