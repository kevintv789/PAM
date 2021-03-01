import { Entypo, Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";

import CalendarScreen from "../screens/CalendarScreen";
import HomeScreen from "../screens/HomeScreen";
import React from "react";
import ReportsScreen from "../screens/ReportsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { theme } from "../shared/constants";

export const BottomTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
            <Ionicons name="home-outline" size={theme.sizes.icon} color={tintColor} />
        ),
      },
    },
    Reports: {
      screen: ReportsScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Entypo name="line-graph" size={theme.sizes.icon} color={tintColor} />
        ),
      },
    },
    Calendar: {
      screen: CalendarScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name="calendar-alt" size={theme.sizes.icon} color={tintColor} />
        ),
      },
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Feather name="menu" size={theme.sizes.icon} color={tintColor} />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
      tabStyle: {
        backgroundColor: theme.colors.offWhite,
        height: theme.sizes.base * 5,
        paddingBottom: theme.sizes.padding,
      },
      activeTintColor: theme.colors.secondary,
      inactiveTintColor: theme.colors.gray
    },
  }
);
