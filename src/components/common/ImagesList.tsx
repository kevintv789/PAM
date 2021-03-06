import { FlatList, Image, StyleSheet } from "react-native";

import AddImageButton from "./AddImageButton";
import Container from "./Container";
import React from "react";

const ImagesList = (props: any) => {
  const { images, showAddImageModal, caption, imageSize, margins } = props;

  return (
    <Container>
      <FlatList
        keyboardShouldPersistTaps={"handled"}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={images}
        renderItem={({ item, index }) => (
          <React.Fragment>
            <Image source={{ uri: item.uri }} style={[styles.image, imageSize, margins]} />
            {images.length === index + 1 && caption && (
              <Container>
                <AddImageButton
                  handleOnPress={() => showAddImageModal()}
                  caption={caption}
                  containerStyle={{ marginRight: 10, width: 150 }}
                />
              </Container>
            )}
          </React.Fragment>
        )}
        keyExtractor={(item: any) => item.uri}
      />
    </Container>
  );
};

export default ImagesList;

const styles = StyleSheet.create({
  image: {
    width: 165,
    height: 165,
    marginHorizontal: 10,
    marginTop: 20,
  },
});
