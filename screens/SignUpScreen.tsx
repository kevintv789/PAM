import { Button, Container, Text, TextInput } from "../components";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import React, { Component } from "react";
import { formatMobileNumber, validateEmail } from "../shared/Utils";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SignUpModel } from "../models";
import { theme } from "../shared";

const { width, height } = Dimensions.get("window");

export default class SignUpScreen extends Component<
  SignUpModel.Props,
  SignUpModel.State
> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
      password: "",
      phone: "",
      firstName: "",
      errors: [],
    };
  }

  handleSignIn = () => {
    const { email, password, phone, firstName } = this.state;
    const { navigation } = this.props;

    const errors = [];

    if (!validateEmail(email)) {
      errors.push("email");
    }

    if (!password.length) {
      errors.push("password");
    }

    if (!phone.length) {
      errors.push("phone");
    }

    if (!firstName.length) {
      errors.push("firstName");
    }

    if (!errors.length) {
      navigation.navigate("HomeScreen");
    } else {
      // TODO: Add warning pop up or something to give notice to user that there are errors
    }

    this.setState({ email, password, phone, firstName, errors });
  };

  render() {
    const { email, password, errors, phone, firstName } = this.state;
    const hasErrors = (key: string) =>
      errors.includes(key) ? styles.hasErrors : null;

    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.mainContainer}
        scrollEnabled={false}
        style={{ height }}
        automaticallyAdjustContentInsets={false}
      >
        <TouchableWithoutFeedback
          onPressIn={Keyboard.dismiss}
          accessible={false}
        >
          <Container color="accent" center>
            <Text center style={styles.welcomeBackText} tertiary size={44}>
              Sign Up
            </Text>
            <Container margin={[theme.sizes.padding * 1.6]}>
              <TextInput
                label="First Name"
                error={hasErrors("firstName")}
                style={[styles.input, hasErrors("firstName")]}
                value={firstName}
                onChangeText={(firstName: string) =>
                  this.setState({
                    firstName,
                    errors: errors.filter((e) => e !== "firstName"),
                  })
                }
              />
              <TextInput
                label="Email"
                keyboardType="email-address"
                error={hasErrors("email")}
                style={[styles.input, hasErrors("email")]}
                value={email}
                onChangeText={(email: string) =>
                  this.setState({
                    email,
                    errors: errors.filter((e) => e !== "email"),
                  })
                }
              />
              <TextInput
                label="Phone"
                keyboardType="phone-pad"
                error={hasErrors("phone")}
                style={[styles.input, hasErrors("phone")]}
                value={phone}
                onChangeText={(phone: string) =>
                  this.setState<never>((prevState) => ({
                    phone: formatMobileNumber(phone, prevState.phone),
                    errors: errors.filter((e) => e !== "phone"),
                  }))
                }
              />
              <TextInput
                secure
                label="Password"
                error={hasErrors("password")}
                style={[styles.input, hasErrors("password")]}
                value={password}
                onChangeText={(password: string) =>
                  this.setState({
                    password,
                    errors: errors.filter((e) => e !== "password"),
                  })
                }
              />
            </Container>

            <Container flex={1} paddingBottom={theme.sizes.base * 10}>
              <Button onPress={() => this.handleSignIn()}>
                <Text center offWhite size={theme.fontSizes.medium}>
                  Get Started
                </Text>
              </Button>
            </Container>
          </Container>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
  },
  welcomeBackText: {
    marginTop: theme.sizes.padding * 7,
  },
  input: {
    width: width * 0.75,
  },
  hasErrors: {
    borderBottomColor: theme.colors.red,
  },
});
