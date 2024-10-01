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
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import sheets from "../axios/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Anotacoes() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [userId, setUserId] = useState(null);

  let [fontsLoaded] = useFonts({
    SuezOne_400Regular,
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      const id = await AsyncStorage.getItem("userId"); // Recupera o ID do usuário
      setUserId(id);
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

  const handleConfirm = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    setDate(formattedDate);
    hideDatePicker();
  };

  const handleSave = async () => {
      try {
        const [day, month, year] = date.split("/");
        const dbFormattedDate = `${year}-${month}-${day}`;

        const response = await sheets.postNota({
          fk_id_usuario: userId, // Usa o ID do usuário recuperado
          data: dbFormattedDate,
          titulo: title,
          descricao: description,
        });
        
          Alert.alert("Sucesso", response.data.message);
          navigation.navigate("Agendas");
      } catch (error) {
        Alert.alert("Erro", error.response.data.message);
      }
  };

  const handleCancel = () => {
    setTitle("");
    setDate("");
    setDescription("");
    navigation.goBack();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
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
        <TouchableOpacity onPress={showDatePicker} style={styles.datePicker}>
          <Text style={styles.dateText}>{date || "Selecione a data"}</Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Descrição"
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

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
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
    marginTop: 30,
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#255573",
    fontFamily: "SuezOne_400Regular",
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingBottom: 20,
  },
  input: {
    height: 60,
    backgroundColor: "#C6DBE4",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#000000",
    borderColor: "#1F74A7",
    borderWidth: 1,
  },
  datePicker: {
    height: 60,
    backgroundColor: "#C6DBE4",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    justifyContent: 'center',
    borderColor: "#1F74A7",
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
    color: "#255573", 
  },
  textarea: {
    flex: 1,
    textAlignVertical: "top",
    height: 'auto',
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#1F74A7",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#FF4B4B",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
  },
  footerText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "SuezOne_400Regular",
  },
});
