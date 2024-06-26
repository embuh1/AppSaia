// App.js
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./screens/Home";
import Animagine from "./screens/Screen1";

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Animagine" component={Animagine} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
