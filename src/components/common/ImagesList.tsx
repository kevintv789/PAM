import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Image as RNImage, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import CameraPreviewModalComponent from "components/Modals/Add Image/Camera Modal/Camera Preview/camera-preview.component";
import Container from "./Container";
import { Image } from "react-native-expo-image-cache";
import { theme } from "shared";

const ImagesList = (props: any) => {
  const [isImageSelected, setImageSelected] = useState(null);
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);

  const {
    images,
    imageSize,
    margins,
    isCached = false,
    onDeleteImage,
    onDragEnd,
    containerStyle,
    iconHorizontalPadding,
  } = props;

  const onImageSelect = (image: any) => {
    if (isImageSelected === image.uri) {
      setImageSelected(null);
    } else {
      setImageSelected(image.uri);
    }
  };

  const onDeleteSingleImage = (image: any) => {
    if (onDeleteImage) {
      onDeleteImage(image);
    }
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
      <Container style={containerStyle}>
        <Container
          style={isImageSelected === item.uri ? styles.selected : {}}
          center
          middle
          row
        >
          {isImageSelected === item.uri && (
            <TouchableOpacity onPress={() => setShowImagePreviewModal(true)}>
              <FontAwesome5
                name="images"
                size={26}
                color="white"
                style={{ paddingRight: 10, paddingLeft: 10 }}
              />
            </TouchableOpacity>
          )}
          {isImageSelected === item.uri && onDeleteImage && (
            <TouchableOpacity onPress={() => onDeleteSingleImage(item)}>
              <Feather
                name="trash-2"
                size={32}
                color={theme.colors.offWhite}
                style={[
                  styles.imagePreviewBtn,
                  {
                    marginHorizontal: iconHorizontalPadding
                      ? iconHorizontalPadding
                      : 7,
                  },
                ]}
              />
            </TouchableOpacity>
          )}
        </Container>
        {imageComponent}
      </Container>
    );
  };

  const renderItem = ({ item, drag }: RenderItemParams<any>) => {
    return (
      <React.Fragment>
        <TouchableOpacity
          onPress={() => onImageSelect(item)}
          onLongPress={() => {
            setImageSelected(null);
            drag();
          }}
        >
          {renderImage(item)}
        </TouchableOpacity>
      </React.Fragment>
    );
  };

  return (
    <Container>
      <DraggableFlatList
        keyboardShouldPersistTaps={"handled"}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.uri}
        onDragEnd={(data) => {
          onDragEnd ? onDragEnd(data) : null;
        }}
      />
      <Container flex={false}>
        <CameraPreviewModalComponent
          visible={showImagePreviewModal}
          hideModal={() => setShowImagePreviewModal(false)}
          images={images}
        />
      </Container>
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
