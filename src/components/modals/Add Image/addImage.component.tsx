import * as ImagePicker from "expo-image-picker";

import { Button, Container, HeaderDivider, Text } from "components/common";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Platform, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";

import GalleryComponent from "components/Modals/Add Image/Gallery Modal/gallery.component";
import Modal from "react-native-modal";
import { theme } from "shared";

const AddImageModalComponent = (props: any) => {
  const { visible, hideModal, onSelectImages } = props;

  const [galleryImage, setGalleryImage] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const renderCameraPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        alert(
          "Sorry, we don't have sufficient permission to open your camera. To allow, navigate to your phone settings."
        );
      }

      return;
    }
  };

  const takePhotoFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
  };

  const pickImagesFromGallery = (data: any[]) => {
    setShowGalleryModal(false);
    onSelectImages(data);
  };

  return (
    <React.Fragment>
      <Modal
        isVisible={visible}
        onBackdropPress={() => hideModal()}
        animationIn="slideInUp"
        coverScreen={false}
        style={styles.modal}
      >
        <Container style={styles.contentContainer}>
          <Button
            style={styles.button}
            onPress={() =>
              renderCameraPermission().then(() => takePhotoFromCamera())
            }
            flat
          >
            <Container row margin={[0, 0, 0, 15]} center>
              <Feather name="camera" size={24} color={theme.colors.offWhite} />
              <Text offWhite size={18} style={styles.text} semibold>
                Take photo
              </Text>
            </Container>
          </Button>

          <HeaderDivider color="gray2" style={styles.divider} />

          <Button
            style={styles.button}
            onPress={() => setShowGalleryModal(true)}
            flat
          >
            <Container row margin={[0, 0, 0, 15]} center>
              <FontAwesome
                name="file-photo-o"
                size={26}
                color={theme.colors.offWhite}
              />
              <Text offWhite size={18} style={styles.text} semibold>
                Add from gallery
              </Text>
            </Container>
          </Button>

          {/* <HeaderDivider color="gray2" style={styles.divider} />

      // TODO -- Add from file. Use Expo's DocumentPicker
        <Button
          style={styles.button}
          onPress={() => console.log("photo pressed")}
          flat
        >
          <Container row margin={[0, 0, 0, 15]} center>
            <Feather name="folder" size={26} color={theme.colors.offWhite} />
            <Text offWhite size={18} style={styles.text} semibold>
              Add from files
            </Text>
          </Container>
        </Button> */}
        </Container>

        <Button
          style={styles.cancelButton}
          color="red"
          onPress={() => hideModal()}
        >
          <Text offWhite center semibold size={18}>
            Cancel
          </Text>
        </Button>
      </Modal>
      <GalleryComponent
        visible={showGalleryModal}
        onDone={(data: any[]) => pickImagesFromGallery(data)}
        hideModal={() => setShowGalleryModal(false)}
      />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: theme.colors.accent,
    maxHeight: 160,
    borderRadius: 10,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "transparent",
    marginTop: 20,
    marginBottom: 0,
  },
  text: {
    paddingLeft: 20,
  },
  cancelButton: {
    marginBottom: 30,
    width: "100%",
    marginTop: 20,
  },
  divider: {
    width: "93%",
    height: StyleSheet.hairlineWidth,
    marginTop: 10,
    alignSelf: "center",
    marginBottom: -5,
  },
});

export default AddImageModalComponent;
