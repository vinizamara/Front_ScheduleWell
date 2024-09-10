import { createStackNavigator } from "@react-navigation/stack";

import Login from "../pages/login";
import PageInit from "../pages/pageInit";
import headerAnimation from "../components/headerAnimation";
import Cadastro from "../pages/cadastro"
import Agendas from "../pages/agendas"

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
    </Stack.Navigator>
  );
}
