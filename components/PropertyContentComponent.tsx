import React, { Component } from "react";

import { StyleSheet } from "react-native";
import _Container from "./common/Container";
import _Text from "./common/Text";

const Text: any = _Text;
const Container: any = _Container;

export default class PropertyContentComponent extends Component {
  render() {
    return (
      <Container>
        <Text> PROPERTY CONTENT LOL </Text>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});
