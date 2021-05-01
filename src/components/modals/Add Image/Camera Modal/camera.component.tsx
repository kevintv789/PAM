import { Button, Container, Text } from "components/common";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  State,
  TouchableOpacity,
} from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";

import { Camera } from "expo-camera";
import CameraPreviewModalComponent from "./Camera Preview/camera-preview.component";
import CapturedImagesListComponent from "./Captured Images/captured-images-list.component";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { StyleSheet } from "react-native";
import { theme } from "shared";

const MAX_ZOOM = 8; // iOS only
const ZOOM_F = 0.1;

const CameraComponent = (props: any) => {
  const { visible, hideModal, capturePics } = props;
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [capturedImages, setCapturedImages]: any[] = useState([]);
  const [flashMode, setFlashMode] = useState(false);

  let cameraRef: Camera | null;
  let prevPinch = 0;

  const switchCamera = () => {
    if (cameraType === Camera.Constants.Type.back) {
      setCameraType(Camera.Constants.Type.front);
    } else {
      setCameraType(Camera.Constants.Type.back);
    }
  };

  const takePicture = async () => {
    if (!cameraRef) return;

    const photo = await cameraRef.takePictureAsync();
    const images: any[] = [...capturedImages];

    images.push(photo);
    setCapturedImages(images);
  };

  return (
    <React.Fragment>
      <Modal
        isVisible={visible}
        coverScreen={true}
        style={styles.modalContainer}
        hasBackdrop={false}
      >
        <Camera
          style={styles.cameraContainer}
          ref={(ref) => {
            cameraRef = ref;
          }}
          type={cameraType}
          flashMode={flashMode}
          focusable
          autoFocus
        >
          <Container
            style={styles.topButtonContainer}
            flex={false}
            row
            space="between"
          >
            <TouchableOpacity
              onPress={() => {
                setCapturedImages([]);
                setShowImagePreview(false);
                hideModal();
              }}
            >
              <Text semibold offWhite size={theme.fontSizes.big}>
                Cancel
              </Text>
            </TouchableOpacity>

            <Container right flex={false} row>
              <TouchableOpacity
                onPress={() => setFlashMode(!flashMode)}
                style={{ margin: -5, marginRight: 20 }}
              >
                <Ionicons
                  name={flashMode ? "flash-sharp" : "flash-outline"}
                  size={32}
                  color={
                    flashMode ? theme.colors.tertiary : theme.colors.offWhite
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => switchCamera()}
                style={{ margin: -5 }}
              >
                <Ionicons
                  name="camera-reverse-outline"
                  size={36}
                  color={theme.colors.offWhite}
                />
              </TouchableOpacity>
            </Container>
          </Container>

          <Container
            row
            flex={false}
            style={styles.bottomButtonContainer}
            center
          >
            {capturedImages && capturedImages.length > 0 && (
              <TouchableOpacity
                style={{ marginRight: 25 }}
                onPress={() => setShowImagePreview(true)}
              >
                <CapturedImagesListComponent images={capturedImages} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => takePicture()}>
              <Container
                center
                middle
                color="offWhite"
                style={styles.outerCircle}
                flex={false}
              >
                <Container flex={false} style={styles.innerCircle}></Container>
              </Container>
            </TouchableOpacity>

            {capturedImages && capturedImages.length > 0 && (
              <TouchableOpacity
                style={{ marginLeft: 50 }}
                onPress={() => {
                  capturePics(capturedImages);
                  setCapturedImages([]);
                  setShowImagePreview(false);
                  hideModal();
                }}
              >
                <Button color="secondary" style={styles.saveButton}>
                  <Text semibold offWhite size={theme.fontSizes.medium}>
                    Save
                  </Text>
                </Button>
              </TouchableOpacity>
            )}
          </Container>
        </Camera>

        <Container flex={false}>
          <CameraPreviewModalComponent
            visible={showImagePreview}
            hideModal={() => setShowImagePreview(false)}
            images={capturedImages}
            removeImageOnIndex={(index: number) => {
              let tempImages = [...capturedImages];
              tempImages.splice(index, 1);
              setCapturedImages(tempImages);

              if (tempImages.length === 0) {
                setShowImagePreview(false);
              }
            }}
          />
        </Container>
      </Modal>
    </React.Fragment>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
  },
  cameraContainer: {
    flex: 1,
  },
  topButtonContainer: {
    backgroundColor: "rgba(128, 128, 128, 0.5)",
    height: 110,
    alignItems: "flex-end",
    padding: 15,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
  },
  outerCircle: {
    width: 75,
    height: 75,
    borderRadius: 100,
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  saveButton: {
    width: 70,
    height: 40,
    alignItems: "center",
  },
});
