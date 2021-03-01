import * as Icon from "@expo/vector-icons";

import { Animated, StyleSheet, TextInput } from "react-native";
import React, { Component } from "react";
import { TextInputProps, TextInputState } from "../../types";

import _Button from "./Button";
import _Container from "./Container";
import _Text from "./Text";
import { theme } from "../../shared/constants";

const Button: any = _Button;
const Container: any = _Container;
const Text: any = _Text;

export default class Input extends Component<TextInputProps, TextInputState> {
  animatedIsFocused: Animated.Value;

  constructor(props: TextInputProps) {
    super(props);

    this.state = {
      toggleSecure: false,
      isFocused: false,
    };

    this.animatedIsFocused = new Animated.Value(
      this.props.value === "" ? 0 : 1
    );
  }

  componentDidUpdate() {
    Animated.timing(this.animatedIsFocused, {
      toValue:
        this.state.isFocused ||
        (this.props.value !== "" && this.props.value !== undefined)
          ? 1
          : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  renderLabel = () => {
    const { label, error, required } = this.props;

    const labelStyle = {
      position: "absolute",
      left: 0,
      top: this.animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this.animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.fontSizes.medium, theme.fontSizes.regular],
      }),
      color: this.animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [
          error ? theme.colors.red : theme.colors.gray,
          error ? theme.colors.red : theme.colors.tertiary,
        ],
      }),
    };

    return (
      <Container flex={false}>
        {label ? (
          <Animated.Text style={labelStyle}>
            <Animated.Text>{label} </Animated.Text>
            {required && (
              <Animated.Text style={styles.required}>*</Animated.Text>
            )}
          </Animated.Text>
        ) : null}
      </Container>
    );
  };

  renderToggle = () => {
    const { secure, rightLabel } = this.props;
    const { toggleSecure } = this.state;

    if (!secure) return null;

    return (
      <Button
        style={styles.toggle}
        onPress={() => this.setState({ toggleSecure: !toggleSecure })}
      >
        {rightLabel ? (
          rightLabel
        ) : (
          <Icon.Ionicons
            color={theme.colors.offWhite}
            size={theme.fontSizes.big}
            name={!toggleSecure ? "md-eye" : "md-eye-off"}
          />
        )}
      </Button>
    );
  };

  renderRight = () => {
    const { rightLabel, rightStyle, onRightPress } = this.props;

    if (!rightLabel) return null;

    return (
      <Button
        style={[styles.toggle, rightStyle]}
        onPress={() => onRightPress && onRightPress()}
      >
        {rightLabel}
      </Button>
    );
  };

  render() {
    const { email, phone, number, secure, error, style, ...props } = this.props;

    const { toggleSecure } = this.state;
    const isSecure = toggleSecure ? false : secure;

    const inputStyles = [
      styles.input,
      error && { borderColor: theme.colors.accent },
      style,
    ];

    const inputType = email
      ? "email-address"
      : number
      ? "numeric"
      : phone
      ? "phone-pad"
      : "default";

    return (
      <Container flex={false} margin={[theme.sizes.base / 2, 0]}>
        {this.renderLabel()}
        <TextInput
          style={inputStyles}
          secureTextEntry={isSecure}
          autoCompleteType="off"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={inputType}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          {...props}
        />

        {this.renderToggle()}
        {this.renderRight()}
      </Container>
    );
  }
}

export const styles = StyleSheet.create({
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.offWhite,
    fontSize: theme.fontSizes.regular,
    fontWeight: "500",
    color: theme.colors.offWhite,
    height: theme.sizes.base * 3,
    marginTop: theme.sizes.base * 0.5,
  },
  toggle: {
    position: "absolute",
    alignItems: "flex-end",
    width: theme.sizes.base * 2,
    height: theme.sizes.base * 2,
    top: theme.sizes.base * 0.4,
    right: 0,
    backgroundColor: "transparent",
    color: theme.colors.offWhite,
  },
  required: {
    fontWeight: "200",
    fontSize: 20,
  },
});