import React, { useState } from "react";

import { StyleSheet } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import _Container from "./Container";
import _Text from "./Text";
import { theme } from "shared";

const Container: any = _Container;
const Text: any = _Text;

export default function Toggle(props: any) {
  const {
    options,
    initialIndex,
    selectedTextColor,
    selectedButtonColor,
    handleToggled,
    containerStyle,
    backgroundColor,
    borderRadius,
    animationDuration,
    height,
    labelStyle,
    topLabel,
  } = props;

  const topLabelStyle = [styles.topLabel, labelStyle];

  return (
    <Container style={containerStyle}>
      <Text offWhite style={topLabelStyle}>
        {topLabel}
      </Text>
      <SwitchSelector
        options={options}
        initial={initialIndex}
        onPress={(value) => handleToggled(value)}
        selectedColor={selectedTextColor || theme.colors.offWhite}
        buttonColor={selectedButtonColor || theme.colors.secondary}
        backgroundColor={backgroundColor || theme.colors.primary}
        borderRadius={borderRadius || 50}
        animationDuration={animationDuration || 250}
        height={height || 40}
        selectedTextStyle={styles.activeText}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  topLabel: {
    marginBottom: theme.sizes.base * 0.8,
    fontSize: theme.fontSizes.small,
  },
  activeText: {
    fontWeight: "bold",
  },
});
