import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

export default function Controlefinanceiro() {
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
    <ScrollView contentContainerStyle={styles.container}>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E2EDF2",
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },

  //titulo Controle
  title: {
    fontSize: 24,
    fontFamily: "SuezOne_400Regular",
    color: "#255573",
  },
  containerForm: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#255573",
    marginBottom: 5,
    marginTop: 15,
    fontFamily: "SuezOne_400Regular",
    
  },
  subtitle: {
    fontSize: 18,
    color: "#255573",
    textAlign: "center",
    marginVertical: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#C6DBE4",
    
    
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
    backgroundColor: "#C6DBE4",
  },
});
