import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ListaPontosTuristicos from './screens/ListaPontosTuristicos';
import DetalhesPontoTuristico from './screens/DetalhesPontoTuristico';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ListaPontos"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a5276',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="ListaPontos"
          component={ListaPontosTuristicos}
          options={{ title: 'Pontos Turísticos de Curitiba' }}
        />
        <Stack.Screen
          name="DetalhesPonto"
          component={DetalhesPontoTuristico}
          options={({ route }) => ({ title: route.params?.nomePonto || 'Detalhes' })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
