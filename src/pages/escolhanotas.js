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

     <Text style={styles.titulo}>Selecione o tipo de anotação:</Text>

      <TouchableOpacity animation="fadeInLeft" style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonAnotação}>
        <Text style={styles.title}>Finanças</Text>
        <Text style={styles.subtitulo}>Breve Descrição</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonAnotação}>
        <Text style={styles.title}>Anotação</Text>
        <Text style={styles.subtitulo}>Breve Descrição</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonAnotação}>
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
  },
  containerForm: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "5%",
    paddingVertical: "10%",
    marginTop: -50,
  },
//botão de Login
  button: {
    backgroundColor: "#1F74A7",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    position: "absolute",
    top: 20,
    right: 20,
  },
  
//botão de Login
  buttonText: {
    color: "#FFF",
    fontSize: 20,
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
    width: 300,
    height: 200,
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
    fontFamily: "SuezOne_400Regular",
    marginBottom: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', 
  },
  subtitulo: {
    fontSize: 20, 
    fontWeight: '1000', 
    color: '#F5F5F5', 
    textAlign: 'center', 
    lineHeight: 26, 
    letterSpacing: 1, 
    marginBottom: 25, 
  },
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#E2EDF2', 
    padding: 20, 
  },
  titulo: {
    fontSize: 22,
    fontWeight: '500', 
    color: '#255573', 
    textAlign: 'center',
    letterSpacing: 0.5, 
    marginBottom: 20, // Espaço abaixo do título
    fontFamily: "SuezOne_400Regular",
  },
});
