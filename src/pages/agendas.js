import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sheets from "../axios/axios";

export default function Escolhanotas() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [financas, setFinancas] = useState([]);
  const [anotacoes, setAnotacoes] = useState([]);
  const [checklists, setChecklists] = useState([]);

  let [fontsLoaded] = useFonts({
    SuezOne_400Regular,
  });

  const checkLoginStatus = async () => {
    try {
      setLoading(true);
      const userLoggedIn = await AsyncStorage.getItem("userLoggedIn");

      if (userLoggedIn === "true") {
        setIsLoggedIn(true);
        const idUsuario = await AsyncStorage.getItem("userId");
        listarFinancas(idUsuario);
        listarAnotacoes(idUsuario);
        listarChecklists(idUsuario);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Erro ao verificar o login:", error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const listarFinancas = async (idUsuario) => {
    try {
      const response = await sheets.listarFinancas(idUsuario);
      setFinancas(response.data);
    } catch (error) {
      console.log("Erro ao buscar finanças:", error.response.data.message);
    }
  };

  const listarAnotacoes = async (idUsuario) => {
    try {
      const response = await sheets.getNota(idUsuario);
      setAnotacoes(response.data);
    } catch (error) {
      console.log("Erro ao buscar notas:", error.response.data.message);
    }
  };

  const listarChecklists = async (idUsuario) => {
    try {
      const response = await sheets.getChecklists(idUsuario);
      setChecklists(response.data);
    } catch (error) {
      console.log("Erro ao buscar checklists:", error.response.data.message);
    }
  };

  const handleDeleteItem = async (id, type) => {
    let deleteFunction;
    let setStateFunction;

    switch (type) {
      case "financa":
        deleteFunction = sheets.deletarFinanca; // Função para deletar finanças
        setStateFunction = setFinancas; // Função para atualizar o estado de finanças
        break;
      case "anotacao":
        deleteFunction = sheets.deleteNota; // Função para deletar anotações
        setStateFunction = setAnotacoes; // Função para atualizar o estado de anotações
        break;
      case "checklist":
        deleteFunction = sheets.deleteChecklist; // Função para deletar checklists
        setStateFunction = setChecklists; // Função para atualizar o estado de checklists
        break;
      default:
        console.error("Tipo inválido para exclusão:", type);
        return;
    }

    Alert.alert(
      `Deletar ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      `Tem certeza que deseja deletar essa ${type}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              await deleteFunction(id); // Chama a função de deleção
              Alert.alert(
                "Sucesso",
                `${
                  type.charAt(0).toUpperCase() + type.slice(1)
                } deletada com sucesso.`
              );

              // Atualiza a lista removendo o item deletado
              setStateFunction((prevItems) =>
                prevItems.filter((item) => {
                  if (type === "financa") return item.id_financa !== id; // Verifica pelo ID de finanças
                  if (type === "anotacao") return item.id_anotacao !== id; // Verifica pelo ID de anotações
                  if (type === "checklist") return item.id_checklist !== id; // Verifica pelo ID de checklists
                })
              );
            } catch (error) {
              console.error(
                `Erro ao deletar ${type}:`,
                error.response?.data?.message.error
              );
              Alert.alert("Erro", `Ocorreu um erro ao deletar a ${type}.`);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (isFocused) {
      checkLoginStatus();
    }
  }, [isFocused]);

  const handlePlusPress = () => {
    if (!isLoggedIn) {
      Alert.alert(
        "Faça Login",
        "Você precisa fazer login para criar uma nova nota. Deseja fazer login agora?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Login", onPress: () => navigation.navigate("Login") },
        ]
      );
    } else {
      navigation.navigate("Escolhanotas");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.notesText}>Suas Notas</Text>

      {/* Botão "+" centralizado na parte inferior */}
      <View style={styles.plusButtonContainer}>
        <TouchableOpacity style={styles.plusButton} onPress={handlePlusPress}>
          <Icon name="plus" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Exibição de Finanças */}
        {financas.length > 0 && (
          <>
            <Text style={styles.sectionTitleTop}>Finanças</Text>
            {financas.map((financa) => (
              <TouchableOpacity
                key={financa.id_financa}
                style={styles.financaContainer}
                onPress={() =>
                  navigation.navigate("EditarFinanca", {
                    id: financa.id_financa,
                  })
                }
              >
                <Text style={styles.financaText}>{financa.titulo}</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      handleDeleteItem(financa.id_financa, "financa")
                    }
                  >
                    <Icon name="trash" size={28} color="#EC4E4E" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Exibição de Anotações */}
        {anotacoes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Anotações</Text>
            {anotacoes.map((anotacao) => (
              <TouchableOpacity
                key={anotacao.id_anotacao}
                style={styles.financaContainer}
                onPress={() =>
                  navigation.navigate("EditarAnotacao", {
                    id: anotacao.id_anotacao,
                  })
                }
              >
                <Text style={styles.financaText}>{anotacao.titulo}</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      handleDeleteItem(anotacao.id_anotacao, "anotacao")
                    }
                  >
                    <Icon name="trash" size={28} color="#EC4E4E" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Exibição de Checklists */}
        {checklists.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Checklists</Text>
            {checklists.map((checklist) => (
              <TouchableOpacity
                key={checklist.id_checklist}
                style={styles.financaContainer}
                onPress={() =>
                  navigation.navigate("EditarChecklist", {
                    id: checklist.id_checklist,
                  })
                }
              >
                <Text style={styles.financaText}>{checklist.titulo}</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      handleDeleteItem(checklist.id_checklist, "checklist")
                    }
                  >
                    <Icon name="trash" size={28} color="#EC4E4E" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {financas.length === 0 &&
          anotacoes.length === 0 &&
          checklists.length === 0 && (
            <Text style={styles.batataText}>
              Você ainda não possui nenhuma anotação criada
            </Text>
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2EDF2",
    paddingHorizontal: 20,
  },
  notesText: {
    fontSize: 24,
    color: "#255573",
    fontFamily: "SuezOne_400Regular",
    alignSelf: "center",
    marginTop: 20,
  },
  financaContainer: {
    backgroundColor: "#C6DBE4",
    padding: 15,
    borderRadius: 10,
    marginTop: "3%",
    marginBottom: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  financaText: {
    color: "#255573",
    fontSize: 18,
    fontFamily: "SuezOne_400Regular",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 25,
  },
  batataText: {
    textAlign: "center",
    fontSize: 25,
    color: "#255573",
    marginTop: "20%",
    fontFamily: "SuezOne_400Regular",
  },
  sectionTitle: {
    fontFamily: "SuezOne_400Regular",
    fontSize: 25,
    color: "#255573",
    marginTop: 20,
    marginBottom: 0,
  },
  sectionTitleTop: {
    fontFamily: "SuezOne_400Regular",
    fontSize: 25,
    color: "#255573",
    marginTop: 0,
    marginBottom: 0,
  },
  plusButtonContainer: {
    alignItems: "flex-end",
    paddingVertical: 10,
    backgroundColor: "#E2EDF2",
  },
  plusButton: {
    backgroundColor: "#1F74A7",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
