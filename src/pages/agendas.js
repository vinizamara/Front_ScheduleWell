import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Escolhanotas() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  let [fontsLoaded] = useFonts({
    SuezOne_400Regular,
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  // Função para verificar login com a API
  const checkLoginStatus = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      const response = await axios.get("https://sua-api.com/verificar-login", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data.loggedIn) {
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

  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (loading || !fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      navigation.navigate("Perfil");
    } else {
      navigation.navigate("Login");
    }
  };

  const handleNewButton = () => {
    console.log("botão pressionado!");
    navigation.navigate("Controlefinanceiro");
  };

  const handleProfilePage = () => {
    navigation.navigate("Paginadeperfil"); // Ajuste o nome da rota se necessário
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.plusIconContainer}
        onPress={() => navigation.navigate("Escolhanotas")}
      >
        <Icon name="plus" size={30} color="#1F74A7" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.newButton}
        onPress={handleNewButton}
      >
        <Text style={styles.buttonText}>Controle Financeiro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLoginLogout}
      >
        <Text style={styles.buttonText}>
          {isLoggedIn ? "Perfil" : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={handleProfilePage}
      >
        <Text style={styles.buttonText}>Página de Perfil</Text>
      </TouchableOpacity>

      <Text style={styles.notesText}>Suas Anotações</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2EDF2",
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  newButton: {
    position: "absolute",
    top: 50,
    left: 20,
    height: 40,
    backgroundColor: "#1F74A7",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  loginButton: {
    position: "absolute",
    top: 100, 
    right: 20,
    height: 40,
    backgroundColor: "#1F74A7",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  profileButton: {
    position: "absolute",
    top: 150, 
    right: 20,
    height: 40,
    backgroundColor: "#1F74A7",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "SuezOne_400Regular",
  },
  plusIconContainer: {
    position: "absolute",
    top: "20%",
    right: "5%",
    zIndex: 1,
  },
  notesText: {
    fontSize: 24,
    color: "#255573",
    fontFamily: "SuezOne_400Regular",
    alignSelf: "flex-start", 
    marginTop: 80, 
  },
});
