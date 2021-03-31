import "react-native-gesture-handler";

import * as eva from '@eva-design/eva';

import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import React, { Component } from "react";

import { Container } from "components/common";
import Navigation from "navigation";
import { Provider } from "react-redux";
import configureStore from "reducks/store/configureStore";

export default class App extends Component {
  render() {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
      <Provider store={configureStore}>
        <Container>
          <Navigation />
        </Container>
      </Provider>
      </ApplicationProvider>
    );
  }
}
