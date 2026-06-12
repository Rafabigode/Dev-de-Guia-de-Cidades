import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../theme';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ExploreScreen from '../screens/ExploreScreen';
import CityDetailScreen from '../screens/CityDetailScreen';
import MyTripsScreen from '../screens/MyTripsScreen';
import MyTipsScreen from '../screens/MyTipsScreen';
import AddEditTipScreen from '../screens/AddEditTipScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }) => {
  const icons = {
    Explorar: focused ? '🗺️' : '🗺',
    Viagens: focused ? '❤️' : '🤍',
    Dicas: focused ? '💡' : '💡',
    Perfil: focused ? '👤' : '👤',
  };
  return (
    <Text style={{ fontSize: 20 }}>{icons[name] || '•'}</Text>
  );
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: COLORS.surface,
        borderTopColor: COLORS.border,
        borderTopWidth: 1,
        height: 70,
        paddingBottom: 10,
        paddingTop: 8,
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
    })}
  >
    <Tab.Screen name="Explorar" component={ExploreStack} />
    <Tab.Screen name="Viagens" component={MyTripsScreen} />
    <Tab.Screen name="Dicas" component={TipsStack} />
    <Tab.Screen name="Perfil" component={ProfileScreen} />
  </Tab.Navigator>
);

const ExploreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ExploreHome" component={ExploreScreen} />
    <Stack.Screen name="CityDetail" component={CityDetailScreen} />
  </Stack.Navigator>
);

const TipsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TipsHome" component={MyTipsScreen} />
    <Stack.Screen name="AddEditTip" component={AddEditTipScreen} />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="CityDetailGlobal" component={CityDetailScreen} />
            <Stack.Screen name="AddEditTipGlobal" component={AddEditTipScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
