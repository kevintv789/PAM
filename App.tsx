import "react-native-gesture-handler";

import React, { Component } from "react";

import { Container } from "components/common";
import Navigation from "navigation";
import { Provider } from "react-redux";
import configureStore from "reducks/store/configureStore";

export default class App extends Component {
  render() {
    return (
      <Provider store={configureStore}>
        <Container>
          <Navigation />
        </Container>
      </Provider>
    );
  }
}
