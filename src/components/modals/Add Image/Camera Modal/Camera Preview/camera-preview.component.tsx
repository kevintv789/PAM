import { Container, Text } from "components/common";
import { ImageBackground, StyleSheet, View } from "react-native";

import Modal from "react-native-modal";
import React from "react";
import Swiper from "react-native-swiper";
import { TouchableOpacity } from "react-native-gesture-handler";

const CameraPreviewModalComponent = (props: any) => {
  const { visible, hideModal, images } = props;

  return (
    <Container>
      <Modal isVisible={visible} style={styles.modal}>
        <Swiper scrollEnabled showsPagination={false}>
          {images.map((image: any) => (
            <Container key={image.uri}>
              <ImageBackground
                source={{ uri: image.uri }}
                style={styles.imageBackground}
              />
            </Container>
          ))}
        </Swiper>

        <Container flex={false} style={{ height: 100}}>
          <TouchableOpacity onPress={() => hideModal()}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </Container>
      </Modal>
    </Container>
  );
};

export default CameraPreviewModalComponent;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    backgroundColor: "white",
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
});
