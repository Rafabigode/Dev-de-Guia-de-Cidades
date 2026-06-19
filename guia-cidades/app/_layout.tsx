import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#0A2540' },
        headerTintColor: '#38BDF8',
        headerTitleStyle: { fontWeight: 'bold', color: '#E8F0FE' },
        tabBarStyle: { backgroundColor: '#0A2540', borderTopColor: '#112244' },
        tabBarActiveTintColor: '#38BDF8',
        tabBarInactiveTintColor: '#445566',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="minhas-cidades"
        options={{
          title: 'Minhas Cidades',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
      {/* Esconde a tela de detalhes das tabs */}
      <Tabs.Screen
        name="detalhes/[id]"
        options={{ href: null }}
      />
    </Tabs>
  );
}
