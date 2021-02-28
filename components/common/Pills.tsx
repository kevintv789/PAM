import React, { useState } from "react";
import { StyleSheet, Touchable } from "react-native";

import { TouchableOpacity } from "react-native-gesture-handler";
import _Button from "./Button";
import _Container from "./Container";
import _Text from "./Text";
import { theme } from "../../shared/constants";

const Button: any = _Button;
const Container: any = _Container;
const Text: any = _Text;

const Pills = (props: any) => {
  const {
    selectable,
    label,
    containerStyle,
    labelStyle,
    handlePillSelected,
  } = props;
  const defaultContainerStyle = [styles.container, containerStyle];

  const renderPlainPill = () => {
    return (
      <Container style={defaultContainerStyle}>
        <Text offWhite center>
          {label}
        </Text>
      </Container>
    );
  };

  const renderSelectablePill = () => {
    return (
      <TouchableOpacity onPress={() => handlePillSelect()}>
        <Container style={defaultContainerStyle}>
          <Text offWhite center style={labelStyle}>
            {label}
          </Text>
        </Container>
      </TouchableOpacity>
    );
  };

  const handlePillSelect = () => {
    handlePillSelected(label);
  };

  return !selectable ? renderPlainPill() : renderSelectablePill();
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.offWhite,
    borderRadius: 10,
    padding: theme.sizes.padding / 3,
    marginTop: theme.sizes.base / 2,
    marginRight: theme.sizes.base * 1.5,
  },
});

export default Pills;
