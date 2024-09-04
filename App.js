import React from "react";
import { StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import Rotas from "./src/routes/rotas";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#E2EDF2" barStyle="ligth-content" />
      <Rotas />
    </NavigationContainer>
  );
}
