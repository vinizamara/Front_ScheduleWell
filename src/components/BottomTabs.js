import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importe as telas necessárias
import Agendas from '../pages/agendas';
import Controlefinanceiro from '../pages/controlefinanceiro';
import Paginadeperfil from '../pages/paginadeperfil';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Agendas"  // Define "Agendas" como a rota inicial
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Agendas') {
            iconName = 'calendar-outline';
          } else if (route.name === 'Controlefinanceiro') {
            iconName = 'wallet-outline';
          } else if (route.name === 'Paginadeperfil') {
            iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1F74A7',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,  // Oculta o cabeçalho em todas as telas
      })}
    >
      <Tab.Screen name="Agendas" component={Agendas} />
      <Tab.Screen name="Controlefinanceiro" component={Controlefinanceiro} />
      <Tab.Screen name="Paginadeperfil" component={Paginadeperfil} />
    </Tab.Navigator>
  );
}
