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
  const [despesaMensal, setDespesaMensal] = useState("");
  const [receitaMensal, setReceitaMensal] = useState("");
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
        // Chamada para obter renda total
        const rendaTotalResponse = await sheets.obterRendaTotal(id);
        const rendaTotalData = rendaTotalResponse.data;

        setRendaTotal(
          rendaTotalData.renda_total
            ? rendaTotalData.renda_total.toString()
            : ""
        );
        setDespesaMensal(
          financeiroData.despesas ? financeiroData.despesas.toString() : "0"
        );
        setReceitaMensal(
          financeiroData.receitas ? financeiroData.receitas.toString() : "0"
        );
        setSaldo(financeiroData.saldo ? financeiroData.saldo.toString() : "0");
      } catch (error) {
        console.log(
          "Erro ao buscar os dados financeiros:",
          error.response.data.error
        );
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
        console.log("Erro ao buscar as transações:", error.response.data.error);
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

      <View style={[styles.containerForm, { marginTop: 0 }]}>
        <Text style={styles.label}>Renda Total:</Text>
        <TextInput
          style={styles.input}
          value={rendaTotal}
          placeholder="0"
          editable={false}
        />

        <Text style={[styles.title, { marginTop: "8%" }]}>
          Despesa e Receita Mensal
        </Text>

        <Text style={styles.label}>Despesa:</Text>
        <TextInput
          style={styles.input}
          value={despesaMensal}
          placeholder="0"
          editable={false}
        />

        <Text style={styles.label}>Receita:</Text>
        <TextInput
          style={styles.input}
          value={receitaMensal}
          placeholder="0"
          editable={false}
        />

        <Text style={styles.label}>Saldo:</Text>
        <TextInput
          style={styles.input}
          value={saldo}
          placeholder="0"
          editable={false}
        />

        {/* Transações Unificadas */}
        <Text style={styles.label}>Transações:</Text>
        <View style={styles.listContainer}>
          {transacoes.length === 0 ? (
            <View>
              <View style={styles.transacaoItem}>
                <Text style={styles.transacaoTextCabecalho}>Título</Text>
                <Text style={styles.transacaoTextCabecalho}>
                  Tipo de Transação
                </Text>
                <Text style={styles.transacaoTextCabecalho}>Valor</Text>
                <Text style={styles.transacaoTextCabecalho}>Frequência</Text>
              </View>
              <Text style={[styles.emptyText, { marginTop: 20 }]}>
                Nenhuma transação.
              </Text>
            </View>
          ) : (
            <View>
              <View style={styles.transacaoItem}>
                <Text style={styles.transacaoTextCabecalho}>Título</Text>
                <Text style={styles.transacaoTextCabecalho}>
                  Tipo de Transação
                </Text>
                <Text style={styles.transacaoTextCabecalho}>Valor</Text>
                <Text style={styles.transacaoTextCabecalho}>Frequência</Text>
              </View>
              {transacoes.map((transacao, index) => (
                <View
                  key={transacao.id_financa}
                  style={[
                    styles.transacaoItem,
                    index % 2 === 0 ? styles.evenRow : styles.oddRow,
                  ]}
                >
                  <Text style={styles.transacaoText}>{transacao.titulo}</Text>
                  <Text
                    style={[
                      styles.transacaoText,
                      transacao.tipo_transacao === "Receita"
                        ? styles.receitaText
                        : styles.despesaText,
                    ]}
                  >
                    {transacao.tipo_transacao}
                  </Text>
                  <Text style={styles.transacaoText}>{transacao.valor}</Text>
                  <Text style={styles.transacaoText}>
                    {transacao.frequencia}
                  </Text>
                </View>
              ))}
            </View>
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
  transacaoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#C6DBE4",
  },
  transacaoTextCabecalho: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 15,
    color: "#255573",
    width: "25%",
    alignSelf: "center",
    textAlign: "center",
  },
  transacaoText: {
    flex: 1,
    fontSize: 15,
    width: "20%",
    alignSelf: "center",
    textAlign: "center",
  },
  receitaText: {
    color: "#00C288",
  },
  despesaText: {
    color: "#EC4E4E",
  },
  evenRow: {
    backgroundColor: "#D7E5EC",
  },
  oddRow: {
    backgroundColor: "#C6DBE4",
  },
  emptyText: {
    fontSize: 16,
    color: "#255573",
    textAlign: "center",
  },
});
