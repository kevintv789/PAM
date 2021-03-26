import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "components/common/Text";
import { theme } from "shared";

export default function CheckBox(props: any) {
  const { rightLabel, handleCheck, defaultChecked, touchAreaStyle } = props;
  const [checked, setChecked] = useState(defaultChecked);

  const handleTouch = () => {
    setChecked(!checked);
    handleCheck(checked);
  };

  const containerStyle = [styles.touchableArea, touchAreaStyle];

  return (
    <TouchableOpacity style={containerStyle} onPress={() => handleTouch()}>
      <MaterialCommunityIcons
        name={checked ? "checkbox-marked" : "checkbox-blank-outline"}
        size={24}
        color={checked ? theme.colors.secondary : theme.colors.gray}
        style={styles.icon}
      />
      <Text offWhite>{rightLabel}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchableArea: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  icon: {
    paddingRight: 4,
  },
});
