import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const TipsContext = createContext({});

export const useTips = () => useContext(TipsContext);

export const TipsProvider = ({ children }) => {
  const { user } = useAuth();
  const [tips, setTips] = useState([]);

  useEffect(() => {
    if (user) loadTips();
    else setTips([]);
  }, [user]);

  const getKey = () => `@gnuocto_tips_${user?.id}`;

  const loadTips = async () => {
    try {
      const data = await AsyncStorage.getItem(getKey());
      if (data) setTips(JSON.parse(data));
    } catch (error) {
      console.error('Error loading tips:', error);
    }
  };

  const saveTips = async (updated) => {
    await AsyncStorage.setItem(getKey(), JSON.stringify(updated));
    setTips(updated);
  };

  // POST - Create new tip
  const createTip = async ({ cityId, cityName, title, description, category, photos = [] }) => {
    if (!user) throw new Error('Faça login para adicionar dicas');
    if (!title?.trim()) throw new Error('Título é obrigatório');
    if (!description?.trim()) throw new Error('Descrição é obrigatória');

    const newTip = {
      id: Date.now().toString(),
      cityId,
      cityName,
      title: title.trim(),
      description: description.trim(),
      category: category || 'Geral',
      photos,
      authorId: user.id,
      authorName: user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...tips, newTip];
    await saveTips(updated);
    return newTip;
  };

  // PUT - Update existing tip
  const updateTip = async (tipId, { title, description, category, photos }) => {
    const tip = tips.find(t => t.id === tipId);
    if (!tip) throw new Error('Dica não encontrada');
    if (tip.authorId !== user?.id) throw new Error('Sem permissão para editar');

    const updated = tips.map(t =>
      t.id === tipId
        ? {
            ...t,
            title: title?.trim() || t.title,
            description: description?.trim() || t.description,
            category: category || t.category,
            photos: photos !== undefined ? photos : t.photos,
            updatedAt: new Date().toISOString(),
          }
        : t
    );
    await saveTips(updated);
    return updated.find(t => t.id === tipId);
  };

  // DELETE - Remove tip
  const deleteTip = async (tipId) => {
    const tip = tips.find(t => t.id === tipId);
    if (!tip) throw new Error('Dica não encontrada');
    if (tip.authorId !== user?.id) throw new Error('Sem permissão para excluir');

    const updated = tips.filter(t => t.id !== tipId);
    await saveTips(updated);
  };

  // GET tips by city
  const getTipsByCity = (cityId) => tips.filter(t => t.cityId === cityId);

  // GET tips by user
  const getMyTips = () => tips.filter(t => t.authorId === user?.id);

  // Add photo to tip
  const addPhotoToTip = async (tipId, photoUri) => {
    const tip = tips.find(t => t.id === tipId);
    if (!tip) throw new Error('Dica não encontrada');

    const photos = [...(tip.photos || []), { id: Date.now().toString(), uri: photoUri, addedAt: new Date().toISOString() }];
    return updateTip(tipId, { photos });
  };

  // Remove photo from tip
  const removePhotoFromTip = async (tipId, photoId) => {
    const tip = tips.find(t => t.id === tipId);
    if (!tip) throw new Error('Dica não encontrada');

    const photos = (tip.photos || []).filter(p => p.id !== photoId);
    return updateTip(tipId, { photos });
  };

  return (
    <TipsContext.Provider value={{
      tips,
      createTip,
      updateTip,
      deleteTip,
      getTipsByCity,
      getMyTips,
      addPhotoToTip,
      removePhotoFromTip,
    }}>
      {children}
    </TipsContext.Provider>
  );
};
