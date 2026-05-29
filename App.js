// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { FavoritesProvider } from './context/FavoritesContext';

// Importe suas telas existentes
import ListaCidades from './screens/ListaCidades';
import DetalhesCidade from './screens/DetalhesCidade';

// Importe as novas telas
import FavoritosScreen from './screens/FavoritosScreen';
import MapaScreen from './screens/MapaScreen';

const Stack = createStackNavigator(); // Stack Navigator para a aba "Explorar"
const Tab = createBottomTabNavigator(); // Tab Navigator principal

// Componente para a Aba de Exploração (Lista + Detalhes)
function ExplorarStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListaCidades"
        component={ListaCidades}
        options={{ title: 'Explorar Cidades' }}
      />
      <Stack.Screen
        name="DetalhesCidade"
        component={DetalhesCidade}
        options={{ title: 'Detalhes da Cidade' }}
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
            // Configuração dos ícones das abas
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
            tabBarActiveTintColor: '#2563eb',   // Azul para aba ativa
            tabBarInactiveTintColor: 'gray',     // Cinza para abas inativas
            headerShown: false, // Esconde cabeçalho duplicado do Tab Navigator
          })}
        >
          <Tab.Screen
            name="Explorar"
            component={ExplorarStack} // Stack Navigator aninhado
            options={{ tabBarLabel: 'Explorar' }}
          />
          <Tab.Screen
            name="Favoritos"
            component={FavoritosScreen}
            options={{ tabBarLabel: 'Favoritos' }}
          />
          <Tab.Screen
            name="Mapa"
            component={MapaScreen}
            options={{ tabBarLabel: 'Mapa' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}