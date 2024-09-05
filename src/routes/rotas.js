import { createStackNavigator } from "@react-navigation/stack";

import Login from "../pages/login";
import PageInit from "../pages/pageInit";
import Components from "../components/animatable"

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
        component={Components}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
