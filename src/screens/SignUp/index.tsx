import "firebase/firestore";

import { Button, Container, Text, TextInput } from "../../components/common";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import React, { Component } from "react";
import { formatMobileNumber, validateEmail } from "../../shared/Utils";

import AuthService from "services/auth.service";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SignUpModel } from "../../models";
import { USER_DOC } from "shared/constants/databaseConsts";
import { User } from "models/User.model";
import firebase from "firebase";
import { theme } from "../../shared";

const { width, height } = Dimensions.get("window");

export default class SignUpScreen extends Component<
  SignUpModel.Props,
  SignUpModel.State
> {
  private authService = new AuthService();
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
      password: "",
      phone: "",
      name: "",
      errors: [],
    };
  }

  handleSignUp = () => {
    const { email, password, phone, name } = this.state;
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

    if (!name.length) {
      errors.push("name");
    }

    if (!errors.length) {
      const userObj: User = {
        email,
        password,
        phone,
        name,
      };

      this.authService
        .handleSignUpWithEmailAndPassword(userObj, navigation)
        .then(() => {
          firebase
            .firestore()
            .collection(USER_DOC)
            .doc(firebase.auth().currentUser?.uid)
            .set({
              name,
              email,
              phone,
              properties: [],
            })
            .then(() => navigation.navigate("HomeScreen"))
            .catch((error) =>
              console.log("ERROR Data could not be saved", error)
            );
        })
        .catch((error) => {
          console.log(error);
          // TODO: Add warning pop up or something to give notice to user that there are errors
        });
    }

    this.setState({ email, password, phone, name, errors });
  };

  render() {
    const { email, password, errors, phone, name } = this.state;
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
                label="Name"
                error={hasErrors("name")}
                style={[styles.input, hasErrors("name")]}
                value={name}
                onChangeText={(name: string) =>
                  this.setState({
                    name,
                    errors: errors.filter((e) => e !== "name"),
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
              <Button onPress={() => this.handleSignUp()}>
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
