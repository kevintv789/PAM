import * as Animatable from "react-native-animatable";

import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { Container, Text } from "components/common";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
import Swiper from "react-native-swiper";
import moment from "moment";
import { theme } from "shared";

const { width, height } = Dimensions.get("window");
const AnimatedContainer = Animated.createAnimatedComponent(Container);

const CameraPreviewModalComponent = (props: any) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedImageUri, setExpandedImageUri] = useState("");

  const { visible, hideModal, images, removeImageOnIndex } = props;

  const formatCurrentDate = () => {
    return (
      moment().format("MMMM DD, YYYY") + " at " + moment().format("h:mm A")
    );
  };

  const renderClickableButtons = (
    containerStyle: any,
    image?: any,
    index?: number
  ) => {
    return (
      <Container style={containerStyle} flex={false} middle center>
        <TouchableOpacity
          style={{ marginBottom: 20, marginTop: 0 }}
          onPress={() => {
            setExpanded(!expanded);
            if (image) {
              setExpandedImageUri(image.uri);
            }
          }}
        >
          <MaterialCommunityIcons
            name={expanded ? "arrow-collapse" : "arrow-expand-all"}
            size={26}
            color={theme.colors.offWhite}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginBottom: 0, marginTop: 0 }}
          onPress={() => removeImageOnIndex(index)}
        >
          <Feather name="trash-2" size={26} color={theme.colors.red} />
        </TouchableOpacity>
      </Container>
    );
  };

  const renderNotesSection = () => {
    return (
      <Container flex={false} style={styles.notesContainer}>
        <Container row center>
          <Ionicons
            name="ios-create-outline"
            size={22}
            color={theme.colors.gray}
          />
          <Text style={{ marginTop: 3, opacity: 0.6 }} accent>
            {formatCurrentDate()}
          </Text>
        </Container>
        <Container padding={[10, 0, 0, 5]}>
          <TextInput
            placeholder="Add note..."
            placeholderTextColor={theme.colors.gray}
            numberOfLines={3}
            style={{ fontSize: theme.fontSizes.medium, height: "100%" }}
          />
        </Container>
      </Container>
    );
  };

  return (
    <Container>
      <Modal isVisible={visible} style={styles.modal}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flex: 1 }}
          scrollEnabled={false}
          keyboardShouldPersistTaps={"handled"}
        >
          {expanded && (
            <AnimatedContainer
              flex={false}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <ReactNativeZoomableView
                initialZoom={1}
                maxZoom={3}
                minZoom={0.9}
                captureEvent
              >
                <ImageBackground
                  source={{ uri: expandedImageUri }}
                  style={styles.fullSizedImage}
                >
                  {renderClickableButtons(
                    styles.expandedClickableButtonContainer
                  )}
                </ImageBackground>
              </ReactNativeZoomableView>
            </AnimatedContainer>
          )}

          {!expanded && (
            <Container flex={false}>
              <TouchableOpacity
                onPress={() => {
                  hideModal();
                  setExpanded(false);
                }}
                style={styles.doneButton}
              >
                <Image
                  source={require("assets/icons/left_arrow.png")}
                  style={{ width: 40, height: 40 }}
                />
                <Text
                  tertiary
                  size={theme.fontSizes.big}
                  semibold
                  style={{ alignSelf: "center" }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </Container>
          )}

          <Swiper showsPagination={false}>
            {images.map((image: any, index: number) => (
              <Container
                style={styles.imageContainer}
                middle
                flex={false}
                key={image.uri}
              >
                <ImageBackground
                  source={{ uri: image.uri }}
                  style={styles.imageBackground}
                  imageStyle={{
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                  }}
                >
                  <Container flex={false} right>
                    <Container
                      style={styles.counterContainer}
                      flex={false}
                      middle
                    >
                      <Text center offWhite>{`${index + 1} / ${
                        images.length
                      }`}</Text>
                    </Container>
                    {renderClickableButtons(
                      styles.clickableButtonsContainer,
                      image,
                      index
                    )}
                  </Container>
                </ImageBackground>
                {renderNotesSection()}
              </Container>
            ))}
          </Swiper>
        </KeyboardAwareScrollView>
      </Modal>
    </Container>
  );
};

export default CameraPreviewModalComponent;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    backgroundColor: theme.colors.accent,
  },
  doneButton: {
    flexDirection: "row",
    marginTop: 50,
    marginLeft: 30,
  },
  imageContainer: {
    width: width * 0.92,
    height: height * 0.56,
    alignSelf: "center",
    marginTop: 50,
    borderRadius: 20,
    backgroundColor: theme.colors.offWhite,
    justifyContent: "flex-start",
  },
  imageBackground: {
    width: "100%",
    height: "90%",
  },
  counterContainer: {
    width: 50,
    height: 40,
    backgroundColor: "rgba(1, 1, 1, 0.4)",
    alignSelf: "flex-end",
    borderRadius: 10,
    margin: 10,
    marginBottom: -5,
  },
  clickableButtonsContainer: {
    width: 50,
    height: 120,
    backgroundColor: "rgba(1, 1, 1, 0.4)",
    alignSelf: "flex-end",
    borderRadius: 10,
    margin: 10,
  },
  expandedClickableButtonContainer: {
    width: 50,
    height: 120,
    backgroundColor: "rgba(1, 1, 1, 0.4)",
    alignSelf: "flex-end",
    borderRadius: 10,
    margin: 10,
    marginTop: 100,
  },
  fullSizedImage: {
    resizeMode: "stretch",
    flex: 1,
  },
  notesContainer: {
    position: "absolute",
    top: height * 0.45,
    padding: 7,
  },
});
