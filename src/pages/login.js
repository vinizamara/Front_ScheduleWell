import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeaderAnimation from "../components/headerAnimation";
import sheets from "../axios/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const navigation = useNavigation();

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [user, setUser] = useState({
    email: "",
    senha: "",
  });

  let [fontsLoaded] = useFonts({
    SuezOne_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const handleEmailChange = (text) => {
    setUser((prevState) => ({ ...prevState, email: text }));
  };

  const handlePasswordChange = (text) => {
    setUser((prevState) => ({ ...prevState, senha: text }));
  };

  const handleLogin = async () => {
    if (user.email.trim() === "" || user.senha.trim() === "") {
      Alert.alert("Preencha os campos para entrar");
      return;
    }
  
    try {
      const response = await sheets.postLogin(user);
      Alert.alert("Sucesso", response.data.message);
  
      const userName = response.data.user.nome;
      const userEmail = response.data.user.email;
      const userId = response.data.user.id_usuario;
  
      try {
        await AsyncStorage.setItem("userLoggedIn", "true");
        await AsyncStorage.setItem("userName", userName);
        await AsyncStorage.setItem("userEmail", userEmail);
        await AsyncStorage.setItem("userId", userId.toString());
        console.log("Dados salvos com sucesso!");
      } catch (e) {
        console.error("Erro ao armazenar dados no AsyncStorage:", e);
      }
  
      navigation.navigate("Agendas");
    } catch (error) {
      Alert.alert("Erro no login", error.response.data.error);
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
            onChangeText={handleEmailChange}
          />
        </View>

        <Text style={styles.title}>Senha</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Insira sua senha"
            style={styles.inputWithoutBorder}
            secureTextEntry={!isPasswordVisible}
            value={user.senha}
            onChangeText={handlePasswordChange}
          />
          {user.senha.length > 0 && (
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
