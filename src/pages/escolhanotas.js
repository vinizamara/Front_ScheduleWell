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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Selecione o tipo de anotação:</Text>

        <TouchableOpacity
          style={styles.buttonAnotacao}
          onPress={() => navigation.navigate("Financas")}
        >
          <Image source={require("../../assets/icons/porco.png")} />
          <Text style={styles.title}>Finança</Text>
          <Text style={styles.subtitulo}>
            Gerencie suas finanças pessoais, acompanhando suas despesas e
            receitas de forma eficiente.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonAnotacao}
          onPress={() => navigation.navigate("Anotacoes")}
        >
          <Image source={require("../../assets/icons/checklist.png")} />
          <Text style={styles.title}>Anotação</Text>
          <Text style={styles.subtitulo}>
            Crie e edite anotações para se organizar em suas atividades diárias.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonAnotacao}
          onPress={() => navigation.navigate("Checklist")}
        >
          <Image source={require("../../assets/icons/anotacoes.png")} />
          <Text style={styles.title}>Listagem</Text>
          <Text style={styles.subtitulo}>
            Organize suas tarefas ou compras com uma lista de verificação
            personalizada.
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#E2EDF2",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "500",
    color: "#255573",
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 20, // Ajustado para mais espaço entre o título e o botão
    marginTop: 20,
    fontFamily: "SuezOne_400Regular",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "SuezOne_400Regular",
  },
  buttonAnotacao: {
    backgroundColor: "#1F74A7",
    width: 230,
    height: 230,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "SuezOne_400Regular",
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    fontWeight: "1000",
    color: "#F5F5F5",
    textAlign: "center",
    lineHeight: 20,
    letterSpacing: 1,
    marginBottom: 15,
  },
});
