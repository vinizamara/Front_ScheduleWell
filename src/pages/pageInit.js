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

export default function PageInit() {
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
  const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);
  const AnimatableText = Animatable.createAnimatableComponent(Text);

  return (
    <View style={styles.container}>
      <View style={styles.containerForm}>
        <AnimatableText
          style={styles.titulo}
          animation="fadeInUp"
          duration={1000}
        >
          Seja Bem-Vindo ao{" "}
          <AnimatableText
            style={styles.scheduleWell}
            animation="fadeInUp"
            duration={1500}
          >
            ScheduleWell
          </AnimatableText>
        </AnimatableText>
        <AnimatableText
          style={styles.subtitulo}
          animation="fadeInLeft"
          duration={2000}
        >
          Seu assistente pessoal para organização e controle financeiro.
        </AnimatableText>
        <AnimatableText
          style={styles.explicacao}
          animation="fadeInLeft"
          duration={2000}
        >
          Com o ScheduleWell, você gerencia sua rotina e suas finanças em um só
          lugar. Organize suas tarefas diárias, faça anotações importantes e
          controle suas despesas com facilidade.
        </AnimatableText>

        <AnimatableTouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
          animation="pulse"
          duration={1500}
          delay={1000}
        >
          <Text style={styles.buttonText}>Comece agora</Text>
        </AnimatableTouchableOpacity>
      </View>

      <Image
        source={require("../../assets/icons/icon1.png")}
        style={[styles.icon, styles.icon1]}
      />
      <Image
        source={require("../../assets/icons/icon2.png")}
        style={[styles.icon, styles.icon2]}
      />
      <Image
        source={require("../../assets/icons/icon3.png")}
        style={[styles.icon, styles.icon3]}
      />
      <Image
        source={require("../../assets/icons/icon4.png")}
        style={[styles.icon, styles.icon4]}
      />
      <Image
        source={require("../../assets/icons/icon5.png")}
        style={[styles.icon, styles.icon5]}
      />
      <Image
        source={require("../../assets/icons/icon6.png")}
        style={[styles.icon, styles.icon6]}
      />
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
  titulo: {
    fontFamily: "SuezOne_400Regular",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 0,
  },
  subtitulo: {
    fontFamily: "SuezOne_400Regular",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 19,
    color: "#555",
  },
  scheduleWell: {
    color: "#255573",
  },
  explicacao: {
    fontFamily: "SuezOne_400Regular",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    marginTop: 40,
    color: "#555",
  },
  button: {
    backgroundColor: "#1F74A7",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "SuezOne_400Regular",
  },
  icon: {
    width: 50,
    height: 50,
    position: "absolute",
    opacity: 0.5,
  },
  icon1: {
    top: 10,
    left: 10,
  },
  icon2: {
    top: 10,
    right: 10,
  },
  icon3: {
    bottom: 10,
    left: 10,
  },
  icon4: {
    bottom: 10,
    right: 10,
  },
  icon5: {
    top: 10,
  },
  icon6: {
    bottom: 10,
  },
});
