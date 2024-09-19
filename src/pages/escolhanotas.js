import React, { useEffect } from "react";
import {
  ScrollView,
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

  const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);
  const AnimatableText = Animatable.createAnimatableComponent(Text);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Selecione o tipo de anotação:</Text>

      <TouchableOpacity animation="fadeInLeft" style={styles.buttonLogin}
            onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonAnotacao}
      onPress={() => navigation.navigate("Controlefinanceiro")}
      >
        <Text style={styles.title}>Finanças</Text>
        <Text style={styles.subtitulo}>Breve Descrição</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonAnotacao}
      onPress={() => navigation.navigate("Anotacoes")}
      >
        <Text style={styles.title}>Anotação</Text>
        <Text style={styles.subtitulo}>Breve Descrição</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonAnotacao}
             onPress={() => navigation.navigate("Checklist")}
      >
        <Text style={styles.title}>Listagem</Text>
        <Text style={styles.subtitulo}>Breve Descrição</Text>
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
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '500',
    color: '#255573',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 20,
    fontFamily: "SuezOne_400Regular",
  },
  // Estilo do botão de login no canto superior direito
  buttonLogin: {
    position: 'absolute',
    top: 20,
    right: 20,
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
  // Botões de Finanças, Anotação e Listagem como quadrados menores
  buttonAnotacao: {
    backgroundColor: "#1F74A7",
    width: 200, // Mudado para quadrado
    height: 200, // Mudado para quadrado
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 18, // Ajustado o tamanho da fonte
    color: "#fff",
    fontFamily: "SuezOne_400Regular",
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14, // Ajustado o tamanho da fonte
    fontWeight: '1000',
    color: '#F5F5F5',
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 1,
    marginBottom: 15,
  },
});
