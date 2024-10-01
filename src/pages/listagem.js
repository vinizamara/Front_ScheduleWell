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
  Alert,
  FlatList,
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons"; // Importando o ícone

import sheets from "../axios/axios"; // Certifique-se de que o axios está corretamente configurado.

export default function Listagem() {
  const [userId, setUserId] = useState(null);
  const [inputValues, setInputValues] = useState({
    titulo: "",
    data: "",
    descricao: "",
  });
  const [itens, setItens] = useState([]); // Estado para armazenar os itens do checklist
  const [itemInput, setItemInput] = useState(""); // Estado para o campo de entrada do item
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
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

    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        console.log("User ID recuperado:", storedUserId); // Log do userId
        setUserId(storedUserId ? parseInt(storedUserId) : null); // Converte para número se não for null
      } catch (error) {
        console.error("Erro ao obter o ID do usuário:", error);
      }
    };

    fetchUserId();
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
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleItemInputChange = (text) => {
    setItemInput(text);
  };

  const handleCancel = () => {
    navigation.navigate("Escolhanotas");
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setInputValues({ ...inputValues, data: formattedDate });
    hideDatePicker();
  };

  const handleAddItem = () => {
    if (itemInput.trim() === "") {
      Alert.alert("Erro", "O item não pode ser vazio.");
      return;
    }
    setItens([...itens, { texto: itemInput, concluido: false }]);
    setItemInput("");
  };

  const handleRemoveItem = (index) => {
    const newItems = itens.filter((_, i) => i !== index);
    setItens(newItems);
  };

  const handleSave = async () => {
    try {
      const response = await sheets.postChecklist({
        fkIdUsuario: userId,
        titulo: inputValues.titulo,
        data: inputValues.data,
        descricao: inputValues.descricao,
      });

      if (
        response.status === 201 &&
        response.data.result.insertId !== undefined
      ) {
        const checklistId = response.data.result.insertId;

        for (const item of itens) {
          await sheets.postItemChecklist({
            fkIdChecklist: checklistId,
            texto: item.texto,
            concluido: item.concluido,
          });
        }

        Alert.alert("Sucesso", "Checklist criado com sucesso!");
        navigation.navigate("Agendas");
      } else {
        Alert.alert(
          "Erro",
          "Erro ao criar o checklist: " +
            (response.data.message || "Mensagem de erro não disponível")
        );
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Alert.alert(
          "Erro",
          "Erro ao adicionar o checklist e itens: " +
            error.response.data.message
        );
      } else if (error.request) {
        Alert.alert(
          "Erro",
          "Erro ao adicionar o checklist e itens: Não houve resposta do servidor."
        );
      } else {
        Alert.alert(
          "Erro",
          "Erro ao adicionar o checklist e itens: " + error.message
        );
      }
    }
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
        <TouchableOpacity onPress={showDatePicker} style={styles.datePicker}>
          <Text style={styles.dateText}>
            {inputValues.data || "Selecione a data"}
          </Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Descrição (opcional)"
          value={inputValues.descricao}
          onChangeText={(text) => handleInputChange("descricao", text)}
          multiline
        />

        {/* Botão de adicionar item acima do campo de título da tarefa */}
        <TouchableOpacity style={styles.addButtonAbove} onPress={handleAddItem}>
          <Icon name="add" size={30} color="#FFF" />
        </TouchableOpacity>
        
          <TextInput
            style={styles.input}
            placeholder="Título da Tarefa"
            value={itemInput}
            onChangeText={handleItemInputChange}
          />

        <FlatList
          data={itens}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.itemRow}>
              {/* Checkbox do item */}
              <TouchableOpacity style={styles.checkbox}>
                {item.concluido && <View style={styles.checked} />}
              </TouchableOpacity>

              {/* Texto do item */}
              <Text style={styles.itemText}>{item.texto}</Text>

              {/* Botão para deletar o item */}
              <TouchableOpacity 
                onPress={() => handleRemoveItem(index)} 
                style={styles.deleteButton} // Adicionando estilo ao botão de deletar
              >
                <Icon name="delete" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <View style={styles.buttons}>
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
    borderColor: "#1F74A7", 
    borderWidth: 1,
  },
  textarea: {
    height: 100,
    borderColor: "#1F74A7", 
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#C6DBE4",
    paddingHorizontal: 15,
  },
  datePicker: {
    height: 60,
    backgroundColor: "#C6DBE4",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    justifyContent: "center",
    borderColor: "#1F74A7", 
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
    color: "#555",
  },
  addButtonAbove: {
    alignSelf: "flex-end",
    backgroundColor: "#1F74A7",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  itemInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    borderColor: "#1F74A7", 
    borderWidth: 1,
  },
  checkbox: {
    width: 35,
    height: 35,
    borderRadius: 4,
    borderColor: "#1F74A7",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checked: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: "#1F74A7",
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "#FF4B4B",
    borderRadius: 8,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
  },
  saveButton: {
    backgroundColor: "#1F74A7",
    borderRadius: 8,
    padding: 15,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#FF4B4B",
    borderRadius: 8,
    padding: 15,
    flex: 1,
    alignItems: "center",
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
