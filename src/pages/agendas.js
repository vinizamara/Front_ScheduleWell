import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Alert,
  Image,
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Escolhanotas() {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Hook para verificar o foco na tela
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

  // Verifica o status de login sempre que a tela ganhar foco
  useEffect(() => {
    if (isFocused) {
      checkLoginStatus();
    }
  }, [isFocused]);

  if (loading || !fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  // Função chamada ao apertar o botão plus
  const handlePlusPress = () => {
    if (!isLoggedIn) {
      // Exibir alerta se o usuário não estiver logado
      Alert.alert(
        "Faça Login",
        "Você precisa fazer login para criar uma nova nota. Deseja fazer login agora?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Login",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } else {
      navigation.navigate("Escolhanotas");
    }
  };

  const handleNewButton = () => {
    navigation.navigate("Controlefinanceiro");
  };

  const handleProfilePage = () => {
    navigation.navigate("Paginadeperfil"); // Ajuste o nome da rota se necessário
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.plusIconContainer} onPress={handlePlusPress}>
        <Icon name="plus" size={30} color="#1F74A7" />
      </TouchableOpacity>

      {/* Botão de Controle Financeiro só aparece se o usuário estiver logado */}
      {isLoggedIn && (
        <TouchableOpacity style={styles.newButton} onPress={handleNewButton}>
          <Text style={styles.buttonText}>Controle Financeiro</Text>
        </TouchableOpacity>
      )}

      {/* Botão de Login só aparece se o usuário NÃO estiver logado */}
      {!isLoggedIn && (
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      {/* Botão de Página de Perfil só aparece se o usuário estiver logado */}
      {isLoggedIn && (
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePage}>
          <Image source={require("../../assets/icons/perfil.png")} style={styles.perfilImage} />
        </TouchableOpacity>
      )}

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
    top: 10,
    left: 20,
    height: 45,
    backgroundColor: "#1F74A7",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  loginButton: {
    position: "absolute",
    top: 10,
    right: 20,
    height: 45,
    backgroundColor: "#1F74A7",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  profileButton: {
    position: "absolute",
    top: 0,
    right: 20,
    backgroundColor: "#E2EDF2",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",  // Centraliza horizontalmente
    justifyContent: "center", // Centraliza verticalmente
  },
  buttonText: {
    color: "#FFF",
    fontSize: 22,
    fontFamily: "SuezOne_400Regular",
  },
  plusIconContainer: {
    position: "absolute",
    top: "12%",
    right: "5%",
    zIndex: 1,
  },
  notesText: {
    fontSize: 24,
    color: "#255573",
    fontFamily: "SuezOne_400Regular",
    alignSelf: "center",
    marginTop: 50,
  },
  perfilImage: {
    width: 60,
    height: 60,
  },
});
