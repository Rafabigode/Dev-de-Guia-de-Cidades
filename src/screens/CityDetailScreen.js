import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../context/FavoritesContext';
import { useTips } from '../context/TipsContext';
import { useAuth } from '../context/AuthContext';
import { getNearbyPOI } from '../services/geonamesApi';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const INFO_ITEMS = (city) => [
  { icon: '👥', label: 'População', value: city.population ? city.population.toLocaleString('pt-BR') : 'Não disponível' },
  { icon: '🗺️', label: 'Região', value: city.adminName || '–' },
  { icon: '🌍', label: 'País', value: city.country || '–' },
  { icon: '🕐', label: 'Fuso Horário', value: city.timezone || '–' },
  { icon: '📍', label: 'Coordenadas', value: city.lat && city.lng ? `${parseFloat(city.lat).toFixed(4)}, ${parseFloat(city.lng).toFixed(4)}` : '–' },
  { icon: '⛰️', label: 'Elevação', value: city.elevation ? `${city.elevation} m` : '–' },
];

export default function CityDetailScreen({ navigation, route }) {
  const { city } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getTipsByCity } = useTips();
  const { user } = useAuth();
  const [poi, setPoi] = useState([]);
  const [loadingPoi, setLoadingPoi] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const tips = getTipsByCity(city.id);
  const favorite = isFavorite(city.id);

  useEffect(() => {
    if (city.lat && city.lng) loadPOI();
  }, []);

  const loadPOI = async () => {
    setLoadingPoi(true);
    try {
      const results = await getNearbyPOI(city.lat, city.lng);
      setPoi(results);
    } finally {
      setLoadingPoi(false);
    }
  };

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(city.name + ', ' + city.country)}`;
    Linking.openURL(url);
  };

  const TABS = [
    { id: 'info', label: 'Informações', icon: 'ℹ️' },
    { id: 'poi', label: 'Pontos de Interesse', icon: '🏛️' },
    { id: 'tips', label: `Dicas (${tips.length})`, icon: '💡' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <Text style={styles.heroFlag}>{city.flag}</Text>
            <Text style={styles.heroName}>{city.name}</Text>
            <Text style={styles.heroCountry}>{city.country}</Text>

            <View style={styles.heroActions}>
              <TouchableOpacity
                style={[styles.actionBtn, favorite && styles.actionBtnActive]}
                onPress={() => toggleFavorite(city)}
              >
                <Text style={styles.actionBtnIcon}>{favorite ? '❤️' : '🤍'}</Text>
                <Text style={[styles.actionBtnText, favorite && styles.actionBtnTextActive]}>
                  {favorite ? 'Salvo' : 'Salvar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={openMaps}>
                <Text style={styles.actionBtnIcon}>🗺️</Text>
                <Text style={styles.actionBtnText}>Ver no Mapa</Text>
              </TouchableOpacity>

              {user && (
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate('AddEditTip', { city })}
                >
                  <Text style={styles.actionBtnIcon}>✍️</Text>
                  <Text style={styles.actionBtnText}>Adicionar Dica</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {/* INFO TAB */}
          {activeTab === 'info' && (
            <View style={styles.infoGrid}>
              {INFO_ITEMS(city).map(({ icon, label, value }) => (
                <View key={label} style={styles.infoCard}>
                  <Text style={styles.infoIcon}>{icon}</Text>
                  <Text style={styles.infoLabel}>{label}</Text>
                  <Text style={styles.infoValue}>{value}</Text>
                </View>
              ))}
            </View>
          )}

          {/* POI TAB */}
          {activeTab === 'poi' && (
            <View>
              {loadingPoi ? (
                <ActivityIndicator color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
              ) : poi.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>🏛️</Text>
                  <Text style={styles.emptyText}>Nenhum ponto encontrado</Text>
                </View>
              ) : (
                poi.map((item, index) => (
                  <View key={index} style={styles.poiCard}>
                    <View style={styles.poiIconBox}>
                      <Text style={styles.poiEmoji}>📍</Text>
                    </View>
                    <View style={styles.poiInfo}>
                      <Text style={styles.poiTitle}>{item.title}</Text>
                      <Text style={styles.poiSummary} numberOfLines={2}>{item.summary}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {/* TIPS TAB */}
          {activeTab === 'tips' && (
            <View>
              {tips.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>💡</Text>
                  <Text style={styles.emptyText}>Nenhuma dica ainda</Text>
                  {user && (
                    <TouchableOpacity
                      style={styles.addTipBtn}
                      onPress={() => navigation.navigate('AddEditTip', { city })}
                    >
                      <Text style={styles.addTipBtnText}>+ Adicionar primeira dica</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                tips.map((tip) => (
                  <View key={tip.id} style={styles.tipCard}>
                    <View style={styles.tipHeader}>
                      <View style={styles.tipCategory}>
                        <Text style={styles.tipCategoryText}>{tip.category}</Text>
                      </View>
                      <Text style={styles.tipAuthor}>por {tip.authorName}</Text>
                    </View>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <Text style={styles.tipDesc}>{tip.description}</Text>
                    {tip.photos?.length > 0 && (
                      <Text style={styles.tipPhotos}>📸 {tip.photos.length} foto{tip.photos.length !== 1 ? 's' : ''}</Text>
                    )}
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  backBtnText: { color: COLORS.primary, fontSize: 22, fontWeight: '600' },
  heroContent: { alignItems: 'center', paddingHorizontal: SPACING.lg },
  heroFlag: { fontSize: 72, marginBottom: SPACING.sm },
  heroName: { fontSize: 28, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  heroCountry: { fontSize: 16, color: COLORS.textSecondary, marginTop: 4 },
  heroActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg, flexWrap: 'wrap', justifyContent: 'center' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    gap: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  actionBtnIcon: { fontSize: 14 },
  actionBtnText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  actionBtnTextActive: { color: '#fff' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center', gap: 3 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabIcon: { fontSize: 16 },
  tabText: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textAlign: 'center' },
  tabTextActive: { color: COLORS.primary },
  tabContent: { padding: SPACING.lg },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    width: '48%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoIcon: { fontSize: 20, marginBottom: 4 },
  infoLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 13, color: COLORS.text, fontWeight: '700' },
  poiCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  poiIconBox: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poiEmoji: { fontSize: 20 },
  poiInfo: { flex: 1 },
  poiTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  poiSummary: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  tipCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  tipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  tipCategory: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  tipCategoryText: { fontSize: 10, color: COLORS.accent, fontWeight: '700' },
  tipAuthor: { fontSize: 11, color: COLORS.textMuted },
  tipTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  tipDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  tipPhotos: { fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.sm },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xxl, gap: SPACING.md },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 15, color: COLORS.textSecondary },
  addTipBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  addTipBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
