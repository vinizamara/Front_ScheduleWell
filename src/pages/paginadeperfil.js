import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

export default function PerfilUsuario() {
  const navigation = useNavigation();

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

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }
  const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);
  const AnimatableText = Animatable.createAnimatableComponent(Text);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>

        <AnimatableText animation="fadeInDown" style={styles.title}>
          Nome do Usuário
        </AnimatableText>

        <AnimatableText animation="fadeInUp" style={styles.title}>
          E-mail do Usuário
        </AnimatableText>

        <View style={styles.buttonsContainer}>
          <AnimatableTouchableOpacity
            animation="bounceIn"
            style={styles.button}
            onPress={() => navigation.navigate('EditarPerfil')}
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </AnimatableTouchableOpacity>

          <AnimatableTouchableOpacity
            animation="bounceIn"
            style={styles.button}
            onPress={() => alert('Sair')}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </AnimatableTouchableOpacity>
        </View>

        <AnimatableTouchableOpacity
          animation="fadeInUp"
          style={styles.deleteButton}
          onPress={() => alert('Deletar Conta')}
        >
          <Text style={styles.buttonText}>Deletar Conta</Text>
        </AnimatableTouchableOpacity>
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
      justifyContent: "center",
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
    title: {
      fontSize: 24,
      fontFamily: "SuezOne_400Regular",
      color: "#255573",
      marginBottom: 50,
    },
    subtitle: {
      fontSize: 18,
      color: "#255573",
      textAlign: "center",
      marginBottom: 20,
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 20,
    },
    button: {
      backgroundColor: "#1F74A7",
      padding: 10, 
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      marginHorizontal: 10,
    },
    buttonText: {
      color: "#fff",
      fontFamily: "SuezOne_400Regular",
      fontSize: 16,  
    },
    deleteButton: {
      backgroundColor: "#1F74A7",
      padding: 10,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
  });
  