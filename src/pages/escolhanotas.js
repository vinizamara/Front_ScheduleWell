import React, { useEffect } from "react";
import {View,StyleSheet,TouchableOpacity,Image,ActivityIndicator,Text,} from "react-native";
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
  const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);
  const AnimatableText = Animatable.createAnimatableComponent(Text);

  return (
    <View style={styles.container}>
        
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
