import { Animated, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { AntDesign, EvilIcons } from "@expo/vector-icons";

import Container from "./Container";
import React from "react";
import { theme } from "shared";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedLeftIcon = Animated.createAnimatedComponent(EvilIcons);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const INPUT_MAX_HEIGHT = 40;
const INPUT_MIN_HEIGHT = 0;
const INPUT_MAX_PADDING = 10;
const ICON_MAX_TOP = -5;
const ICON_MIN_TOP = -10;

const SearchInput = (props: any) => {
  const { handleChangeText, handleClearText, searchValue, scrollOffset } = props;

  const animatedInputHeight = scrollOffset.interpolate({
    inputRange: [0, INPUT_MAX_HEIGHT - INPUT_MIN_HEIGHT],
    outputRange: [INPUT_MAX_HEIGHT, INPUT_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const animatedInputPadding = scrollOffset.interpolate({
    inputRange: [0, INPUT_MAX_PADDING - INPUT_MIN_HEIGHT],
    outputRange: [INPUT_MAX_PADDING, INPUT_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const animatedIconTop = scrollOffset.interpolate({
    inputRange: [0, ICON_MAX_TOP - ICON_MIN_TOP],
    outputRange: [ICON_MAX_TOP, ICON_MIN_TOP],
    extrapolate: "clamp",
  });

  return (
    <Container flex={false} row middle>
      {scrollOffset._value < 13 && (
        <AnimatedLeftIcon
          name="search"
          size={22}
          color={theme.colors.gray2}
          style={[styles.icon, { top: animatedIconTop }]}
        />
      )}

      <AnimatedTextInput
        style={[
          styles.input,
          {
            height: animatedInputHeight,
            padding: animatedInputPadding,
            borderWidth: scrollOffset._value > 40 ? 0 : 1,
          },
        ]}
        placeholder="Search"
        placeholderTextColor={theme.colors.gray2}
        onChangeText={(value: string) => handleChangeText(value)}
        value={searchValue}
      />

      {searchValue.length > 0 && scrollOffset._value < 13 && (
        <AnimatedTouchableOpacity
          onPress={() => handleClearText()}
          style={[styles.clearIcon, { top: animatedIconTop }]}
        >
          <AntDesign name="closecircleo" size={22} color={theme.colors.tertiary} />
        </AnimatedTouchableOpacity>
      )}
    </Container>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  input: {
    width: "90%",
    backgroundColor: theme.colors.accent,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.offWhite,
    margin: 15,
    padding: 10,
    marginTop: -15,
    color: theme.colors.offWhite,
    alignSelf: "center",
    paddingLeft: 35,
    paddingRight: 40,
  },
  icon: {
    position: "absolute",
    zIndex: 1,
    left: 28,
    top: -5,
  },
  clearIcon: {
    position: "absolute",
    right: 30,
    top: -5,
  },
});
