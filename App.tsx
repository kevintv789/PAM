import "react-native-gesture-handler";
import "firebase/firestore";

import * as eva from "@eva-design/eva";
import * as firebase from "firebase";

import React, { Component } from "react";

import { ApplicationProvider } from "@ui-kitten/components";
import { Container } from "components/common";
import Navigation from "navigation";
import { Provider } from "react-redux";
import configureStore from "reducks/store/configureStore";
import { firebaseConfig } from "./environment";

/**
 * Makes sure no other firebase instances are initialized
 * if there is even 1 initialized app, then the firebase will crash
 */
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

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
