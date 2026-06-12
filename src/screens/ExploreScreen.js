import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { searchCities, getPopularCities } from '../services/geonamesApi';
import { useFavorites } from '../context/FavoritesContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const COUNTRIES = ['Todos', 'BR', 'US', 'FR', 'JP', 'GB', 'DE', 'AU', 'ES', 'IT'];
const COUNTRY_FLAGS = { Todos: '🌍', BR: '🇧🇷', US: '🇺🇸', FR: '🇫🇷', JP: '🇯🇵', GB: '🇬🇧', DE: '🇩🇪', AU: '🇦🇺', ES: '🇪🇸', IT: '🇮🇹' };

export default function ExploreScreen({ navigation }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Todos');
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    loadPopular();
  }, []);

  const loadPopular = async () => {
    setLoading(true);
    try {
      const results = await getPopularCities();
      setCities(results);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((text) => {
    setQuery(text);
    if (searchTimeout) clearTimeout(searchTimeout);

    if (!text.trim()) {
      loadPopular();
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const country = selectedCountry === 'Todos' ? '' : selectedCountry;
        const results = await searchCities(text, country);
        setCities(results);
      } finally {
        setLoading(false);
      }
    }, 500);
    setSearchTimeout(timeout);
  }, [selectedCountry, searchTimeout]);

  const handleCountryFilter = async (country) => {
    setSelectedCountry(country);
    setLoading(true);
    try {
      const countryCode = country === 'Todos' ? '' : country;
      const results = await searchCities(query || 'a', countryCode);
      setCities(results);
    } finally {
      setLoading(false);
    }
  };

  const formatPop = (n) => {
    if (!n) return '–';
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  const renderCity = ({ item }) => (
    <TouchableOpacity
      style={styles.cityCard}
      onPress={() => navigation.navigate('CityDetail', { city: item })}
      activeOpacity={0.75}
    >
      <View style={styles.flagContainer}>
        <Text style={styles.flag}>{item.flag}</Text>
      </View>
      <View style={styles.cityInfo}>
        <Text style={styles.cityName}>{item.name}</Text>
        <Text style={styles.cityMeta}>{item.country} • {item.adminName}</Text>
        <View style={styles.cityStats}>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statText}>{formatPop(item.population)}</Text>
          </View>
          {item.timezone && (
            <View style={styles.stat}>
              <Text style={styles.statIcon}>🕐</Text>
              <Text style={styles.statText}>{item.timezone.split('/')[1] || item.timezone}</Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.favBtn}
        onPress={() => toggleFavorite(item)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.favIcon}>{isFavorite(item.id) ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌍 Explorar</Text>
        <Text style={styles.headerSub}>Descubra cidades ao redor do mundo</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar cidade ou país..."
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Country filter */}
      <FlatList
        data={COUNTRIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, selectedCountry === item && styles.filterChipActive]}
            onPress={() => handleCountryFilter(item)}
          >
            <Text style={styles.filterFlag}>{COUNTRY_FLAGS[item]}</Text>
            <Text style={[styles.filterText, selectedCountry === item && styles.filterTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Results */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>Buscando cidades...</Text>
        </View>
      ) : (
        <FlatList
          data={cities}
          keyExtractor={(item) => item.id}
          renderItem={renderCity}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadPopular} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔭</Text>
              <Text style={styles.emptyText}>Nenhuma cidade encontrada</Text>
              <Text style={styles.emptySubText}>Tente outro termo de busca</Text>
            </View>
          }
          ListHeaderComponent={
            <Text style={styles.resultsCount}>
              {!query ? '✨ Cidades em destaque' : `${cities.length} resultado${cities.length !== 1 ? 's' : ''}`}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  headerSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: { fontSize: 16, marginRight: SPACING.sm },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 15 },
  clearBtn: { color: COLORS.textMuted, fontSize: 16, padding: 4 },
  filterList: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, gap: SPACING.sm },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterFlag: { fontSize: 14 },
  filterText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
  resultsCount: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: SPACING.md, marginTop: SPACING.sm },
  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  flagContainer: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  flag: { fontSize: 28 },
  cityInfo: { flex: 1 },
  cityName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  cityMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  cityStats: { flexDirection: 'row', marginTop: 6, gap: SPACING.md },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statIcon: { fontSize: 11 },
  statText: { fontSize: 11, color: COLORS.textMuted },
  favBtn: { padding: 4 },
  favIcon: { fontSize: 20 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
  loaderText: { color: COLORS.textSecondary, fontSize: 14 },
  empty: { alignItems: 'center', paddingTop: SPACING.xxl, gap: SPACING.sm },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 16, color: COLORS.text, fontWeight: '600' },
  emptySubText: { fontSize: 13, color: COLORS.textMuted },
});
