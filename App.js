import { registerRootComponent } from 'expo';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AreasScreen from './src/screens/AreasScreen';
import AlertasScreen from './src/screens/AlertasScreen';
import SensoresScreen from './src/screens/SensoresScreen';
import OcorrenciasScreen from './src/screens/OcorrenciasScreen';

const Tab = createBottomTabNavigator();

function App() {
  const [logado, setLogado] = useState(false);

  if (!logado) {
    return <LoginScreen onLogin={() => setLogado(true)} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#1D6A3E',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0.5 },
          headerStyle: { backgroundColor: '#1D6A3E' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
          }}
        />
        <Tab.Screen
          name="Areas"
          component={AreasScreen}
          options={{
            title: 'Áreas',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🗺️</Text>,
          }}
        />
        <Tab.Screen
          name="Alertas"
          component={AlertasScreen}
          options={{
            title: 'Alertas',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🚨</Text>,
          }}
        />
        <Tab.Screen
          name="Sensores"
          component={SensoresScreen}
          options={{
            title: 'Sensores',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📡</Text>,
          }}
        />
        <Tab.Screen
          name="Ocorrencias"
          component={OcorrenciasScreen}
          options={{
            title: 'Ocorrências',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);