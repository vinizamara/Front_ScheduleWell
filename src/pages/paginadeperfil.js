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
  const [userDefault, setUserDefault] = useState({
    nome: "",
    email: "",
    senha: "",
  });
  const [user, setUser] = useState(userDefault);
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  let [fontsLoaded] = useFonts({
    SuezOne_400Regular,
  });

  async function loadUserData() {
    await SplashScreen.preventAutoHideAsync();
    const userName = await AsyncStorage.getItem("userName");
    const userEmail = await AsyncStorage.getItem("userEmail");
    if (userName && userEmail) setUser({ nome: userName, email: userEmail });
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

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
    if (user.senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;  // Interrompe a execução para evitar salvar os dados
    } else {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const response = await sheets.updateUser(userId, user);
        Alert.alert("Sucesso", response.data.message);

        await AsyncStorage.setItem("userName", user.nome);
        await AsyncStorage.setItem("userEmail", user.email);

        setModalVisible(false);
        setConfirmarSenha("");
      } catch (error) {
        console.log(error.response);
        if (error.response && error.response.data && error.response.data.error) {
          Alert.alert("Erro", error.response.data.error);
        } else {
          Alert.alert("Erro", "Ocorreu um erro ao atualizar o perfil.");
        }
      }
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userLoggedIn");
    await AsyncStorage.removeItem("userName");
    await AsyncStorage.removeItem("userEmail");
    await AsyncStorage.removeItem("userId");
    navigation.navigate("PageInit");
    console.log("Saiu do login");
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
      try {
        const userId = await AsyncStorage.getItem("userId");
        const response = await sheets.deleteUser(userId);
        await AsyncStorage.clear();
        navigation.navigate("PageInit");
        Alert.alert("Sucesso", response.data.message);
      } catch (error) {
        Alert.alert("Erro", error.response.data.error);
      }
    }
  };

  const AnimatableTouchableOpacity =
    Animatable.createAnimatableComponent(TouchableOpacity);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/icons/perfil.png")}
          style={styles.profileImage}
        />

        <Animatable.Text animation="fadeInDown" style={styles.title}>
          Olá, {user.nome || "Nome do Usuário"}
        </Animatable.Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            animation="bounceIn"
            style={styles.button}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          animation="fadeInUp"
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.buttonText}>Deletar Conta</Text>
        </TouchableOpacity>
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
                  name="nome"
                  value={user.nome}
                  onChangeText={(text) => setUser({ ...user, nome: text })}
                  placeholder="Insira seu nome"
                />
              </View>

              <Text style={styles.title}>E-mail</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputWithoutBorder}
                  name="email"
                  value={user.email}
                  onChangeText={(text) => setUser({ ...user, email: text })}
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
                  name="senha"
                  value={user.senha}
                  onChangeText={(text) => setUser({ ...user, senha: text })}
                />
                {user.senha && user.senha.length > 0 && (
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={styles.eyeIcon}
                  >
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
                  <TouchableOpacity
                    onPress={toggleConfirmPasswordVisibility}
                    style={styles.eyeIcon}
                  >
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
                  onPress={() => {
                    setModalVisible(false);
                    loadUserData();
                  }}
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
    fontSize: 24,
    fontFamily: "SuezOne_400Regular",
    color: "#333",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "SuezOne_400Regular",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputWithoutBorder: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
