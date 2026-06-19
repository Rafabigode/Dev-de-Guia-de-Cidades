import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

type Props = {
  latitude: number;
  longitude: number;
  titulo: string;
  local: string;
};

export default function MapaEvento({ latitude, longitude, titulo, local }: Props) {
  return (
    <MapView
      style={styles.mapa}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <Marker
        coordinate={{ latitude, longitude }}
        title={titulo}
        description={local}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  mapa: { height: 220, borderRadius: 14, overflow: 'hidden', marginTop: 8 },
});
