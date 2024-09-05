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
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons"; // Importando ícones do Ionicons

export default function Login() {
  const navigation = useNavigation();

  // Estado para controlar a visibilidade da senha e o conteúdo do campo de senha
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState(""); // Estado para armazenar o valor da senha

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

  // Criando componentes animáveis para TouchableOpacity e Text
  const AnimatableTouchableOpacity =
    Animatable.createAnimatableComponent(TouchableOpacity);
  const AnimatableText = Animatable.createAnimatableComponent(Text);
  const AnimatableView = Animatable.createAnimatableComponent(View);

  return (
    <View style={styles.container}>
      <AnimatableView animation="fadeInLeft" style={styles.containerHeader}>
        <Text style={styles.message}>Faça seu login!</Text>
      </AnimatableView>

      <View style={styles.containerForm}>
        <Text style={styles.title}>Email</Text>
        <TextInput placeholder="Insira seu email" style={styles.input} />

        <Text style={styles.title}>Senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Insira sua senha"
            style={styles.inputWithoutBorder} // Removendo a barra extra
            secureTextEntry={!isPasswordVisible} // Define se a senha está visível ou não
            value={password} // Vinculando o valor ao estado de senha
            onChangeText={(text) => setPassword(text)} // Atualiza o estado de senha ao digitar
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

        <AnimatableTouchableOpacity style={styles.button} onPress={() => {console.log("Botão funfando!");
        }}>
          <Text style={styles.buttonText}>Fazer Login</Text>
        </AnimatableTouchableOpacity>

        <AnimatableTouchableOpacity style={styles.buttonRegister}>
          <Text style={styles.buttonRegisterText}>
            Não possui uma conta? Cadastre-se!
          </Text>
        </AnimatableTouchableOpacity>
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
    position: "absolute",
    top: "10%",
    width: "100%",
    alignItems: "center",
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
  input: {
    fontFamily: "SuezOne_400Regular",
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
    paddingHorizontal: 8,
    width: "100%",
  },
  inputWithoutBorder: {
    fontFamily: "SuezOne_400Regular",
    height: 40,
    fontSize: 16,
    paddingHorizontal: 8,
    width: "90%", // Ajustando para dar espaço ao ícone
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1, // Mantendo o borderBottom apenas para o container
    marginBottom: 12,
    width: "100%",
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
