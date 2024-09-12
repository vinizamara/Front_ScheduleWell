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
import { Ionicons } from "@expo/vector-icons";
import HeaderAnimation from "../components/headerAnimation";
import sheets from "../axios/axios"; // Importa a instância do Axios

export default function Cadastro() {
  const navigation = useNavigation();

  // Estado para controlar a visibilidade da senha e outros campos
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

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

  // Funções para alternar a visibilidade das senhas
  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleEmailChange = (event) => {
    const newValue = event.nativeEvent.text;
    setEmail(newValue);
  };

  const handleNameChange = (event) => {
    const newValue = event.nativeEvent.text;
    setName(newValue);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    if (!name || !email || !password) {
      Alert.alert("Erro", "Todos os campos são obrigatórios!");
      return;
    }

    const newUser = {
      nome: name,
      email: email,
      senha: password,
    };

    try {
      const response = await sheets.createUser(newUser);

      if (response.status === 201) {
        Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
        navigation.navigate("Agendas");
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("Erro", error.response.data.error);
      } else {
        Alert.alert("Erro", "Erro ao conectar-se ao servidor.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <HeaderAnimation
        message={"Cadastre-se"}
        animationType={"fadeInLeft"}
        style={styles.containerHeader}
      />
      <View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Nome</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputWithoutBorder}
            placeholder="Insira seu nome"
            value={name}
            onChange={(event) => handleNameChange(event)}
          />
        </View>

        <Text style={styles.title}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputWithoutBorder}
            placeholder="Insira seu email"
            value={email}
            onChange={(event) => handleEmailChange(event)}
          />
        </View>

        <Text style={styles.title}>Senha</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Insira sua senha"
            style={styles.inputWithoutBorder}
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          {password.length > 0 && (
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

        <Text style={styles.title}>Confirme sua senha</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Confirme sua senha"
            style={styles.inputWithoutBorder}
            secureTextEntry={!isConfirmPasswordVisible}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          {confirmPassword.length > 0 && (
            <TouchableOpacity
              onPress={toggleConfirmPasswordVisibility}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="#555"
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          animation="fadeInLeft"
          style={styles.button}
          onPress={handleRegister} // Chamando a função de cadastro
        >
          <Text style={styles.buttonText}>Cadastrar-se</Text>
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
});