import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";

import { Container } from "../components";

export default class WelcomeScreen extends Component {
  render() {
    return (
      <Container color="accent">
        <Text> Welcome! </Text>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});
