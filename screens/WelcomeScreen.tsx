import { Container, Text } from "../components";
import { ImageBackground, StyleSheet } from "react-native";
import React, { Component } from "react";

import { theme } from "../shared/constants";

export default class WelcomeScreen extends Component {
  render() {
    return (
      <ImageBackground
        style={styles.background}
        source={require("../assets/images/welcome_screen.png")}
      >
        <Container center padding={theme.sizes.padding}>
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
