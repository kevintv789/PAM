import { Button, Container, Text } from "components/common";
import { ImageBackground, StyleSheet } from "react-native";
import React, { Component } from "react";

import { WelcomeScreenProps } from "../../types";
import { theme } from "../../shared";

export default class WelcomeScreen extends Component<WelcomeScreenProps> {
  render() {
    const { navigation } = this.props;
    return (
      <ImageBackground
        style={styles.background}
        source={require("assets/images/welcome_screen.png")}
      >
        <Container center padding={theme.sizes.padding}>

          {/* TODO -- On smaller screens iPhone SE, the words are being blended in with the sun in the background.
          Either change the background or find a way to move the text to the top without messing it up for the other screens. */}
          <Text offWhite size={40}>
            Meet
            <Text tertiary bold size={48}>
              {" "}
              PAM.
            </Text>
          </Text>
          <Container center padding={theme.sizes.padding * 0.5}>
            <Text offWhite size={16}>
              Your personal
            </Text>
            <Text offWhite size={16}>
              property assistant manager.
            </Text>
          </Container>

          <Container flex={0.5}>
            <Button shadow onPress={() => navigation.navigate("LoginScreen")}>
              <Text center offWhite size={17} medium>
                Log In
              </Text>
            </Button>
            <Button
              shadow
              color="offWhite"
              onPress={() => navigation.navigate("SignUpScreen")}
            >
              <Text center accent size={17} medium>
                Sign Up
              </Text>
            </Button>
          </Container>
        </Container>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: theme.sizes.padding * 2,
  },
});
