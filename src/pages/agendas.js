import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  TextInput,
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"; // Usando axios para requisições HTTP

export default function Escolhanotas() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar se o usuário está logado
  const [loading, setLoading] = useState(true); // Estado de carregamento

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
      // Obter o token de autenticação do armazenamento local
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      // Fazer a requisição à API para verificar o token
      const response = await axios.get("https://sua-api.com/verificar-login", {
        headers: {
          Authorization: `Bearer ${token}`, // Passar o token no cabeçalho da requisição
        },
      });

      // Se a resposta for válida, o usuário está logado
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
    checkLoginStatus(); // Verificar o status de login ao carregar o componente
  }, []);

  if (loading || !fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  // Função de pesquisa
  const handleSearch = () => {
    console.log("Pesquisar");
  };

  // Função para login/logout ou navegação para o perfil
  const handleLoginLogout = () => {
    if (isLoggedIn) {
      navigation.navigate("Perfil"); // Navegar para a tela de perfil
    } else {
      navigation.navigate("Login"); // Navegar para a tela de login
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.plusIconContainer}
        onPress={() => navigation.navigate("Escolhanotas")}
      >
        <Icon name="plus" size={30} color="#1F74A7" />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Pesquisar..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.iconContainer} onPress={handleSearch}>
            <Icon name="search" size={20} color="#1F74A7" />
          </TouchableOpacity>
        </View>

        {/* Botão de Login ou Perfil */}
        <TouchableOpacity
          animation="fadeInLeft"
          style={styles.loginButton}
          onPress={handleLoginLogout}
        >
          <Text style={styles.buttonText}>
            {isLoggedIn ? "Perfil" : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
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
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: "70%",
  },
  searchBar: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 40,
    width: "100%",
    backgroundColor: "#C6DBE4",
    borderWidth: 0,
  },
  iconContainer: {
    position: "absolute",
    left: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    height: 40,
    backgroundColor: "#1F74A7",
    paddingVertical: 3,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "SuezOne_400Regular",
  },
  plusIconContainer: {
    position: "absolute",
    top: "15%",
    right: "5%",
    zIndex: 1,
  },
  notesText: {
    fontSize: 24,
    color: "#255573",
    fontFamily: "SuezOne_400Regular",
    textAlign: "center",
    marginTop: "5%",
  },
});
