import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const MapaScreen = () => {
  const navigation = useNavigation();
  const [pontos, setPontos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialRegion = {
    latitude: -25.4284,
    longitude: -49.2733,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  useEffect(() => {
    const fetchPontos = async () => {
      try {
        const response = await api.get('/posts');
        const dados = response.data.slice(0, 20).map(item => ({
          id: String(item.id),
          nome: item.title,
          descricao: item.body,
          latitude: -25.4284 + (Math.random() - 0.5) * 0.1,
          longitude: -49.2733 + (Math.random() - 0.5) * 0.1,
          detalhesCompletos: item.body + ' ' + item.title,
          imagem: `https://picsum.photos/id/${item.id % 100}/150/150`,
        }));
        setPontos(dados);
      } catch (err) {
        console.error('Erro ao buscar pontos:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPontos();
  }, []);

  const handleCalloutPress = (ponto) => {
    navigation.navigate('Explorar', {
      screen: 'DetalhesPonto',
      params: { pontoDetalhes: ponto },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Text>Carregando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion} showsUserLocation={true}>
        {pontos.map(ponto => (
          <Marker
            key={ponto.id}
            coordinate={{ latitude: ponto.latitude, longitude: ponto.longitude }}
            title={ponto.nome}
          >
            <Callout onPress={() => handleCalloutPress(ponto)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle} numberOfLines={2}>{ponto.nome}</Text>
                <Text style={styles.calloutDesc} numberOfLines={2}>{ponto.descricao}</Text>
                <Text style={styles.calloutLink}>Ver detalhes »</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  callout: { width: 180, padding: 8 },
  calloutTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 4, color: '#1a2b3c' },
  calloutDesc: { fontSize: 12, color: '#666', marginBottom: 6 },
  calloutLink: { fontSize: 12, color: '#1a5276', fontWeight: '700', textAlign: 'right' },
});

export default MapaScreen;
