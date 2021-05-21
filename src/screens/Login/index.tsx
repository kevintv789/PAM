import {
  Button,
  CheckBox,
  Container,
  LoadingIndicator,
  Text,
  TextInput,
} from "components/common";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { Component } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthService from "services/auth.service";
import { LoginModel } from "models";
import { User } from "models/User.model";
import { theme } from "shared";
import { validateEmail } from "shared/Utils";

const { width } = Dimensions.get("window");

export default class LoginScreen extends Component<
  LoginModel.Props,
  LoginModel.State
> {
  private authService = new AuthService();
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
      password: "pamisthebest",
      errors: [],
      isLoading: false,
      rememberMe: false,
    };
  }

  async componentDidMount() {
    const email = await this.getEmailFromAsyncStorage();

    this.setState({
      rememberMe: email != null,
      email: email || "",
    });
  }

  handleSignIn = () => {
    const { email, password, rememberMe } = this.state;
    const { navigation } = this.props;

    const errors: string[] = [];

    if (!validateEmail(email)) {
      errors.push("email");
    }

    if (!password.length) {
      errors.push("password");
    }

    const userObj: User = {
      email,
      password,
    };

    // TODO -- Add loading indicator
    this.authService
      .handleSignInWithEmailAndPassword(userObj)
      .then(() => {
        this.rememberEmail(rememberMe, email).then(() => {
          navigation.navigate("HomeScreen");
        });
      })
      .catch(() => {
        errors.push("wrongCredentials");
        errors.push("password");
        errors.push("email");
        this.setState({ errors });
      })
      .finally(() => this.setState({ isLoading: false }));

    this.setState({ email, errors, isLoading: true });
  };

  rememberEmail = async (checked: boolean, email: string) => {
    if (checked) {
      try {
        await AsyncStorage.setItem(`remember-email`, email);
      } catch (error) {
        console.log("ERROR in remembering you", error);
      }
    } else {
      try {
        await AsyncStorage.removeItem(`remember-email`);
      } catch (error) {
        console.log("ERROR in forgetting you", error);
      }
    }
  };

  getEmailFromAsyncStorage = async () => {
    try {
      const email = await AsyncStorage.getItem(`remember-email`);
      if (email != null) return email;
    } catch (error) {
      console.log("ERROR in retrieving remembered email", error);
    }
  };

  render() {
    const { email, password, errors, isLoading, rememberMe } = this.state;
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
              <CheckBox
                rightLabel="Remember me"
                defaultChecked={rememberMe}
                handleCheck={(checked: boolean) =>
                  this.setState({ rememberMe: !checked })
                }
                touchAreaStyle={styles.checkbox}
              />
              {hasErrors("wrongCredentials") && (
                <Text red style={{ marginVertical: 20 }} center>
                  Incorrect email or password
                </Text>
              )}
              <Button onPress={() => this.handleSignIn()} disabled={isLoading}>
                <Text
                  center
                  offWhite
                  size={theme.fontSizes.medium}
                  style={styles.loginText}
                >
                  {!isLoading && "Log In"}
                  {isLoading && (
                    <LoadingIndicator
                      size="small"
                      color={theme.colors.offWhite}
                    />
                  )}
                </Text>
              </Button>
              <TouchableOpacity onPress={() => {}}>
                <Text center offWhite style={styles.forgotPassword}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            </Container>
          </KeyboardAvoidingView>
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
  loginText: {
    alignSelf: "center",
  },
  checkbox: {
    marginVertical: 15,
  },
});
