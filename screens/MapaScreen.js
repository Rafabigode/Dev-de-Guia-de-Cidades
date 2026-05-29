// screens/MapaScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

// Dados fictícios de cidades com coordenadas
// Futuramente, virão da sua API ou de um contexto global
const cidadesDeExemplo = [
  { id: '1', nome: 'Curitiba', descricao: 'Capital do Paraná, cidade das araucárias.', latitude: -25.4284, longitude: -49.2733 },
  { id: '2', nome: 'Florianópolis', descricao: 'Ilha da Magia, famosa pelas praias.', latitude: -27.5954, longitude: -48.5480 },
  { id: '3', nome: 'São Paulo', descricao: 'A maior metrópole do Brasil.', latitude: -23.5505, longitude: -46.6333 },
  { id: '4', nome: 'Rio de Janeiro', descricao: 'Cidade Maravilhosa, Cristo Redentor.', latitude: -22.9068, longitude: -43.1729 },
];

const MapaScreen = () => {
  const navigation = useNavigation();
  const [mapaCidades, setMapaCidades] = useState([]);

  // Região inicial do mapa (Brasil centralizado)
  const initialRegion = {
    latitude: -25.4284,
    longitude: -49.2733,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  useEffect(() => {
    // Futuramente: buscar dados reais da API ou de um contexto global
    setMapaCidades(cidadesDeExemplo);
  }, []);

  // Navega para DetalhesCidade ao clicar no Callout
  const handleMarkerPress = (cidade) => {
    navigation.navigate('Explorar', {
      screen: 'DetalhesCidade',
      params: { cidadeDetalhes: cidade },
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
        {mapaCidades.map(cidade => (
          <Marker
            key={cidade.id}
            coordinate={{ latitude: cidade.latitude, longitude: cidade.longitude }}
            title={cidade.nome}
            description={cidade.descricao}
          >
            <Callout onPress={() => handleMarkerPress(cidade)}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{cidade.nome}</Text>
                <Text style={styles.calloutDescription}>{cidade.descricao}</Text>
                <Text style={styles.calloutLink}>Ver Detalhes »</Text>
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
  map: {
    width: '100%',
    height: '100%',
  },
  calloutContainer: {
    width: 160,
    padding: 5,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 12,
    color: '#666',
  },
  calloutLink: {
    fontSize: 12,
    color: 'blue',
    marginTop: 5,
    textAlign: 'right',
  },
});

export default MapaScreen;