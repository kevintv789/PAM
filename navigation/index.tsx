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
        shadowColor: "transparent",
        backgroundColor: theme.colors.accent
      },
      headerTransparent: true,
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
