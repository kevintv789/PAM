import { CalculatorInput } from "react-native-calculator";
import Container from "./Container";
import React from "react";
import { StyleSheet } from "react-native";
import Text from "./Text";
import { theme } from "shared";

const CurrencyInput = (props: any) => {
  const { label, handleChange, value, textFieldWidth } = props;

  return (
    <Container style={{ width: "100%" }}>
      <Text tertiary style={styles.label}>
        {label}
      </Text>
      <CalculatorInput
        fieldTextStyle={styles.fieldText}
        fieldContainerStyle={[
          styles.fieldContainer,
          textFieldWidth ? { width: textFieldWidth } : { width: 330 },
        ]}
        onChange={(value) => handleChange(value)}
        value={value}
        suffix={value.toString().split(".")[1] ? "" : ".00"}
        prefix="$ "
        actionButtonBackgroundColor={theme.colors.tertiary}
        acceptButtonBackgroundColor={theme.colors.secondary}
        modalAnimationType="slide"
        displayHeight={50}
        height={300}
        modalBackdropStyle={{ backgroundColor: "transparent" }}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  label: {
    paddingLeft: 10,
    top: 10,
  },
  fieldContainer: {
    height: 35,
  },
  fieldText: {
    color: theme.colors.offWhite,
  },
});

export default CurrencyInput;
