import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  TextInput,
} from "react-native";
import { useFonts, SuezOne_400Regular } from "@expo-google-fonts/suez-one";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome"; // Ícones do FontAwesome

export default function Escolhanotas() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  //função de pesquisa
  const handleSearch = () => {
    console.log("Pesquisar");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.plusIconContainer}
        onPress={() => navigation.navigate("Escolhanotas")}
      >
        <Icon name="plus" size={30} color="#1F74A7" />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Pesquisar..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.iconContainer} onPress={handleSearch}>
            <Icon name="search" size={20} color="#1F74A7" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          animation="fadeInLeft"
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.notesText}>Suas Anotações</Text>
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
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: "70%",
  },
  searchBar: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 40,
    width: "100%",
    backgroundColor: "#C6DBE4",
    borderWidth: 0,
  },
  iconContainer: {
    position: "absolute",
    left: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    height: 40,
    backgroundColor: "#1F74A7",
    paddingVertical: 3,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "SuezOne_400Regular",
  },
  plusIconContainer: {
    position: "absolute",
    top: "15%",
    right: "5%",
    zIndex: 1,
  },
  notesText: {
    fontSize: 24,
    color: "#255573",
    fontFamily: "SuezOne_400Regular",
    textAlign: "center",
    marginTop: "5%",
  },
});
