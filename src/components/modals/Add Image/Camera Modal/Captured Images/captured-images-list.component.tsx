import { Container, Text } from "components/common";
import { Image, StyleSheet } from "react-native";

import React from "react";
import { takeRight } from "lodash";
import { theme } from "shared";

const CapturedImagesListComponent = (props: any) => {
  const { images } = props;

  return (
    <Container style={styles.mainContainer}>
      <Container style={styles.tooltip} flex={false}>
        <Text size={theme.fontSizes.regular} black center>
          {images.length}
        </Text>
      </Container>

      <Container center row>
        {takeRight(images, 4).map((image: any, index: number) => {
          if (index < 4) {
            return (
              <Image
                source={{ uri: image.uri }}
                key={image.uri}
                style={styles.image}
              />
            );
          }
        })}
      </Container>
    </Container>
  );
};

export default CapturedImagesListComponent;

const styles = StyleSheet.create({
  mainContainer: {
    width: 100,
  },
  tooltip: {
    backgroundColor: "white",
    marginBottom: 5,
    marginLeft: 3,
    borderRadius: 5,
    width: 20,
  },
  image: {
    height: 50,
    width: 35,
    marginRight: -20,
    borderWidth: 3,
    borderColor: theme.colors.gray2,
    borderRadius: 10,
  },
});
