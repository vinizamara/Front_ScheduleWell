import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Anotacoes() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

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

  const handleSave = () => {
    if (title && date && description) {
      Alert.alert("Nota Salva!", `Título: ${title}\nData: ${date}\nDescrição: ${description}`);
      navigation.navigate("Escolhanotas"); // Navega de volta para a tela "Escolhanotas"
    } else {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDate("");
    setDescription("");
    navigation.goBack(); // Volta para a tela anterior
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Anotações</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Data"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Descrição (opcional)"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.footerText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
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
    color: "#1F74A7",
    fontFamily: "SuezOne_400Regular",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 550, // Espaço para o footer
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#1F74A7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#FF4B4B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
  },
  footerText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "SuezOne_400Regular",
  },
});
