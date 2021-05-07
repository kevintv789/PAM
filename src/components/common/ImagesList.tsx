import {
  FlatList,
  Image as RNImage,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

import AddImageButton from "./AddImageButton";
import Container from "./Container";
import { Feather } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import { theme } from "shared";

const ImagesList = (props: any) => {
  const [isImageSelected, setImageSelected] = useState(null);

  const {
    images,
    showAddImageModal,
    caption,
    imageSize,
    margins,
    isCached = false,
    onDeleteImage,
  } = props;

  const onImageSelect = (image: any) => {
    if (isImageSelected === image.uri) {
      setImageSelected(null);
    } else {
      setImageSelected(image.uri);
    }
  };

  const onDeleteSingleImage = (image: any) => {
    onDeleteImage(image);
  };

  const renderImage = (item: any) => {
    let imageComponent = (
      <RNImage
        source={{ uri: item.uri }}
        style={[styles.image, imageSize, margins]}
      />
    );

    if (isCached) {
      imageComponent = (
        <Image uri={item.uri} style={[styles.image, imageSize, margins]} />
      );
    }

    return (
      <Container>
        <Container
          style={isImageSelected === item.uri ? styles.selected : {}}
          center
          middle
          row
        >
          {isImageSelected === item.uri && (
            <TouchableOpacity>
              <RNImage
                source={require("assets/icons/four-squares.png")}
                style={styles.imagePreviewBtn}
              />
            </TouchableOpacity>
          )}
          {isImageSelected === item.uri && (
            <TouchableOpacity onPress={() => onDeleteSingleImage(item)}>
              <Feather
                name="trash-2"
                size={32}
                color={theme.colors.offWhite}
                style={styles.imagePreviewBtn}
              />
            </TouchableOpacity>
          )}
        </Container>
        {imageComponent}
      </Container>
    );
  };

  return (
    <Container>
      <FlatList
        keyboardShouldPersistTaps={"handled"}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={images}
        renderItem={({ item, index }) => (
          <React.Fragment>
            <TouchableOpacity
              onPress={() => onImageSelect(item)}
              onLongPress={() => console.log("rearranging...")}
            >
              {renderImage(item)}
            </TouchableOpacity>
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
  selected: {
    position: "absolute",
    top: 8,
    left: 5,
    bottom: 0,
    right: 5,
    zIndex: 1,
    backgroundColor: "rgba(61, 64, 91, 0.6)",
  },
  imagePreviewBtn: {
    width: 35,
    height: 35,
    marginHorizontal: 7,
  },
});
