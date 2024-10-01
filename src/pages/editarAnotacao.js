import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from "@react-navigation/native";
import sheets from "../axios/axios"; // Importa o Axios configurado
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditarAnotacao() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params; // Recupera o ID da anotação

  const [anotacao, setAnotacao] = useState({
    tituloNota: "",
    descricaoNota: "",
    dataNota: new Date(),
  });

  const [userId, setUserId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(true); // Adicionando controle de fonte
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(parseInt(storedUserId)); // Atualiza o estado do userId
        } else {
          Alert.alert("Erro", "ID do usuário não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao obter o ID do usuário:", error);
      }
    };

    fetchUserId(); // Chama a função para obter o ID do usuário
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAnotacao(userId); // Chama a função para buscar a anotação
    }
  }, [userId]); // Executa quando userId for alterado

  const fetchAnotacao = async (userId) => {
    if (!userId) return; // Adiciona verificação aqui

    try {
      const response = await sheets.getNota(userId); // Supondo que você tenha esta função na API
      const anotacaoEncontrada = response.data.find(item => item.id_anotacao === id);

      if (anotacaoEncontrada) {
        setAnotacao({
          tituloNota: anotacaoEncontrada.titulo,
          descricaoNota: anotacaoEncontrada.descricao,
          dataNota: new Date(anotacaoEncontrada.data),
        });
      } else {
        Alert.alert("Erro", "Anotação não encontrada.");
      }
    } catch (error) {
      Alert.alert("Erro da API", error.response.data.message || "Erro desconhecido");
      console.log("Erro ao buscar anotação:", error);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || anotacao.dataNota;
    setShowDatePicker(Platform.OS === 'ios');
    setAnotacao(prevState => ({ ...prevState, dataNota: currentDate }));
  };

  const handleInputChange = (name, value) => {
    setAnotacao(prevState => ({ ...prevState, [name]: value }));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Formato 'YYYY-MM-DD'
  };

  const handleSave = async () => {
    if (!userId) {
      Alert.alert("Erro", "ID do usuário não encontrado.");
      return;
    }

    try {
      const response = await sheets.updateNota(id, {
        titulo: anotacao.tituloNota,
        descricao: anotacao.descricaoNota,
        data: formatDate(anotacao.dataNota),
      });

      if (response.status === 200) {
        Alert.alert("Sucesso", "Anotação atualizada com sucesso!");
        navigation.navigate("Agendas");
      } else {
        Alert.alert("Erro", "Erro ao atualizar a anotação: " + response.data.message);
      }
    } catch (error) {
      Alert.alert("Erro da API", error.response.data.message || "Erro desconhecido");
      console.log("Erro da API:", error.response.data);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1F74A7" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Edição de Anotações</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Título da Nota"
          value={anotacao.tituloNota}
          onChangeText={value => handleInputChange("tituloNota", value)}
        />

        <TouchableOpacity onPress={showDatePickerHandler} style={styles.datePicker}>
          <Text style={styles.dateText}>{anotacao.dataNota.toLocaleDateString() || "Selecione a data"}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={anotacao.dataNota}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Descrição (opcional)"
          value={anotacao.descricaoNota}
          onChangeText={value => handleInputChange("descricaoNota", value)}
          multiline={true}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.footerText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.footerText}>Voltar</Text>
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
    marginTop: 30,
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F74A7",
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
    color: "#1F74A7",
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
  },
});
