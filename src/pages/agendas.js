import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Alert,
  Image,
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
  const isFocused = useIsFocused(); // Hook para verificar o foco na tela
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [financas, setFinancas] = useState([]);
  const [anotacoes, setAnotacoes] = useState([]);
  const [checklists, setChecklists] = useState([]);

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

  useEffect(() => {
    if (isFocused) {
      checkLoginStatus();
    }
  }, [isFocused]);

  if (loading || !fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

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

  const handleNewButton = () => {
    navigation.navigate("Controlefinanceiro");
  };

  const handleProfilePage = () => {
    navigation.navigate("Paginadeperfil");
  };

  const handleEditFinanca = (idFinanca) => {
    navigation.navigate("EditarFinanca", { id: idFinanca }); // Passando o ID da finança
  }

  const handleEditAnotacao = (idAnotacao) => {
    navigation.navigate("EditarAnotacao", { id: idAnotacao }); // Passando o ID da finança
  }

  const handleEditChecklist = (idChecklist) => {
    navigation.navigate("EditarChecklist", { id: idChecklist }); // Passando o ID da finança
  }

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
              Alert.alert("Sucesso", `${type.charAt(0).toUpperCase() + type.slice(1)} deletada com sucesso.`);

              // Atualiza a lista removendo o item deletado
              setStateFunction((prevItems) =>
                prevItems.filter((item) => {
                  if (type === "financa") return item.id_financa !== id; // Verifica pelo ID de finanças
                  if (type === "anotacao") return item.id_anotacao !== id; // Verifica pelo ID de anotações
                  if (type === "checklist") return item.id_checklist !== id; // Verifica pelo ID de checklists
                })
              );
            } catch (error) {
              console.error(`Erro ao deletar ${type}:`, error.response?.data?.message.error);
              Alert.alert("Erro", `Ocorreu um erro ao deletar a ${type}.`);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.plusIconContainer} onPress={handlePlusPress}>
        <Icon name="plus" size={30} color="#1F74A7" />
      </TouchableOpacity>

      {isLoggedIn && (
        <TouchableOpacity style={styles.newButton} onPress={handleNewButton}>
          <Text style={styles.buttonText}>Controle Financeiro</Text>
        </TouchableOpacity>
      )}

      {!isLoggedIn && (
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      {isLoggedIn && (
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePage}>
          <Image source={require("../../assets/icons/perfil.png")} style={styles.perfilImage} />
        </TouchableOpacity>
      )}

      <Text style={styles.notesText}>Suas Anotações</Text>

      <ScrollView>
        {financas.length === 0 && anotacoes.length === 0 && checklists.length === 0 ? (
          <Text style={styles.batataText}>Você ainda não possui nenhuma anotação criada</Text>
        ) : (
          <>
            {financas.map((financa) => (
              <View key={financa.id_financa} style={styles.financaContainer}>
                <Text style={styles.financaText}>{financa.titulo}</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => handleEditFinanca(financa.id_financa)}>
                    <Icon name="edit" size={30} color="#255573" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteItem(financa.id_financa, "financa")}>
                    <Icon name="trash" size={28} color="#EC4E4E" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {anotacoes.map((anotacao) => (
              <View key={anotacao.id_anotacao} style={styles.financaContainer}>
                <Text style={styles.financaText}>{anotacao.titulo}</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => handleEditAnotacao(anotacao.id_anotacao)}>
                    <Icon name="edit" size={30} color="#255573" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteItem(anotacao.id_anotacao, "anotacao")}>
                    <Icon name="trash" size={28} color="#EC4E4E" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {checklists.map((checklist) => (
              <View key={checklist.id_checklist} style={styles.financaContainer}>
                <Text style={styles.financaText}>{checklist.titulo}</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => handleEditChecklist(checklist.id_checklist)}>
                    <Icon name="edit" size={30} color="#255573" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteItem(checklist.id_checklist, "checklist")}>
                    <Icon name="trash" size={28} color="#EC4E4E" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2EDF2",
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  newButton: {
    position: "absolute",
    top: 10,
    left: 20,
    height: 45,
    backgroundColor: "#1F74A7",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  loginButton: {
    position: "absolute",
    top: 10,
    right: 20,
    height: 45,
    backgroundColor: "#1F74A7",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  profileButton: {
    position: "absolute",
    top: 0,
    right: 20,
    backgroundColor: "#E2EDF2",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 22,
    fontFamily: "SuezOne_400Regular",
  },
  plusIconContainer: {
    position: "absolute",
    top: "12%",
    right: "5%",
    zIndex: 1,
  },
  notesText: {
    fontSize: 24,
    color: "#255573",
    fontFamily: "SuezOne_400Regular",
    alignSelf: "center",
    marginTop: 50,
  },
  perfilImage: {
    width: 60,
    height: 60,
  },
  financaContainer: {
    backgroundColor: "#C6DBE4",
    padding: 15,
    borderRadius: 10,
    marginTop: "10%",
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
    marginTop: "10%",
    fontFamily: "SuezOne_400Regular",
  },
});
