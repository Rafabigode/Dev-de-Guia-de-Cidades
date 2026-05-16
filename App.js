import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListaCidades from './screens/ListaCidades';
import DetalhesCidade from './screens/DetalhesCidade';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ListaCidades"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0a1628',
          },
          headerTintColor: '#4db8ff',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#ffffff',
          },
        }}
      >
        <Stack.Screen
          name="ListaCidades"
          component={ListaCidades}
          options={{ title: '🌍 GNUOcto — Guia de Cidades' }}
        />
        <Stack.Screen
          name="DetalhesCidade"
          component={DetalhesCidade}
          options={({ route }) => ({ title: route.params?.nomeCidade || 'Detalhes' })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}