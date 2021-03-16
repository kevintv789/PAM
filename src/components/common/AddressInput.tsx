import * as environment from "../../../environment";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import PlacesInput from "react-native-places-input";
import React from "react";
import { StyleSheet } from "react-native";
import { theme } from "shared";

const AddressInput = (props: any) => {
  const { handleSelect, handleResults, onFocus } = props;
  return (
    <PlacesInput
      googleApiKey={environment.GOOGLE_MAPS_API_KEY}
      onSelect={(place: any) => handleSelect(place.result.name)}
      resultRender={(place: any) => place.structured_formatting.main_text}
      queryFields="name"
      requiredTimeBeforeSearch={100}
      onChangeText={(_: any, value: any) => handleResults(value.state.places)}
      textInputProps={{
        style: styles.input,
        placeholder: "Street Address *",
        placeholderTextColor: theme.colors.gray,
        onFocus,
        returnKeyType: "next",
      }}
      stylesContainer={styles.container}
      stylesItemText={{ color: theme.colors.offWhite }}
      stylesItem={{
        borderBottomColor: theme.colors.offWhite,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingLeft: theme.sizes.padding,
      }}
      stylesList={{ backgroundColor: "transparent" }}
      iconResult={
        <MaterialCommunityIcons
          name="map-marker-right"
          size={20}
          style={styles.resultsIcon}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "88%",
    position: "relative",
    margin: 0,
    top: theme.sizes.base,
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: theme.sizes.base * 1.5,
  },
  input: {
    color: theme.colors.offWhite,
    borderBottomColor: theme.colors.offWhite,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    backgroundColor: "transparent",
    fontSize: theme.fontSizes.medium,
    paddingBottom: 10,
  },
  resultsIcon: {
    position: "absolute",
    left: 0,
    top: 13,
    bottom: 0,
    color: theme.colors.offWhite,
  },
});

export default AddressInput;
