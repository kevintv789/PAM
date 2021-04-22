import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

import Container from "./Container";
import React from "react";
import { theme } from "shared";

const SearchInput = (props: any) => {
  const { handleChangeText, handleClearText, searchValue } = props;

  return (
    <Container flex={false} row middle>
      <EvilIcons
        name="search"
        size={26}
        color={theme.colors.gray2}
        style={styles.icon}
      />

      <TextInput
        style={styles.input}
        placeholder="Search for a property"
        placeholderTextColor={theme.colors.gray2}
        onChangeText={(value: string) => handleChangeText(value)}
        value={searchValue}
      />

      {searchValue.length > 0 && (
        <TouchableOpacity onPress={() => handleClearText()}  style={styles.clearIcon}>
          <AntDesign
            name="closecircleo"
            size={22}
            color={theme.colors.tertiary}
           
          />
        </TouchableOpacity>
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
    margin: 10,
    padding: 10,
    marginTop: 0,
    color: theme.colors.offWhite,
    alignSelf: "center",
    paddingLeft: 35,
    paddingRight: 40,
  },
  icon: {
    position: "absolute",
    zIndex: 1,
    left: 28,
    top: 8,
  },
  clearIcon: {
    position: "absolute",
    right: 30,
    top: 8,
  },
});
