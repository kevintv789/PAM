import { StyleSheet, View } from "react-native";

import React from "react";
import _Text from "./Text";
import { theme } from "../../shared";

const Text: any = _Text;

export default function DataOutline(props: any) {
  const { style, circle, color, square, text, caption } = props;

  const containerStyle = [
    styles.container,
    circle && styles.circle,
    square && styles.square,
    color && styles[color],
    style,
  ];

  return (
    <View style={containerStyle}>
      <Text color={color} bold center style={{ marginBottom: 13 }}>
        {text}
      </Text>
      <Text center>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    width: 90,
    height: 90,
    alignItems: "center",
    marginVertical: 10,
  },
  circle: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 100,
    borderColor: theme.colors.secondary,
  },
  square: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.colors.secondary,
  },
  accent: { borderColor: theme.colors.accent },
  primary: { borderColor: theme.colors.primary },
  secondary: { borderColor: theme.colors.secondary },
  tertiary: { borderColor: theme.colors.tertiary },
  black: { borderColor: theme.colors.black },
  white: { borderColor: theme.colors.white },
  gray: { borderColor: theme.colors.gray },
  gray2: { borderColor: theme.colors.gray2 },
  offWhite: { borderColor: theme.colors.offWhite },
});
