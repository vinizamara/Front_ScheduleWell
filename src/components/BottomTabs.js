import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";

// Importe as telas necessárias
import Agendas from "../pages/agendas";
import Controlefinanceiro from "../pages/controlefinanceiro";
import Paginadeperfil from "../pages/paginadeperfil";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      checkLoginStatus();
    }
  }, [isFocused]);

  const checkLoginStatus = async () => {
    try {
      setLoading(true);
      const userLoggedIn = await AsyncStorage.getItem("userLoggedIn");

      if (userLoggedIn === "true") {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Erro ao verificar o login:", error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRestrictedAccess = (routeName) => {
    if (!isLoggedIn) {
      Alert.alert(
        "Faça Login",
        "Você precisa fazer login para acessar essa área. Deseja fazer login agora?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Login", onPress: () => navigation.navigate("Login") },
        ]
      );
      return false; // Bloqueia o acesso
    }
    return true; // Permite o acesso
  };

  return (
    <Tab.Navigator
      initialRouteName="Agendas"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Notas") iconName = "calendar-outline";
          else if (route.name === "Controle Financeiro")
            iconName = "wallet-outline";
          else if (route.name === "Pagina De Perfil") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1F74A7",//#1F74A7
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#C6DBE4",
        },
      })}
    >
      <Tab.Screen
        name="Controle Financeiro"
        component={Controlefinanceiro}
        listeners={{
          tabPress: (e) => {
            if (!handleRestrictedAccess("Controlefinanceiro")) {
              e.preventDefault();
            }
          },
        }}
      />

      <Tab.Screen name="Notas" component={Agendas} />

      <Tab.Screen
        name="Pagina De Perfil"
        component={Paginadeperfil}
        listeners={{
          tabPress: (e) => {
            if (!handleRestrictedAccess("Paginadeperfil")) {
              e.preventDefault();
            }
          },
        }}
      />
    </Tab.Navigator>
  );
}
