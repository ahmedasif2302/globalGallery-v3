import React, { useState, useEffect } from "react";
// NAVIGATION
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// NON DISPLAY SCREENS
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";

// VISIBLE SCREENS STACK
import Tabs from "./navigation/tabs";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignIn"
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen
          name="SignUp"
          component={SignUp}
          options={{ title: "SIGN UP TO CONTINUE" }}
        />
        <Tab.Screen
          name="SignIn"
          component={SignIn}
          options={{ title: "SIGN IN" }}
        />
        <Tab.Screen name="bottomTab" component={Tabs} />
        {/* <Tabs /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
