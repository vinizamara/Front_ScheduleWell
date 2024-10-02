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
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons"; // Importando o ícone

import sheets from "../axios/axios"; // Certifique-se de que o axios está corretamente configurado.

export default function Listagem() {
  const route = useRoute();
  const { id } = route.params;

  const [userId, setUserId] = useState(null);

  const [inputValues, setInputValues] = useState({
    titulo: "",
    data: "",
    descricao: "",
  });

  const [itens, setItens] = useState([]); // Estado para armazenar os itens do checklist
  const [itemInput, setItemInput] = useState(""); // Estado para o campo de entrada do item
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (userId) {
      fetchChecklist(userId); // Chama a função para buscar a anotação
    }
    if (id) {
      fetchChecklistItems(id); // Chama a função para buscar os itens do checklist
    }
  }, [userId, id]); // Executa quando userId for alterado

  const fetchChecklist = async (userId) => {
    if (!userId) return;

    try {
      const response = await sheets.getChecklists(userId); // Supondo que você tenha esta função na API
      const checklistEncontrado = response.data.find(item => item.id_checklist === id);
      if (checklistEncontrado) {
        setInputValues({
          titulo: checklistEncontrado.titulo,
          data: new Date(checklistEncontrado.data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          descricao: checklistEncontrado.descricao,
        });
        console.log(inputValues.data)
      } else {
        Alert.alert("Erro", "Checklist não encontrado.", response.data.message);
      }
    } catch (error) {
      Alert.alert("Erro da API", error.response.data.message || "Erro desconhecido");
      console.log("Erro ao buscar anotação:", error.response.data.message);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  const fetchChecklistItems = async (idChecklist) => {
    try {
      const response = await sheets.getItemChecklists(idChecklist); // Faz a requisição para a API
      setItens(response.data); // Atualiza o estado com os itens do checklist
    } catch (error) {
      console.log("Erro", error.response.data.message);
    }
  };

  const handleInputChange = (name, value) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleItemInputChange = (text) => {
    setItemInput(text);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    setInputValues({ ...inputValues, data: formattedDate });
    hideDatePicker();
  };

  const handleRemoveItem = (idItem) => {
    Alert.alert(
      "Confirmação de Deleção",
      "Você tem certeza que deseja remover este item?",
      [
        {
          text: "Cancelar",
          style: "cancel", // Define o estilo do botão como "cancel"
        },
        {
          text: "Remover",
          onPress: async () => {
            console.log("ID do item a ser removido:", idItem);
            try {
              const response = await sheets.deleteItemChecklist(idItem); // Função para deletar o item da API
              setItens(itens.filter((item) => item.id_item_checklist !== idItem)); // Atualiza a lista removendo o item
              Alert.alert("Sucesso", response.data.message);
              console.log("ID recebido para remover:", idItem);
            } catch (error) {
              Alert.alert("Erro", error.response.data.message);
              console.error("Erro ao remover item:", error.response.data.message);
            }
          },
          style: "destructive", // Define o estilo do botão como "destructive" para indicar ação perigosa
        },
      ],
      { cancelable: true } // Permite fechar o alerta tocando fora dele
    );
  };  

  const handleSave = async () => {
    if (!userId) {
      Alert.alert("Erro", "ID do usuário não encontrado.");
      return;
    }

    try {
      const response = await sheets.updateChecklist(id, {
        titulo: inputValues.titulo,
        descricao: inputValues.descricao,
        data:  inputValues.data.split("/").reverse().join("-")
      });

        Alert.alert("Sucesso",response.data.message );
        navigation.navigate("Agendas");
     
    } catch (error) {
      Alert.alert("Erro da API", error.response.data.message);
    }
  };

  const handleUpdateItem = async (idItemChecklist, texto, concluido) => {
    try {
      const response = await sheets.updateItemChecklist(idItemChecklist, {
        texto: texto,
        concluido: concluido,
      });
      
      Alert.alert("Sucesso", response.data.message);
      fetchChecklistItems(id); // Recarrega os itens após a atualização
    } catch (error) {
      Alert.alert("Erro ao atualizar item", error.response.data.message || "Erro desconhecido");
      console.error("Erro ao atualizar item:", error.response.data.message);
    }
  };

  const handleAddItem = async () => {
    if (itemInput.trim() === "") {
      Alert.alert("Erro", "O item não pode ser vazio.");
      return;
    }
  
    // Adicionar o item ao estado
    const newItem = { texto: itemInput, concluido: false };
    setItens([...itens, newItem]);
  
    // Salvar o item na API
    try {
      const response = await sheets.postItemChecklist({
        fkIdChecklist: id, // ID da checklist atual
        texto: itemInput,
        concluido: false,
      });
      
      // Limpar o campo de entrada após adicionar o item
      setItemInput("");
  
      Alert.alert("Sucesso", response.data.message);
    } catch (error) {
      Alert.alert("Erro ao adicionar item", error.response.data.message);
    }
  };
  

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1F74A7" />
      </View>
    );
  }

  return (
    <View style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Edição de Listagem</Text>
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
            {inputValues.data ? inputValues.data.toString() : "Selecione a data"}
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
          keyExtractor={(item) => item.id_item_checklist}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => handleUpdateItem(item.id_item_checklist, item.texto, !item.concluido)}
              >
                {item.concluido ? <View style={styles.checked} /> : null}
              </TouchableOpacity>
              <TextInput
                style={styles.itemText}
                value={item.texto}
                editable={false}
              />
              <TouchableOpacity 
                onPress={() => handleRemoveItem(item.id_item_checklist)} 
                style={styles.deleteButton}
              >
                <Icon name="delete" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
          keyboardShouldPersistTaps="handled"
        />

      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.footerText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.footerText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
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
    alignSelf: "flex-end", // Centraliza o botão horizontalmente
    backgroundColor: "#1F74A7",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10, // Espaçamento entre o botão e o campo de título
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
    backgroundColor: "#FF4B4B", // Cor de fundo vermelha
    borderRadius: 8, // Bordas arredondadas
    padding: 10, // Padding para criar um espaço interno
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", // Sombra
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
