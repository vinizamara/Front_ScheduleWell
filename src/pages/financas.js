import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from "@react-navigation/native";
import sheets from "../axios/axios"; 
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Financas() {
  const navigation = useNavigation();

  const [financa, setFinanca] = useState({
    tituloNota: "",
    descricaoNota: "",
    dataNota: new Date(),
    valorNota: "",
    tipoTransacao: "",
    frequencia: ""
  });

  const [userId, setUserId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        console.log("User ID recuperado:", storedUserId);
        setUserId(storedUserId ? parseInt(storedUserId) : null);
      } catch (error) {
        console.error("Erro ao obter o ID do usuário:", error.message);
      }
    };

    fetchUserId();
  }, []);

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || financa.dataNota;
    setShowDatePicker(Platform.OS === 'ios');

    // Ajustar a data para o início do dia
    const adjustedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    console.log("Data ajustada:", formatDate(adjustedDate)); // Log da data ajustada
    setFinanca(prevState => ({ ...prevState, dataNota: adjustedDate }));
  };

  const handleInputChange = (name, value) => {
    setFinanca(prevState => ({ ...prevState, [name]: value }));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    const financeData = {
      fk_id_usuario: userId,
      titulo: financa.tituloNota,
      descricao: financa.descricaoNota,
      data: formatDate(financa.dataNota),
      valor: parseFloat(financa.valorNota),
      tipo_transacao: financa.tipoTransacao,
      frequencia: financa.frequencia,
    };

    console.log(financeData); // Log para verificar os dados

    try {
      const response = await sheets.criarFinanca(financeData);
      Alert.alert("Sucesso", response.data.message);
      navigation.navigate("Agendas");
    } catch (error) {
      console.error("Erro:", error); // Log do erro completo
      Alert.alert("Erro na criação de nota", error.response.data.message);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Criação de Finanças</Text>

        <View style={styles.containerForm}>
          <TextInput
            style={styles.input}
            placeholder="Título da Nota"
            value={financa.tituloNota}
            onChangeText={value => handleInputChange("tituloNota", value)}
          />

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Descrição (opcional)"
            value={financa.descricaoNota}
            onChangeText={value => handleInputChange("descricaoNota", value)}
            multiline={true}
          />

          <TouchableOpacity onPress={showDatePickerHandler} style={styles.input}>
            <Text style={styles.dateText}>{formatDate(financa.dataNota)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={financa.dataNota}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          <Text style={styles.transactionTypeLabel}>Tipo de Transação:</Text>
          <View style={styles.transactionTypeContainer}>
            <TouchableOpacity
              style={[styles.receitaButton, financa.tipoTransacao === "Receita" && styles.selectedButton]}
              onPress={() => handleInputChange("tipoTransacao", "Receita")}
            >
              <Text style={styles.transactionButtonText}>Receita <Icon name="plus" size={20} color="#FFF" /></Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.despesaButton, financa.tipoTransacao === "Despesa" && styles.selectedButton]}
              onPress={() => handleInputChange("tipoTransacao", "Despesa")}
            >
              <Text style={styles.transactionButtonText}>Despesa <Icon name="minus" size={20} color="#FFF" /></Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Valor"
            value={financa.valorNota}
            onChangeText={value => handleInputChange("valorNota", value)}
            keyboardType="numeric"
          />

          <Text style={styles.transactionTypeLabel}>Frequência:</Text>
          <View style={styles.frequencyContainer}>
            <TouchableOpacity
              style={[styles.frequencyButton, financa.frequencia === "Diária" && styles.selectedButton]}
              onPress={() => handleInputChange("frequencia", "Diária")}
            >
              <Text style={styles.frequencyButtonText}>Diária</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.frequencyButton, financa.frequencia === "Semanal" && styles.selectedButton]}
              onPress={() => handleInputChange("frequencia", "Semanal")}
            >
              <Text style={styles.frequencyButtonText}>Semanal</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.frequencyContainer}>
            <TouchableOpacity
              style={[styles.frequencyButton, financa.frequencia === "Mensal" && styles.selectedButton]}
              onPress={() => handleInputChange("frequencia", "Mensal")}
            >
              <Text style={styles.frequencyButtonText}>Mensal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.frequencyButton, financa.frequencia === "Anual" && styles.selectedButton]}
              onPress={() => handleInputChange("frequencia", "Anual")}
            >
              <Text style={styles.frequencyButtonText}>Anual</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.frequencyContainer}>
            <TouchableOpacity
              style={[styles.frequencyButton, financa.frequencia === "Única" && styles.selectedButton]}
              onPress={() => handleInputChange("frequencia", "Única")}
            >
              <Text style={styles.frequencyButtonText}>Única</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.footerText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.footerText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E2EDF2",
    paddingTop: 50,
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#255573",
    marginBottom: 20,
  },
  containerForm: {
    width: "80%",
  },
  input: {
    backgroundColor: "#C6DBE4",
    borderColor: "#1F74A7", 
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    justifyContent: "center",
    fontSize: 18,
  },
  descriptionInput: {
    height: 100,
    borderColor: "#1F74A7", 
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#C6DBE4",
    paddingHorizontal: 15,
    textAlignVertical: "top",
  },
  transactionTypeContainer: {
    flexDirection: "row", 
    justifyContent: "space-between",
    marginBottom: 15,
  },
  frequencyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  receitaButton: {
    flex: 1,
    backgroundColor: "#00C288",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#1F74A7", 
  },
  despesaButton: {
    flex: 1,
    backgroundColor: "#EC4E4E",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#1F74A7", 
  },
  selectedButton: {
    backgroundColor: "#255573",
  },
  transactionButtonText: {
    fontSize: 18,
    color: "#FFF",
  },
  transactionTypeLabel: {
    fontSize: 20,
    color: "#255573",
    marginBottom: 10,
    fontWeight: "bold",
  },
  frequencyButton: {
    flex: 1,
    backgroundColor: "#1F74A7",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1F74A7", 
  },
  frequencyButtonText: {
    fontSize: 18,
    color: "#FFF",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: "10%",
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
    backgroundColor: "#EC4E4E",
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
  dateText: {
    fontSize: 16,
    color: "#555", 
  },
});