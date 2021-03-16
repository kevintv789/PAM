import {
  CardStyleInterpolators,
  createStackNavigator,
} from "react-navigation-stack";

import AddExpenseComponent from "components/Modals/AddExpense/addExpense.component";
import { BottomTabNavigator } from "./BottomTabNavigator";
import { Image } from "react-native";
import LoginScreen from "screens/Login";
import React from "react";
import RecurringPaymentComponent from "components/Modals/RecurringPayment/recurringPayment.component";
import SignUpScreen from "screens/SignUp";
import Welcome from "screens/Welcome";
import { createAppContainer } from "react-navigation";
import { theme } from "shared";

const MainStack = createStackNavigator(
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

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
      navigationOptions: {
        headerShown: false,
      },
    },
    AddExpenseModal: {
      screen: AddExpenseComponent,
      navigationOptions: {
        cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        cardStyle: {
          backgroundColor: "transparent",
        },
        gestureEnabled: true,
        cardOverlayEnabled: true,
        headerShown: false,
      },
    },
    RecurringPaymentModal: {
      screen: RecurringPaymentComponent,
      navigationOptions: {
        cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        cardStyle: {
          backgroundColor: "transparent",
        },
        gestureEnabled: true,
        cardOverlayEnabled: true,
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: "Main",
    mode: "modal",
  }
);

export default createAppContainer(RootStack);
