import { Image, StyleSheet } from "react-native";
import { constants, theme } from "../../shared";

import React from "react";
import _Button from "../common/Button";
import _Container from "../common/Container";
import _Text from "../common/Text";

const Container: any = _Container;
const Button: any = _Button;
const Text: any = _Text;

const AddPropertyDoneComponent = (props: any) => {
  const { handleFinishedClick } = props;

  return (
    <Container center color="accent" style={styles.mainContainer}>
      <Image
        source={require("../../assets/icons/thumbs_up.png")}
        style={styles.image}
      />
      <Text offWhite size={24} bold style={styles.bigText}>
        You're All Set!
      </Text>
      <Text offWhite light center style={styles.bigText}>
        You can track all your properties on the Home tab. If you have any
        questions about how any of this works, don’t hesitate to contact us at{" "}
        {/* TODO -- maybe make this into a button, or a clickable link */}
        <Text tertiary semibold>
          {constants.SUPPORT_EMAIL}
        </Text>
        !
      </Text>
      <Button
        color="secondary"
        style={styles.button}
        onPress={() => handleFinishedClick()}
      >
        <Text offWhite center bold>
          Take Me Home
        </Text>
      </Button>
    </Container>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: theme.sizes.padding,
  },
  image: {
    width: 172,
    height: 172,
  },
  bigText: {
    marginTop: theme.sizes.padding * 1.5,
  },
  button: {
    marginTop: theme.sizes.padding * 1.5,
  },
});

export default AddPropertyDoneComponent;
