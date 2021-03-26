import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import React, { Component } from "react";

import { ButtonProps } from "../../../types";
import { theme } from "shared";

const { width } = Dimensions.get("window");

class Button extends Component<ButtonProps> {
  static defaultProps: { locations: number[]; opacity: number; color: string };

  render() {
    const {
      style,
      opacity,
      color,
      end,
      start,
      locations,
      shadow,
      children,
      flat = false,
      ...props
    } = this.props;

    const buttonStyles = [
      styles.button,
      shadow && styles.shadow,
      color && styles[color], // predefined styles colors for backgroundColor
      color && !styles[color] && { backgroundColor: color }, // custom backgroundColor
      style,
    ];

    if (!flat) {
      buttonStyles.push(theme.sharedStyles.shadowEffect);
    }

    return (
      <TouchableOpacity
        style={buttonStyles}
        activeOpacity={opacity || 0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }
}

Button.defaultProps = {
  locations: [0.1, 0.9],
  opacity: 0.8,
  color: theme.colors.primary,
};

export const styles = StyleSheet.create({
  button: {
    borderRadius: theme.sizes.radius,
    height: theme.sizes.base * 3,
    justifyContent: "center",
    marginVertical: theme.sizes.padding / 3,
    width: width * 0.75,
  },
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  accent: { backgroundColor: theme.colors.accent },
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: theme.colors.secondary },
  tertiary: { backgroundColor: theme.colors.tertiary },
  black: { backgroundColor: theme.colors.black },
  white: { backgroundColor: theme.colors.white },
  gray: { backgroundColor: theme.colors.gray },
  gray2: { backgroundColor: theme.colors.gray2 },
  offWhite: { backgroundColor: theme.colors.offWhite },
});

export default Button;
