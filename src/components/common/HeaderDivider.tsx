import { Dimensions, StyleSheet } from "react-native";

import Container from "./Container";
import React from "react";
import Text from "./Text";
import { theme } from "shared";

const { width } = Dimensions.get("window");

const HeaderDivider = (props: any) => {
  const { title, color = "offWhite", style } = props;

  const containerStyle = [styles.container, style];

  return (
    <Container color={color} style={containerStyle} middle flex={false}>
      <Text semibold accent style={{ paddingLeft: theme.sizes.base }}>
        {title}
      </Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 47,
    width,
    marginTop: theme.sizes.base,
  },
});

export default HeaderDivider;
