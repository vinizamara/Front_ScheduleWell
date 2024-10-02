import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import sheets from "../axios/axios";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ControleFinanceiro() {
  const navigation = useNavigation();

  const [rendaTotal, setRendaTotal] = useState("");
  const [gastoMensal, setGastoMensal] = useState("");
  const [ganhoMensal, setGanhoMensal] = useState("");
  const [saldo, setSaldo] = useState("");
  const [transacoes, setTransacoes] = useState([]); // Atualizado para uma lista unificada de transações
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  let [fontsLoaded] = useFonts({
    SuezOne_400Regular,
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Recolhendo o ID usuário do AsyncStorage
        const id = await AsyncStorage.getItem("userId");
        // Chamada para obter resumo financeiro
        const financeiroResponse = await sheets.resumoFinanceiro(id);
        const financeiroData = financeiroResponse.data;
        //Chamada para obter renda total
        const rendaTotalResponse = await sheets.obterRendaTotal(id)
        const rendaTotalData = rendaTotalResponse.data;

        setRendaTotal(
          rendaTotalData.renda_total
            ? rendaTotalData.renda_total.toString()
            : ""
        );
        setGastoMensal(
          financeiroData.gastos ? financeiroData.gastos.toString() : "0"
        );
        setGanhoMensal(
          financeiroData.ganhos ? financeiroData.ganhos.toString() : "0"
        );
        setSaldo(financeiroData.saldo ? financeiroData.saldo.toString() : "Você ainda não realizou uma transação esse mês");
      } catch (error) {
        console.error("Erro ao buscar os dados financeiros:", error);
      }

      try {
        // Recolhendo o ID usuário do AsyncStorage
        const id = await AsyncStorage.getItem("userId");
        // Chamada para obter transações
        const transacoesResponse = await sheets.transacoes(id);
        const transacoesData = transacoesResponse.data;

        // Verifica se transacoesData.transacoes é um array
        setTransacoes(
          Array.isArray(transacoesData.transacoes)
            ? transacoesData.transacoes
            : []
        ); // Armazenando todas as transações em uma lista unificada
      } catch (error) {
        console.error("Erro ao buscar as transações:", error);
        setTransacoes([]); // Garantir que o estado transacoes seja um array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  const handleEditFinanca = (idFinanca) => {
    navigation.navigate("EditarFinanca", { id: idFinanca });
  };

  const handleDeleteFinanca = async (idFinanca) => {
    Alert.alert(
      "Deletar Finança",
      "Tem certeza que deseja deletar essa finança?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              await sheets.deletarFinanca(idFinanca);
              Alert.alert("Sucesso", "Finança deletada com sucesso.");
              // Atualiza a lista após deletar
              setTransacoes((prev) =>
                prev.filter((transacao) => transacao.id_financa !== idFinanca)
              );
            } catch (error) {
              console.error("Erro ao deletar finança:", error);
              Alert.alert("Erro", "Ocorreu um erro ao deletar a finança.");
            }
          },
        },
      ]
    );
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const AnimatableTouchableOpacity =
    Animatable.createAnimatableComponent(TouchableOpacity);
  const AnimatableText = Animatable.createAnimatableComponent(Text);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <AnimatableTouchableOpacity
          onPress={() => navigation.goBack()}
          animation="fadeInLeft"
        >
          {/* Ícone de voltar pode ser adicionado aqui, se necessário */}
        </AnimatableTouchableOpacity>
        <AnimatableText style={styles.title} animation="fadeInDown">
          Controle Financeiro
        </AnimatableText>
      </View>

      <View style={[styles.containerForm, {marginTop: 0}]}>
        <Text style={styles.label}>Renda Total:</Text>
        <TextInput
          style={styles.input}
          value={rendaTotal}
          placeholder="Você ainda não realizou uma transação"
          editable={false}
        />

        <Text style={[styles.title, {marginTop: "8%"}]}>Gasto e Ganho Mensal</Text>

        <Text style={styles.label}>Gasto:</Text>
        <TextInput
          style={styles.input}
          value={gastoMensal}
          placeholder="Você ainda não realizou uma transação esse mês"
          editable={false}
        />

        <Text style={styles.label}>Ganho:</Text>
        <TextInput
          style={styles.input}
          value={ganhoMensal}
          placeholder="Você ainda não realizou uma transação esse mês"
          editable={false}
        />

        <Text style={styles.label}>Saldo:</Text>
        <TextInput
          style={styles.input}
          value={saldo}
          placeholder="Você ainda não realizou uma transação esse mês"
          editable={false}
        />

        {/* Transações Unificadas */}
        <Text style={styles.label}>Transações:</Text>
        <View style={styles.listContainer}>
          {transacoes.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma transação.</Text>
          ) : (
            transacoes.map((transacao) => (
              <View key={transacao.id_financa} style={styles.transacaoItem}>
                <Text style={styles.transacaoText}>{transacao.titulo}</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditFinanca(transacao.id_financa)}
                  >
                    <Icon name="edit" size={25} color="#255573" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteFinanca(transacao.id_financa)}
                  >
                    <Icon name="trash" size={25} color="#EC4E4E" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E2EDF2",
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: "top",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: "SuezOne_400Regular",
    color: "#255573",
    textAlign: "center",
  },
  containerForm: {
    width: "100%",
  },
  label: {
    fontSize: 20,
    color: "#255573",
    marginBottom: 5,
    marginTop: 15,
    fontFamily: "SuezOne_400Regular",
  },
  input: {
    backgroundColor: "#C6DBE4",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    color: "#000",
  },
  listContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#C6DBE4",
  },
  emptyText: {
    textAlign: "center",
    color: "#A9A9A9",
  },
  transacaoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  transacaoText: {
    fontSize: 16,
    color: "#000",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginHorizontal: 5,
  },
});
