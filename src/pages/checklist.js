import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Listagem() {
  const [inputValues, setInputValues] = useState({
    titulo: "",
    data: "",
    descricao: "",
  });

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

  const handleInputChange = (name, value) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Listagem</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={inputValues.titulo}
          onChangeText={(text) => handleInputChange("titulo", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Data"
          value={inputValues.data}
          onChangeText={(text) => handleInputChange("data", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Descrição (opcional)"
          value={inputValues.descricao}
          onChangeText={(text) => handleInputChange("descricao", text)}
        />
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.footerText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.footerText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2EDF2",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1F74A7",
    fontFamily: "SuezOne_400Regular",
  },
  formContainer: {
    flex: 1, // Ocupa o espaço restante acima do footer
    marginTop: 20,
    paddingBottom: 70, // Espaço para o botão de adicionar e evitar sobreposição com o footer
    justifyContent: "center", // Centraliza os campos e o botão de adicionar verticalmente
  },
  input: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderColor: "#1F74A7",
    borderWidth: 1,
  },
  addButtonContainer: {
    alignItems: "flex-end",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#1F74A7",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 20,
    bottom: 20, // Espaço do botão em relação ao fundo
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "SuezOne_400Regular",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 450,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: "#1F74A7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1, // Ocupa o espaço disponível
    marginRight: 10, // Espaçamento entre o botão de salvar e o botão de cancelar
  },
  cancelButton: {
    backgroundColor: "#FF4B4B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1, // Ocupa o espaço disponível
  },
  footerText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "SuezOne_400Regular",
    textAlign: "center", // Centraliza o texto no botão
  },
});
