import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from "@react-navigation/native";
import sheets from "../axios/axios"; // Importa o Axios configurado
import Icon from 'react-native-vector-icons/FontAwesome';

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
  
  const [showDatePicker, setShowDatePicker] = useState(false);

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || financa.dataNota;
    setShowDatePicker(Platform.OS === 'ios');
    setFinanca(prevState => ({ ...prevState, dataNota: currentDate }));
  };

  const handleInputChange = (name, value) => {
    setFinanca(prevState => ({ ...prevState, [name]: value }));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Formato 'YYYY-MM-DD'
  };

  const handleSave = async () => {
    try {
      const response = await sheets.criarFinanca({
        fk_id_usuario: 1,
        titulo: financa.tituloNota,
        descricao: financa.descricaoNota,
        data: formatDate(financa.dataNota),
        valor: parseFloat(financa.valorNota), // Converte valor para número
        tipo_transacao: financa.tipoTransacao,
        frequencia: financa.frequencia,
      });
  
      if (response.status === 201) {
        Alert.alert("Sucesso", "Finança criada com sucesso!");
        navigation.navigate("Agendas"); // Volta para a tela anterior após salvar
      } else {
        Alert.alert("Erro", "Erro ao criar a finança: " + response.data.message);
      }
    } catch (error) {
      if (error.response) {
        // Resposta do servidor com código de status fora do intervalo 2xx
        Alert.alert("Erro da API", error.response.data.message || "Erro desconhecido");
        console.log("Erro da API:", error.response.data);
      } else if (error.request) {
        // A requisição foi feita, mas não houve resposta
        Alert.alert("Erro", "Nenhuma resposta do servidor.");
        console.log("Erro sem resposta:", error.request);
      } else {
        // Erro ao configurar a requisição
        Alert.alert("Erro", "Erro ao configurar a requisição: " + error.message);
        console.log("Erro na configuração da requisição:", error.message);
      }
    }
  };  

  return (
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
          <Text>{financa.dataNota.toLocaleDateString()}</Text>
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
            style={[
              styles.ganhoButton,
              financa.tipoTransacao === "Ganho" && styles.selectedButton
            ]}
            onPress={() => handleInputChange("tipoTransacao", "Ganho")}
          >
            <Text style={styles.transactionButtonText}>Ganho  <Icon name="plus" size={20} color="#FFF" /></Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.gastoButton,
              financa.tipoTransacao === "Gasto" && styles.selectedButton
            ]}
            onPress={() => handleInputChange("tipoTransacao", "Gasto")}
          >
            <Text style={styles.transactionButtonText}>Gasto  <Icon name="minus" size={20} color="#FFF" /></Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Valor"
          value={financa.valorNota}
          onChangeText={value => handleInputChange("valorNota", value)}
          keyboardType="numeric"
        />

        {/* Texto "Frequência" */}
        <Text style={styles.transactionTypeLabel}>Frequência:</Text>

        {/* Seção Frequência */}
        <View style={styles.frequencyContainer}>
        <TouchableOpacity
            style={[
            styles.frequencyButton,
            financa.frequencia === "Diária" && styles.selectedButton
            ]}
            onPress={() => handleInputChange("frequencia", "Diária")}
        >
            <Text style={styles.frequencyButtonText}>Diária</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[
            styles.frequencyButton,
            financa.frequencia === "Semanal" && styles.selectedButton
            ]}
            onPress={() => handleInputChange("frequencia", "Semanal")}
        >
            <Text style={styles.frequencyButtonText}>Semanal</Text>
        </TouchableOpacity>
        </View>

        {/* Seção Frequência */}
        <View style={styles.frequencyContainer}>
        <TouchableOpacity
            style={[
            styles.frequencyButton,
            financa.frequencia === "Mensal" && styles.selectedButton
            ]}
            onPress={() => handleInputChange("frequencia", "Mensal")}
        >
            <Text style={styles.frequencyButtonText}>Mensal</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[
            styles.frequencyButton,
            financa.frequencia === "Anual" && styles.selectedButton
            ]}
            onPress={() => handleInputChange("frequencia", "Anual")}
        >
            <Text style={styles.frequencyButtonText}>Anual</Text>
        </TouchableOpacity>
        </View>

        {/* Seção Frequência */}
        <View style={styles.frequencyContainer}>
        <TouchableOpacity
            style={[
            styles.frequencyButton,
            financa.frequencia === "Única" && styles.selectedButton
            ]}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2EDF2",
    paddingTop: 50,
    alignItems: "center",
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
    borderColor: "#7A7A7A",
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
    justifyContent: "center",
    fontSize: 18,
  },
  descriptionInput: {
    height: 100,
  },
  transactionTypeContainer: {
    flexDirection: "row", 
    justifyContent: "space-between",
    marginBottom: 15,
  },
  frequencyContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Permite os botões quebrarem linha, se necessário
    justifyContent: "space-between",
  },
  ganhoButton: {
    flex: 1,
    backgroundColor: "#00C288",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#7A7A7A",
  },
  gastoButton: {
    flex: 1,
    backgroundColor: "#EC4E4E",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#7A7A7A",
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
    backgroundColor: "#2884BB",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
    marginBottom: 10, // Espaçamento entre os botões
    borderWidth: 1,
    borderColor: "#7A7A7A",
  },
  frequencyButtonText: {
    fontSize: 18,
    color: "#FFF",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 130,
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
});
