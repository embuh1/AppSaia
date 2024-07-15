// App.js
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./screens/Home";
import Animagine from "./screens/Screen1";
import Screen2 from "./screens/Screen2";

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Animagine" component={Animagine} />
        <Drawer.Screen name="Ibuki AI" component={Screen2} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
