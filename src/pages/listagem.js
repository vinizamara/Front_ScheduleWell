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
  Alert
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import sheets from "../axios/axios"; // Importa a instância do Axios

export default function Listagem() {
  const [inputValues, setInputValues] = useState({
    titulo: "",
    data: "",
    descricao: "",
  });
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
        <ActivityIndicator size="large" color="#1F74A7" />
      </View>
    );
  }

  const handleInputChange = (name, value) => {
    if (name === "data") {
      value = formatDate(value);
    }
    setInputValues({ ...inputValues, [name]: value });
  };

  const formatDate = (date) => {
    // Remove todos os caracteres não numéricos
    const cleaned = ('' + date).replace(/\D/g, '');
    // Adiciona a formatação DD/MM/YYYY
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{4})$/);
    if (match) {
      return `${match[1]}/${match[2]}/${match[3]}`;
    }
    // Formata enquanto o usuário digita
    const parts = cleaned.match(/(\d{0,2})(\d{0,2})(\d{0,4})/);
    if (parts) {
      return `${parts[1]}${parts[2] ? '/' + parts[2] : ''}${parts[3] ? '/' + parts[3] : ''}`;
    }
    return cleaned;
  };

  const handleAdd = async () => {
    try {
      // Cria um novo checklist
      const response = await sheets.postChecklist({
        fkIdUsuario: 1, // Substitua com o ID real do usuário
        titulo: inputValues.titulo,
        data: inputValues.data,
        descricao: inputValues.descricao
      });

      if (response.status === 201) {
        Alert.alert("Sucesso", "Checklist adicionado com sucesso!");
        navigation.navigate("Agendas");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao adicionar o checklist.");
    }
  };

  const handleSave = () => {
    // Navega para a página Agendas
    navigation.navigate("Agendas");
  };

  const handleCancel = () => {
    navigation.navigate("Escolhanotas");
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
          placeholder="Data (DD/MM/YYYY)"
          value={inputValues.data}
          onChangeText={(text) => handleInputChange("data", text)}
          keyboardType="numeric" // Aceita apenas números
          maxLength={10} // Limita a 10 caracteres
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Descrição (opcional)"
          value={inputValues.descricao}
          onChangeText={(text) => handleInputChange("descricao", text)}
          multiline
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Icon name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
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
    flex: 1,
    marginTop: 10, // Ajustado para aproximar os campos do título
    paddingBottom: 70,
    justifyContent: "center",
  },
  input: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10, // Ajustado para diminuir o espaçamento
    fontSize: 16,
    borderColor: "#1F74A7",
    borderWidth: 1,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
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
    bottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: "#1F74A7",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#EC4E4E",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
