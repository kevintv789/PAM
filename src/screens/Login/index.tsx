import { Button, Container, Text, TextInput } from "../../components";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { Component } from "react";
import { mockData, theme } from "../../shared";

import { LoginModel } from "../../models";
import { validateEmail } from "../../shared/Utils";

const { width } = Dimensions.get("window");

export default class LoginScreen extends Component<
  LoginModel.Props,
  LoginModel.State
> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: mockData.VALID_EMAIL,
      password: mockData.VALID_PASSWORD,
      errors: [],
    };
  }

  handleSignIn = () => {
    const { email, password } = this.state;
    const { navigation } = this.props;

    const errors = [];

    if (!validateEmail(email) || email !== mockData.VALID_EMAIL) {
      errors.push("email");
    }

    if (password !== mockData.VALID_PASSWORD) {
      errors.push("password");
    }

    if (!errors.length) {
      navigation.navigate("HomeScreen");
    } else {
      // TODO: Add warning pop up or something to give notice to user that there are errors
    }

    this.setState({ email, errors });
  };

  render() {
    const { email, password, errors } = this.state;
    const hasErrors = (key: string) =>
      errors.includes(key) ? styles.hasErrors : null;

    return (
      <TouchableWithoutFeedback onPressIn={Keyboard.dismiss} accessible={false}>
        <Container color="accent" center>
          <Text center style={styles.welcomeBackText} tertiary size={44}>
            Welcome back
          </Text>
          <KeyboardAvoidingView behavior="padding" style={styles.mainContainer}>
            <Container margin={[theme.sizes.padding * 1.6]}>
              <TextInput
                label="Email"
                keyboardType="email-address"
                error={hasErrors("email")}
                style={[styles.input, hasErrors("email")]}
                value={email}
                onChangeText={(email: string) => this.setState({ email })}
              />
              <TextInput
                secure
                label="Password"
                error={hasErrors("password")}
                style={[styles.input, hasErrors("password")]}
                value={password}
                onChangeText={(password: string) => this.setState({ password })}
              />
            </Container>
          </KeyboardAvoidingView>

          <Container flex={1.4}>
            <Button onPress={() => this.handleSignIn()}>
              <Text center offWhite size={theme.fontSizes.medium}>
                Log In
              </Text>
            </Button>

            <TouchableOpacity>
              <Text
                center
                offWhite
                style={styles.forgotPassword}
                onPress={() => {}}
              >
                Forgot your password?
              </Text>
            </TouchableOpacity>
          </Container>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
  },
  welcomeBackText: {
    marginTop: theme.sizes.padding * 7,
  },
  input: {
    width: width * 0.75,
  },
  forgotPassword: {
    marginTop: theme.sizes.base,
    textDecorationLine: "underline",
  },
  hasErrors: {
    borderBottomColor: theme.colors.red,
  },
});
