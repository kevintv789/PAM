import { Image, StyleSheet } from "react-native";

import Container from "./Container";
import React from "react";
import Text from "./Text";
import { TouchableOpacity } from "react-native-gesture-handler";
import { theme } from "shared";

const AddImageButton = (props: any) => {
  const { handleOnPress, caption, containerStyle } = props;
  return (
    <Container center style={containerStyle}>
      <TouchableOpacity onPress={() => handleOnPress()}>
        <Container
          style={styles.imageContainer}
          margin={[theme.sizes.padding]}
          flex={false}
          center
          middle
        >
          <Image
            source={require("assets/icons/camera.png")}
            style={styles.cameraImage}
          />
        </Container>
      </TouchableOpacity>

      <Text offWhite light>
        {caption}
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: theme.colors.offWhite,
    borderRadius: 100,
    width: 90,
    height: 90,
  },
  cameraImage: {
    width: 61,
    height: 61,
  },
});

export default AddImageButton;
