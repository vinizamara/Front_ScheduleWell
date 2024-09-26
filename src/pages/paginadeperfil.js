import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sheets from "../axios/axios"; // Ajuste o caminho conforme necessário

export default function PerfilUsuario() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  let [fontsLoaded] = useFonts({
    SuezOne_400Regular,
  });

  useEffect(() => {
    async function loadUserData() {
      await SplashScreen.preventAutoHideAsync();
      const userName = await AsyncStorage.getItem("userName");
      const userEmail = await AsyncStorage.getItem("userEmail");
      if (userName) setNome(userName);
      if (userEmail) setEmail(userEmail);
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    loadUserData();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const handleSave = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      await sheets.updateUser(userId, { nome, email });
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      setModalVisible(false);
    } else {
      Alert.alert("Erro", "ID do usuário não encontrado.");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userName");
    await AsyncStorage.removeItem("userEmail");
    navigation.navigate("PageInit");
  };

  const handleDeleteAccount = async () => {
    const confirm = await new Promise((resolve) => {
      Alert.alert(
        "Confirmar Exclusão",
        "Tem certeza de que deseja deletar sua conta?",
        [
          { text: "Cancelar", onPress: () => resolve(false), style: "cancel" },
          { text: "Deletar", onPress: () => resolve(true) },
        ]
      );
    });

    if (confirm) {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        await sheets.deleteUser(userId);
        await AsyncStorage.clear();
        navigation.navigate("PageInit");
        Alert.alert("Sucesso", "Conta deletada com sucesso!");
      } else {
        Alert.alert("Erro", "ID do usuário não encontrado.");
      }
    }
  };

  const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={require("../../assets/icons/perfil.png")} style={styles.profileImage} />

        <Animatable.Text animation="fadeInDown" style={styles.title}>
          Olá, {nome || "Nome do Usuário"}
        </Animatable.Text>

        <View style={styles.buttonsContainer}>
          <AnimatableTouchableOpacity
            animation="bounceIn"
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </AnimatableTouchableOpacity>

          <AnimatableTouchableOpacity
            animation="bounceIn"
            style={styles.button}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </AnimatableTouchableOpacity>
        </View>

        <AnimatableTouchableOpacity
          animation="fadeInUp"
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.buttonText}>Deletar Conta</Text>
        </AnimatableTouchableOpacity>
      </View>

      {/* Modal de edição de perfil */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Nome"
            />

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="E-mail"
              keyboardType="email-address"
            />

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#f44336" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    width: "100%",
    alignItems: "center",
  },
  profileImage: {
    width: 120,  // Aumentando o tamanho da imagem
    height: 120,
    borderRadius: 60,  // Mantendo a imagem circular
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "SuezOne_400Regular",
    color: "#255573",
    marginBottom: 50,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1F74A7",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 10,
    elevation: 3, // Efeito de sombra
  },
  buttonText: {
    color: "#fff",
    fontFamily: "SuezOne_400Regular",
    fontSize: 20,
  },
  deleteButton: {
    backgroundColor: "#FF4B4B",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "96%",
    elevation: 3, // Efeito de sombra
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "SuezOne_400Regular",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#1F74A7",
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontFamily: "SuezOne_400Regular",
    fontSize: 16,
  },
});
