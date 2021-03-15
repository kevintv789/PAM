import { StyleSheet, Text, View } from "react-native";

import Dash from "react-native-dash";
import React from "react";
import _Container from "./Container";
import { theme } from "../../shared";

const Container: any = _Container;

const VerticalDivider = (props: any) => {
  return (
    <Container center>
      <Dash style={styles.container} dashColor={theme.colors.accent}></Dash>
    </Container>
  );
};

export default VerticalDivider;

const styles = StyleSheet.create({
  container: {
    width: 1,
    height: 300,
    flexDirection: "column",
  },
});
