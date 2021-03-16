import "react-native-gesture-handler";

import React, { Component } from "react";

import { Container } from "components/common";
import Navigation from "navigation";

export default class App extends Component {
  render() {
    return (
      <Container>
        <Navigation />
      </Container>
    );
  }
}
