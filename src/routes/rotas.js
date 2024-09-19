import { createStackNavigator } from "@react-navigation/stack";

import Login from "../pages/login";
import PageInit from "../pages/pageInit";
import headerAnimation from "../components/headerAnimation";
import Cadastro from "../pages/cadastro";
import Agendas from "../pages/agendas";
import Escolhanotas from "../pages/escolhanotas";
import Checklist from "../pages/listagem";
import Anotacoes from "../pages/anotacoes";
import Controlefinanceiro from "../pages/controlefinanceiro";
import Financas from "../pages/financas";
import Paginadeperfil from "../pages/paginadeperfil";

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
        name="Components"
        component={headerAnimation}
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
        name="Anotacoes"
        component={Anotacoes}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Controlefinanceiro"
        component={Controlefinanceiro}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Financas"
        component={Financas}
        options={{ headerShown: false }}
      />

<Stack.Screen
        name="Paginadeperfil"
        component={Paginadeperfil}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
}
