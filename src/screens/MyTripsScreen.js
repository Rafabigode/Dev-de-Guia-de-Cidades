import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

export default function MyTripsScreen() {
  const { favorites, removeFavorite } = useFavorites();
  const navigation = useNavigation();

  const handleRemove = (city) => {
    Alert.alert(
      'Remover viagem',
      `Remover ${city.name} das suas viagens?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => removeFavorite(city.id) },
      ]
    );
  };

  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Explorar', { screen: 'CityDetail', params: { city: item } })}
      activeOpacity={0.75}
    >
      <View style={styles.cardLeft}>
        <View style={styles.flagBox}>
          <Text style={styles.flag}>{item.flag}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.cityName}>{item.name}</Text>
          <Text style={styles.country}>{item.country}</Text>
          <Text style={styles.savedDate}>Salvo em {formatDate(item.savedAt)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item)}>
        <Text style={styles.removeIcon}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>❤️ Minhas Viagens</Text>
        <Text style={styles.headerSub}>{favorites.length} cidade{favorites.length !== 1 ? 's' : ''} salva{favorites.length !== 1 ? 's' : ''}</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>✈️</Text>
          <Text style={styles.emptyTitle}>Nenhuma viagem salva</Text>
          <Text style={styles.emptyText}>Explore cidades e salve as que você visitou</Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => navigation.navigate('Explorar')}
          >
            <Text style={styles.exploreBtnText}>Explorar cidades</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
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
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  headerSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  list: { padding: SPACING.lg },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  flagBox: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  flag: { fontSize: 28 },
  info: { flex: 1 },
  cityName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  country: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  savedDate: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  removeBtn: { padding: SPACING.sm },
  removeIcon: { fontSize: 18 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl, gap: SPACING.md },
  emptyIcon: { fontSize: 72 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  exploreBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm,
  },
  exploreBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
