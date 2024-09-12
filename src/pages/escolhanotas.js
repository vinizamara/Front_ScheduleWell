import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

export default function Escolhanotas() {
  const navigation = useNavigation();

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

  // Criando componentes animáveis para TouchableOpacity e Text
  const AnimatableTouchableOpacity =
    Animatable.createAnimatableComponent(TouchableOpacity);
  const AnimatableText = Animatable.createAnimatableComponent(Text);

  return (
    <View style={styles.container}>
      <TouchableOpacity animation="fadeInLeft" style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonAnotação}>
        <Text style={styles.title}>Finanças</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonAnotação}>
        <Text style={styles.title}>Anotação</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonAnotação}>
        <Text style={styles.title}>Listagem</Text>
        <Text style={styles.d}>Breve Descrição</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2EDF2",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  containerForm: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "5%",
    paddingVertical: "10%",
    marginTop: -50,
  },

  button: {
    backgroundColor: "#1F74A7",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    position: "absolute",
    top: 20,
    right: 20,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "SuezOne_400Regular",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2EDF2",
  },
  buttonAnotação: {
    backgroundColor: "#1F74A7",
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 10,
    marginTop: 10,  // Espaçamento superior
    marginBottom: 10, // Espaçamento inferior
    marginHorizontal: 20, // Espaçamento lateral 
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', // Centraliza o texto dentro do componente
    color: '#white', // Cor do texto
  },
});
