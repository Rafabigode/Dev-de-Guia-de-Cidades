import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { FavoritesProvider } from './context/FavoritesContext';

import ListaPontosTuristicos from './screens/ListaPontosTuristicos';
import DetalhesPontoTuristico from './screens/DetalhesPontoTuristico';
import FavoritosScreen from './screens/FavoritosScreen';
import MapaScreen from './screens/MapaScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ExplorarStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a5276' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="ListaPontos"
        component={ListaPontosTuristicos}
        options={{ title: 'Pontos Turísticos' }}
      />
      <Stack.Screen
        name="DetalhesPonto"
        component={DetalhesPontoTuristico}
        options={({ route }) => ({ title: route.params?.pontoDetalhes?.nome || 'Detalhes' })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Explorar') {
                iconName = focused ? 'compass' : 'compass-outline';
              } else if (route.name === 'Favoritos') {
                iconName = focused ? 'heart' : 'heart-outline';
              } else if (route.name === 'Mapa') {
                iconName = focused ? 'map' : 'map-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#1a5276',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopColor: '#e0e0e0',
              paddingBottom: 5,
              height: 60,
            },
          })}
        >
          <Tab.Screen name="Explorar" component={ExplorarStack} options={{ tabBarLabel: 'Explorar' }} />
          <Tab.Screen name="Favoritos" component={FavoritosScreen} options={{ tabBarLabel: 'Favoritos', headerShown: true, headerStyle: { backgroundColor: '#1a5276' }, headerTintColor: '#fff', headerTitle: 'Meus Favoritos' }} />
          <Tab.Screen name="Mapa" component={MapaScreen} options={{ tabBarLabel: 'Mapa', headerShown: true, headerStyle: { backgroundColor: '#1a5276' }, headerTintColor: '#fff', headerTitle: 'Mapa dos Pontos' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
