import { AssetsSelector } from "expo-images-picker";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import React from "react";
import { StyleSheet } from "react-native";
import { theme } from "shared";

const GalleryComponent = (props: any) => {
  const { visible, hideModal, onDone } = props;

  return (
    <Modal isVisible={visible} coverScreen={true} style={styles.modal}>
      <AssetsSelector
        options={{
          manipulate: {
            width: 512,
            compress: 1,
            base64: false,
            saveTo: "jpeg",
          },
          assetsType: ["photo"],
          margin: 3,
          portraitCols: 3,
          landscapeCols: 4,
          widgetWidth: 100,
          widgetBgColor: theme.colors.offWhite,
          spinnerColor: theme.colors.accent,
          videoIcon: {
            Component: Ionicons,
            iconName: "ios-videocam",
            color: "white",
            size: 20,
          },
          selectedIcon: {
            Component: Ionicons,
            iconName: "ios-checkmark-circle-outline",
            color: theme.colors.offWhite,
            bg: 'rgba(128,128,128, 0.5)',
            size: 48,
          },
          defaultTopNavigator: {
            selectedText: "Selected",
            continueText: "Finish",
            goBackText: "Back",
            midTextColor: theme.colors.accent,
            buttonStyle: styles.topNavButtons,
            buttonTextStyle: styles.topNavButtonText,
            backFunction: () => hideModal(),
            doneFunction: (data) => onDone(data),
          },
        }}
      />
    </Modal>
  );
};

export default GalleryComponent;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    marginTop: "10%",
  },
  topNavButtons: {
    backgroundColor: theme.colors.accent,
    borderRadius: 10,
  },
  topNavButtonText: {
    color: theme.colors.offWhite,
  },
  selectedIcon: {
    alignSelf: "flex-end",
  },
});
