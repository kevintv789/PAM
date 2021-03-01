import React from "react";
import { StyleSheet } from "react-native";
import _Container from "./Container";
import _Text from "./Text";
import { theme } from "../../shared/constants";

const Container: any = _Container;
const Text: any = _Text;

const HeaderDivider = (props: any) => {
  const { title, style } = props;

  const containerStyle = [styles.container, style];

  return (
    <Container color="offWhite" style={containerStyle} middle>
      <Text semibold accent style={{ paddingLeft: theme.sizes.base }}>
        {title}
      </Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 47,
    width: '100%'
  },
});

export default HeaderDivider;
