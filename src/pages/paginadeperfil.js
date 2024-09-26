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
import { Ionicons } from "@expo/vector-icons";
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
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleSave = async () => {
    if (!nome || !email || !novaSenha || !confirmarSenha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (novaSenha && novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      const updateData = { nome, email };
      if (novaSenha) {
        updateData.senha = novaSenha;
      }
      await sheets.updateUser(userId, updateData);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      setModalVisible(false);
      setNovaSenha("");
      setConfirmarSenha("");
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
            <ScrollView>
              <Text style={styles.modalTitle}>Editar Perfil</Text>

              <Text style={styles.title}>Nome</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputWithoutBorder}
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Insira seu nome"
                />
              </View>

              <Text style={styles.title}>E-mail</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputWithoutBorder}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Insira seu e-mail"
                  keyboardType="email-address"
                />
              </View>

              <Text style={styles.title}>Nova Senha</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Insira sua nova senha"
                  style={styles.inputWithoutBorder}
                  secureTextEntry={!isPasswordVisible}
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                />
                {novaSenha.length > 0 && (
                  <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                    <Ionicons
                      name={isPasswordVisible ? "eye-off" : "eye"}
                      size={24}
                      color="#555"
                    />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.title}>Confirmar Senha</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Confirme sua nova senha"
                  style={styles.inputWithoutBorder}
                  secureTextEntry={!isConfirmPasswordVisible}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                />
                {confirmarSenha.length > 0 && (
                  <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                    <Ionicons
                      name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                      size={24}
                      color="#555"
                    />
                  </TouchableOpacity>
                )}
              </View>

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
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2EDF2",
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontFamily: "SuezOne_400Regular",
    fontSize: 20,
    color: "#255573",
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#1F74A7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 5,
    width: "40%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "SuezOne_400Regular",
    textAlign: "center",
  },
  deleteButton: {
    marginTop: 20,
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2EDF2",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "SuezOne_400Regular",
    fontSize: 24,
    color: "#255573",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    marginBottom: 12,
    width: "100%",
  },
  inputWithoutBorder: {
    fontFamily: "SuezOne_400Regular",
    height: 40,
    fontSize: 16,
    paddingHorizontal: 8,
    flex: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#1F74A7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    flex: 1,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "SuezOne_400Regular",
    textAlign: "center",
  },
});
