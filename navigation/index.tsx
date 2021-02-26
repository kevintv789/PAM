import { Image } from "react-native";
import React from "react";
import Welcome from "../screens/WelcomeScreen";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { theme } from '../shared/constants';

const screens = createStackNavigator(
  {
    Welcome,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: theme.colors.accent,
        shadowColor: "transparent",
      },
      headerBackImage: () => (
        <Image source={require("../assets/icons/left_arrow.png")} />
      ),
      headerBackTitleVisible: false,
      headerTitle: "",
      headerLeftContainerStyle: {
        alignItems: "center",
      },
      headerRightContainerStyle: {
        alignItems: "center",
      },
    },
  }
);

export default createAppContainer(screens);
