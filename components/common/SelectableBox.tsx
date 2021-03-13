import { Image, StyleSheet } from "react-native";
import React, { useState } from "react";

import { TouchableOpacity } from "react-native-gesture-handler";
import _Container from "../common/Container";
import _Text from "../common/Text";
import { theme } from "../../shared";

const Container: any = _Container;
const Text: any = _Text;

const SelectableBox = (props: any) => {
  const { boldedLabel, regularLabel, handlePressed, timePeriod } = props;
  const [hasSelected, setHasSelected] = useState(false);

  const boxStyle = [
    styles.box,
    {
      borderColor: hasSelected ? theme.colors.secondary : theme.colors.offWhite,
    },
  ];

  const textStyle = [
    {
      color: hasSelected ? theme.colors.secondary : theme.colors.offWhite,
    },
  ];

  return (
    <TouchableOpacity
      style={styles.mainContainer}
      onPress={() => {
        handlePressed(timePeriod);
        setHasSelected(!hasSelected);
      }}
    >
      <Container space="between" row style={boxStyle}>
        <Container row center middle flex={false}>
          <Text bold offWhite style={textStyle}>
            {boldedLabel}{" "}
          </Text>
          <Text offWhite style={textStyle}>
            {regularLabel}
          </Text>
        </Container>
        <Container middle flex={false}>
          {!hasSelected && <Container style={styles.emptyCircle}></Container>}
          {hasSelected && (
            <Container center middle style={styles.checkMarkCircle}>
              <Image
                source={require("../../assets/icons/checkmark.png")}
                style={styles.checkmark}
              />
            </Container>
          )}
        </Container>
      </Container>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  box: {
    borderWidth: 1,
    width: 306,
    borderColor: theme.colors.offWhite,
    borderRadius: 10,
    height: 57,
    paddingHorizontal: theme.sizes.padding,
  },
  emptyCircle: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: theme.colors.offWhite,
    width: 31,
    maxHeight: 31,
  },
  checkMarkCircle: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    width: 31,
    maxHeight: 31,
    backgroundColor: theme.colors.secondary,
  },
  checkmark: {
    height: 14,
    width: 16,
  },
});

export default SelectableBox;
