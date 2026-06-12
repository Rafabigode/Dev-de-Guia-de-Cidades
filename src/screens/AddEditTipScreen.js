import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
  ActivityIndicator, Image, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useTips } from '../context/TipsContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';

const CATEGORIES = ['Gastronomia', 'Transporte', 'Hospedagem', 'Cultura', 'Segurança', 'Geral'];
const CAT_ICONS = { Gastronomia: '🍽️', Transporte: '🚌', Hospedagem: '🏨', Cultura: '🎭', Segurança: '🛡️', Geral: '💬' };

export default function AddEditTipScreen({ navigation, route }) {
  const { tip, city } = route.params || {};
  const isEditing = !!tip;
  const { createTip, updateTip, addPhotoToTip, removePhotoFromTip } = useTips();
  const { user } = useAuth();

  const [title, setTitle] = useState(tip?.title || '');
  const [description, setDescription] = useState(tip?.description || '');
  const [category, setCategory] = useState(tip?.category || 'Geral');
  const [photos, setPhotos] = useState(tip?.photos || []);
  const [loading, setLoading] = useState(false);

  const currentCity = city || (tip ? { id: tip.cityId, name: tip.cityName } : null);

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert('Campo obrigatório', 'Adicione um título'); return; }
    if (!description.trim()) { Alert.alert('Campo obrigatório', 'Adicione uma descrição'); return; }

    setLoading(true);
    try {
      if (isEditing) {
        await updateTip(tip.id, { title, description, category, photos });
        Alert.alert('✅ Sucesso', 'Dica atualizada!');
      } else {
        await createTip({
          cityId: currentCity?.id || 'general',
          cityName: currentCity?.name || 'Geral',
          title,
          description,
          category,
          photos,
        });
        Alert.alert('✅ Sucesso', 'Dica criada!');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para adicionar fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newPhoto = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        addedAt: new Date().toISOString(),
      };
      setPhotos(prev => [...prev, newPhoto]);
    }
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{isEditing ? '✏️ Editar Dica' : '✍️ Nova Dica'}</Text>
            {currentCity && (
              <View style={styles.cityBadge}>
                <Text style={styles.cityBadgeText}>📍 {currentCity.name}</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <View style={styles.field}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Melhor restaurante local"
              placeholderTextColor={COLORS.textMuted}
              value={title}
              onChangeText={setTitle}
              maxLength={80}
            />
            <Text style={styles.charCount}>{title.length}/80</Text>
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Compartilhe sua experiência, dicas de preço, horário, localização..."
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          {/* Category */}
          <View style={styles.field}>
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, category === cat && styles.catChipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={styles.catIcon}>{CAT_ICONS[cat]}</Text>
                  <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Photos */}
          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Fotos</Text>
              <Text style={styles.labelHint}>{photos.length}/5</Text>
            </View>

            <View style={styles.photosContainer}>
              {photos.map((photo) => (
                <View key={photo.id} style={styles.photoItem}>
                  <Image source={{ uri: photo.uri }} style={styles.photoThumb} />
                  <TouchableOpacity
                    style={styles.photoRemove}
                    onPress={() => removePhoto(photo.id)}
                  >
                    <Text style={styles.photoRemoveText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {photos.length < 5 && (
                <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImage}>
                  <Text style={styles.addPhotoIcon}>📷</Text>
                  <Text style={styles.addPhotoText}>Adicionar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>
                {isEditing ? '💾 Salvar Alterações' : '🚀 Publicar Dica'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg },
  header: { marginBottom: SPACING.lg },
  backText: { color: COLORS.primary, fontSize: 16, fontWeight: '600', marginBottom: SPACING.sm },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  cityBadge: {
    backgroundColor: COLORS.surface,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cityBadgeText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  field: { marginBottom: SPACING.lg },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginBottom: SPACING.sm },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  labelHint: { fontSize: 12, color: COLORS.textMuted },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    color: COLORS.text,
    fontSize: 15,
  },
  textArea: { height: 120, paddingTop: SPACING.md },
  charCount: { fontSize: 11, color: COLORS.textMuted, textAlign: 'right', marginTop: 4 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catChipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  catIcon: { fontSize: 14 },
  catText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  catTextActive: { color: '#fff' },
  photosContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  photoItem: { position: 'relative' },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceElevated,
  },
  photoRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.error,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoRemoveText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  addPhotoBtn: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addPhotoIcon: { fontSize: 22 },
  addPhotoText: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
