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
import { Ionicons } from "@expo/vector-icons";
import HeaderAnimation from "../components/headerAnimation";
import sheets from "../axios/axios"; // Importa a instância do Axios
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Cadastro() {
  const navigation = useNavigation();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  let [fontsLoaded] = useFonts({ SuezOne_400Regular });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const handleEmailChange = (text) => setEmail(text);
  const handleNameChange = (text) => setName(text);

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible((prev) => !prev);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    if (!name || !email || !password) {
      Alert.alert("Erro", "Todos os campos são obrigatórios!");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Erro", "Email inválido!");
      return;
    }

    const newUser = {
      nome: name,
      email: email,
      senha: password,
      confirmarSenha: password,
    };

    try {
      const response = await sheets.createUser(newUser);
      if (response.status === 201) {
        Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");

        // Armazenar informações no AsyncStorage
        await AsyncStorage.setItem("userLoggedIn", "true");
        await AsyncStorage.setItem("userName", name);

        navigation.navigate("Login");
      }
    } catch (error) {
      const errorMessage = error.response
        ? `${error.response.data.error}`
        : "Erro ao conectar-se ao servidor.";
      Alert.alert("Erro", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderAnimation
        message="Cadastre-se"
        animationType="fadeInLeft"
        style={styles.containerHeader}
      />
      <View style={styles.containerForm}>
        <FormField
          label="Nome"
          placeholder="Insira seu nome"
          value={name}
          onChangeText={handleNameChange}
        />
        <FormField
          label="Email"
          placeholder="Insira seu email"
          value={email}
          onChangeText={handleEmailChange}
        />
        <FormField
          label="Senha"
          placeholder="Insira sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          toggleVisibility={togglePasswordVisibility}
          isVisible={isPasswordVisible}
        />
        <FormField
          label="Confirme sua senha"
          placeholder="Confirme sua senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!isConfirmPasswordVisible}
          toggleVisibility={toggleConfirmPasswordVisibility}
          isVisible={isConfirmPasswordVisible}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const FormField = ({ label, placeholder, value, onChangeText, secureTextEntry, toggleVisibility, isVisible }) => (
  <>
    <Text style={styles.title}>{label}</Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.inputWithoutBorder}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {value.length > 0 && toggleVisibility && (
        <TouchableOpacity onPress={toggleVisibility} style={styles.eyeIcon}>
          <Ionicons
            name={isVisible ? "eye-off" : "eye"}
            size={24}
            color="#555"
          />
        </TouchableOpacity>
      )}
    </View>
  </>
);

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
});
