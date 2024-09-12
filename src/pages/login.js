import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  TextInput,
  Alert,
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons"; // Importando ícones do Ionicons
import HeaderAnimation from "../components/headerAnimation";
import sheets from "../axios/axios"; // Importa a instância do Axios
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const navigation = useNavigation();

  // Estado para controlar a visibilidade da senha e o conteúdo do campo de senha
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    email: "",
    senha: "",
  });

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
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  // Função para alternar a visibilidade da senha
  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  // Função para atualizar o valor do email diretamente no objeto user
  const handleEmailChange = (text) => {
    setUser({ ...user, email: text });
  };

  // Função para atualizar o valor da senha diretamente no objeto user
  const handlePasswordChange = (text) => {
    setUser({ ...user, senha: text });
  };

  const handleLogin = async () => {
    if (user.email === "" || user.senha === "") {
      Alert.alert("Preencha os campos para entrar");
      return;
    }
  
    try {
      // Faz a chamada de login usando o método postLogin do objeto sheets
      const response = await sheets.postLogin(user);
  
      if (response.status === 200) {
        Alert.alert("Sucesso", response.data.message);
  
        const userName = response.data.user.Nome;
        await AsyncStorage.setItem("userLoggedIn", "true");
        await AsyncStorage.setItem("userName", userName);
  
        navigation.navigate("Home");
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("Erro no login", error.response.data.error);
        console.log(error);
      } else {
        Alert.alert("Erro de Conexão", "Erro ao conectar-se ao servidor.");
        console.log(error);
      }
    }
  };  

  return (
    <View style={styles.container}>
      <HeaderAnimation
        message={"Faça seu login"}
        animationType={"fadeInLeft"}
        style={styles.containerHeader}
      />
      <View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputWithoutBorder}
            placeholder="Insira seu email"
            value={user.email}
            onChangeText={handleEmailChange} // Usando a função para atualizar o email no estado user
          />
        </View>

        <Text style={styles.title}>Senha</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Insira sua senha"
            style={styles.inputWithoutBorder}
            secureTextEntry={!isPasswordVisible}
            value={user.senha}
            onChangeText={handlePasswordChange} // Usando a função para atualizar a senha no estado user
          />
          {user.senha.length > 0 ? (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="#555"
              />
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>

        <TouchableOpacity
          animation="fadeInLeft"
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Fazer Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Cadastro")}
          animation="fadeInLeft"
          style={styles.buttonRegister}
        >
          <Text style={styles.buttonRegisterText}>
            Não possui uma conta? Cadastre-se!
          </Text>
        </TouchableOpacity>

        {error && <Text style={{ color: "red" }}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2EDF2",
    justifyContent: "center",
    alignItems: "center",
  },
  containerHeader: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "5%",
    paddingVertical: "10%",
    marginTop: -50,
  },
  message: {
    color: "#255573",
    fontFamily: "SuezOne_400Regular",
    fontSize: 28,
  },
  containerForm: {
    width: "80%",
  },
  title: {
    fontFamily: "SuezOne_400Regular",
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    marginBottom: 12,
    width: "100%",
  },
  inputWithoutBorder: {
    fontFamily: "SuezOne_400Regular",
    height: 40,
    fontSize: 16,
    paddingHorizontal: 8,
    flex: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  button: {
    backgroundColor: "#1F74A7",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "SuezOne_400Regular",
  },
  buttonRegister: {
    marginTop: 14,
    alignSelf: "center",
  },
  buttonRegisterText: {
    color: "#a1a1a1",
  },
});