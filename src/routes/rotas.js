import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

// Importe o BottomTabs e outras páginas
import BottomTabs from "../components/BottomTabs";
import Login from "../pages/login";
import PageInit from "../pages/pageInit";
import Cadastro from "../pages/cadastro";
import Agendas from "../pages/agendas";
import Escolhanotas from "../pages/escolhanotas";
import Checklist from "../pages/listagem";
import EditarFinanca from "../pages/editarFinanca";
import EditarAnotacao from "../pages/editarAnotacao";
import EditarChecklist from "../pages/editarChecklist";
import Financas from "../pages/financas";
import Anotacoes from "../pages/anotacoes";

const Stack = createStackNavigator();

export default function Rotas() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PageInit"
        component={PageInit}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Financas"
        component={Financas}
        options={{ headerShown: false }}
      />
            <Stack.Screen
        name="Anotacoes"
        component={Anotacoes}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Agendas"
        component={Agendas}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Escolhanotas"
        component={Escolhanotas}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Checklist"
        component={Checklist}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditarFinanca"
        component={EditarFinanca}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditarAnotacao"
        component={EditarAnotacao}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditarChecklist"
        component={EditarChecklist}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
