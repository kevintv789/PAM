import { BottomTabNavigator } from './BottomTabNavigator';
import { Image } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import React from "react";
import SignUpScreen from "../screens/SignUpScreen";
import Welcome from "../screens/WelcomeScreen";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { theme } from "../shared/constants";

const screens = createStackNavigator(
  {
    Welcome,
    LoginScreen,
    SignUpScreen,
    HomeScreen: {
      screen: BottomTabNavigator,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        shadowColor: "transparent",
        backgroundColor: theme.colors.accent,
        elevation: 0, // for android
        height: theme.sizes.base * 7,
      },
      headerTransparent: true,
      headerBackImage: () => (
        <Image
          source={require("../assets/icons/left_arrow.png")}
          style={{ width: 35, height: 35 }}
        />
      ),
      headerBackTitleVisible: false,
      headerTitle: "",
      headerLeftContainerStyle: {
        alignItems: "center",
        marginLeft: theme.sizes.padding * 1.5,
        marginTop: theme.sizes.padding * 2,
      },
      headerRightContainerStyle: {
        alignItems: "center",
      },
    },
  }
);

export default createAppContainer(screens);
