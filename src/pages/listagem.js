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
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Importa a biblioteca do DateTimePickerModal
import sheets from "../axios/axios"; // Importa a instância do Axios

export default function Listagem() {
  const [inputValues, setInputValues] = useState({
    titulo: "",
    data: "",
    descricao: "",
  });
  const [itens, setItens] = useState([]); // Estado para armazenar os itens
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // Estado para mostrar/esconder o picker de data
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
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleAddItem = () => {
    if (!inputValues.titulo || !inputValues.data) {
      Alert.alert("Erro", "Título e data são obrigatórios.");
      return;
    }
    setItens([...itens, { ...inputValues }]);
    setInputValues({
      titulo: "",
      data: "",
      descricao: "",
    });
  };

  const handleSave = async () => {
    try {
      // Primeiro, cria o checklist
      const checklistResponse = await sheets.postChecklist({
        fkIdUsuario: 1, // Substitua com o ID real do usuário
        titulo: inputValues.titulo,
        data: inputValues.data,
        descricao: inputValues.descricao,
      });

      if (checklistResponse.status === 201) {
        const checklistId = checklistResponse.data.result.insertId;

        // Adiciona os itens ao checklist
        for (const item of itens) {
          await sheets.postItemChecklist({
            fkIdChecklist: checklistId,
            texto: item.titulo,
            concluido: false, // ou o valor padrão que você desejar
          });
        }

        Alert.alert("Sucesso", "Checklist e itens adicionados com sucesso!");
        navigation.navigate("Agendas");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao adicionar o checklist e itens.");
    }
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
    setInputValues({ ...inputValues, data: date.toLocaleDateString('pt-BR') });
    hideDatePicker();
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
          <Text style={styles.dateText}>{inputValues.data || "Selecione a data"}</Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Descrição (opcional)"
          value={inputValues.descricao}
          onChangeText={(text) => handleInputChange("descricao", text)}
          multiline
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Icon name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.footerText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.footerText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      {/* Renderiza a lista de itens */}
      <View style={styles.itemList}>
        {itens.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemText}>{item.titulo}</Text>
          </View>
        ))}
      </View>

      {/* DateTimePickerModal */}
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
    marginTop: 30, // Aumenta a distância do topo
    marginBottom: 30, // Aumenta o espaço abaixo do título
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
    justifyContent: "flex-start", // Garante que os campos fiquem alinhados no topo
    paddingBottom: 20, // Espaço para o footer
  },
  input: {
    height: 60, // Aumenta a altura dos campos de entrada
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderColor: "#1F74A7",
    borderWidth: 1,
  },
  datePicker: {
    height: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    justifyContent: 'center',
    borderColor: "#1F74A7",
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
    color: "#1F74A7",
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
    paddingVertical: 15, // Aumenta o padding vertical
    paddingHorizontal: 25, // Aumenta o padding horizontal
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#FF4B4B",
    paddingVertical: 15, // Aumenta o padding vertical
    paddingHorizontal: 25, // Aumenta o padding horizontal
    borderRadius: 8,
    flex: 1,
  },
  footerText: {
    color: "#FFF",
    fontSize: 18, // Aumenta o tamanho do texto
    textAlign: "center",
    fontFamily: "SuezOne_400Regular",
  },
  itemList: {
    marginTop: 20,
  },
  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderColor: "#1F74A7",
    borderWidth: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#1F74A7",
  },
});
