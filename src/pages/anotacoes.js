import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Alert } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";

export default function Anotacoes() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

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
    <View style={styles.container}>
      <Animatable.View animation="fadeInUp" style={styles.formContainer}>
        <Animatable.Text animation="fadeInLeft" style={styles.title}>Adicionar Nota</Animatable.Text>

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
          keyboardType="default"
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Descrição"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2EDF2",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    backgroundColor: "#C6DBE4",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#C6DBE4",
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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
