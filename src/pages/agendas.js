import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  FlatList,
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import sheets from "../axios/axios"; // Importando o arquivo axios

export default function Agenda() {
  const navigation = useNavigation();
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    // Função para buscar as notas da API usando axios
    const fetchNotas = async () => {
      try {
        const response = await sheets.getNota({ data: "2024-09-10" , }); // Ajuste conforme necessário
        setNotas(response.data); // Supondo que a resposta contenha um array de notas
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar as notas");
        setLoading(false);
      }
    };

    fetchNotas();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Função para renderizar cada item da lista
  const renderNota = ({ item }) => (
    <View style={styles.notaItem}>
      <Text style={styles.titulo}>{item.titulo}</Text>
      <Text style={styles.subtitulo}>{item.data}</Text>
      <Text style={styles.descricao}>{item.descricao}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNota}
        contentContainerStyle={styles.flatListContent}
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
  flatListContent: {
    padding: 20,
  },
  notaItem: {
    backgroundColor: "#FFF",
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    width: "100%",
  },
  titulo: {
    fontFamily: "SuezOne_400Regular",
    fontSize: 20,
    marginBottom: 5,
  },
  subtitulo: {
    fontFamily: "SuezOne_400Regular",
    fontSize: 16,
    color: "#555",
  },
  descricao: {
    fontFamily: "SuezOne_400Regular",
    fontSize: 14,
    color: "#777",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
