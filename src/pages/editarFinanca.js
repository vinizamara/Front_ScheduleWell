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
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import sheets from "../axios/axios"; // Importa o Axios configurado
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditarFinanca() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [financa, setFinanca] = useState({
    tituloNota: "",
    descricaoNota: "",
    dataNota: new Date(),
    valorNota: "",
    tipoTransacao: "",
    frequencia: "",
  });

  const [userId, setUserId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        console.log("User ID recuperado:", storedUserId);
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
      fetchFinanca(userId); // Chama a função para buscar a finança
    }
  }, [userId]); // Executa quando userId for alterado

  const fetchFinanca = async (userId) => {
    if (!userId) return; // Adiciona verificação aqui

    try {
      const response = await sheets.listarFinancas(userId);
      const finance = response.data.find((item) => item.id_financa === id);
      console.log(finance.data);
      console.log(new Date(finance.data));
      if (finance) {
        setFinanca({
          tituloNota: finance.titulo,
          descricaoNota: finance.descricao,
          dataNota: new Date(finance.data),
          valorNota: finance.valor.toString(),
          tipoTransacao: finance.tipo_transacao,
          frequencia: finance.frequencia,
        });
      } else {
        Alert.alert("Erro", "Finança não encontrada.");
      }
    } catch (error) {
      Alert.alert("Erro na busca de notas", error.response.data.error);
    }
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const onChangeDate = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
    }

    const currentDate = selectedDate || financa.dataNota;
    setShowDatePicker(Platform.OS === "ios");
    setFinanca((prevState) => ({ ...prevState, dataNota: currentDate }));
  };

  const handleInputChange = (name, value) => {
    setFinanca((prevState) => ({ ...prevState, [name]: value }));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    // Aplica a correção de fuso horário apenas ao salvar a data
    const adjustedDate = new Date(
      d.getTime() + Math.abs(d.getTimezoneOffset() * 60000)
    );
    const year = adjustedDate.getFullYear();
    const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
    const day = String(adjustedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Formato 'YYYY-MM-DD'
  };

  const formatDateExibition = (date) => {
    const d = new Date(date);
    // Aplica a correção de fuso horário apenas ao salvar a data
    const adjustedDate = new Date(
      d.getTime() + Math.abs(d.getTimezoneOffset() * 60000)
    );
    const year = adjustedDate.getFullYear();
    const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
    const day = String(adjustedDate.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`; // Formato 'YYYY-MM-DD'
  };

  const handleSave = async () => {
    try {
      const response = await sheets.atualizarFinanca(id, {
        fk_id_usuario: userId,
        titulo: financa.tituloNota,
        descricao: financa.descricaoNota,
        data: formatDate(financa.dataNota),
        valor: parseFloat(financa.valorNota),
        tipo_transacao: financa.tipoTransacao,
        frequencia: financa.frequencia,
      });

      Alert.alert("Sucesso", response.data.message);
      navigation.navigate("Main", { screen: "Agendas" });
    } catch (error) {
      Alert.alert("Erro da API", error.response.data.error);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Edição de Finança</Text>

        <View style={styles.containerForm}>
          <TextInput
            style={styles.input}
            placeholder="Título da Nota"
            value={financa.tituloNota}
            onChangeText={(value) => handleInputChange("tituloNota", value)}
          />

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Descrição (opcional)"
            value={financa.descricaoNota}
            onChangeText={(value) => handleInputChange("descricaoNota", value)}
            multiline={true}
          />

          <TouchableOpacity
            onPress={showDatePickerHandler}
            style={styles.input}
          >
            <Text style={styles.dateText}>{formatDateExibition(financa.dataNota)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={
                new Date(
                  financa.dataNota.getTime() +
                    Math.abs(financa.dataNota.getTimezoneOffset() * 60000)
                )
              }
              mode="date"
              onChange={onChangeDate}
            />
          )}

          <Text style={styles.transactionTypeLabel}>Tipo de Transação:</Text>
          <View style={styles.transactionTypeContainer}>
            <TouchableOpacity
              style={[
                styles.receitaButton,
                financa.tipoTransacao === "Receita" && styles.selectedButton,
              ]}
              onPress={() => handleInputChange("tipoTransacao", "Receita")}
            >
              <Text style={styles.transactionButtonText}>
                Receita <Icon name="plus" size={20} color="#FFF" />
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.despesaButton,
                financa.tipoTransacao === "Despesa" && styles.selectedButton,
              ]}
              onPress={() => handleInputChange("tipoTransacao", "Despesa")}
            >
              <Text style={styles.transactionButtonText}>
                Despesa <Icon name="minus" size={20} color="#FFF" />
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Valor"
            value={financa.valorNota}
            onChangeText={(value) => handleInputChange("valorNota", value)}
            keyboardType="numeric"
          />

          <Text style={styles.transactionTypeLabel}>Frequência:</Text>
          <View style={styles.frequencyContainer}>
            <TouchableOpacity
              style={[
                styles.frequencyButton,
                financa.frequencia === "Diaria" && styles.selectedButton,
              ]}
              onPress={() => handleInputChange("frequencia", "Diaria")}
            >
              <Text style={styles.frequencyButtonText}>Diária</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.frequencyButton,
                financa.frequencia === "Semanal" && styles.selectedButton,
              ]}
              onPress={() => handleInputChange("frequencia", "Semanal")}
            >
              <Text style={styles.frequencyButtonText}>Semanal</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.frequencyContainer}>
            <TouchableOpacity
              style={[
                styles.frequencyButton,
                financa.frequencia === "Mensal" && styles.selectedButton,
              ]}
              onPress={() => handleInputChange("frequencia", "Mensal")}
            >
              <Text style={styles.frequencyButtonText}>Mensal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.frequencyButton,
                financa.frequencia === "Anual" && styles.selectedButton,
              ]}
              onPress={() => handleInputChange("frequencia", "Anual")}
            >
              <Text style={styles.frequencyButtonText}>Anual</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.frequencyContainer}>
            <TouchableOpacity
              style={[
                styles.frequencyButton,
                financa.frequencia === "Unica" && styles.selectedButton,
              ]}
              onPress={() => handleInputChange("frequencia", "Unica")}
            >
              <Text style={styles.frequencyButtonText}>Única</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.footerText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.footerText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    paddingVertical: 10,
  },
  descriptionInput: {
    height: 100,
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
    borderColor: "#7A7A7A",
  },
  despesaButton: {
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
    marginBottom: 10,
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
  dateText: {
    fontSize: 16,
    color: "#555",
  },
});
