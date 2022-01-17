// NAVIGATION
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// SCREENS
import Home from "../screens/Home";
import Post from "../screens/Post";
import View from "../screens/ViewPost";
import Profile from "../screens/Profile";

// ICON
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarItemStyle: {
          alignSelf: "center",
          justifyContent: "center",
        },
        tabBarShowLabel: false,
      }}
      initialRouteName="SignIn"
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home-outline"
              size={27}
              color={focused ? "dodgerblue" : "#9834eb"}
            />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="View"
        component={View}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="eye-outline"
              size={27}
              color={focused ? "dodgerblue" : "#9834eb"}
            />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Post"
        component={Post}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="add-circle-outline"
              size={27}
              color={focused ? "dodgerblue" : "#9834eb"}
            />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-outline"
              size={27}
              color={focused ? "dodgerblue" : "#9834eb"}
            />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
