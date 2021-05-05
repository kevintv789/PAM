import React, { useState } from "react";

import Button from "./Button";
import Container from "./Container";
import HeaderDivider from "./HeaderDivider";
import LoadingIndicator from "./LoadingIndicator";
import Modal from "react-native-modal";
import { StyleSheet } from "react-native";
import Text from "./Text";
import { theme } from "shared";

const CommonModal = (props: any) => {
  /**
   * compact - this prop allows the modal to only have one descriptor text and a Cancel/Okay button
   * children - this prop allows any form of component creation within the modal
   */
  const {
    visible,
    compact,
    children,
    descriptorText,
    hideModal,
    onRemoveProperty,
    customTextProp,
    headerIcon,
    headerIconBackground,
    title,
    // isLoading,
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  const renderNavButtons = () => (
    <Container row flex={false} margin={[20, 0, 0, 0]}>
      <Container left>
        <Button style={styles.navButtons} onPress={() => hideModal()}>
          <Text center offWhite>
            No
          </Text>
        </Button>
      </Container>

      <Container right>
        <Button
          color="secondary"
          style={styles.navButtons}
          onPress={() => {
            setIsLoading(true)
            onRemoveProperty().finally(() => setIsLoading(false));
          }}
          disabled={isLoading}
        >
          <Text center offWhite style={{ alignSelf: "center" }}>
            {!isLoading && "Yes"}
            {isLoading && (
              <LoadingIndicator size="small" color={theme.colors.offWhite} />
            )}
          </Text>
        </Button>
      </Container>
    </Container>
  );

  const renderCompactContent = () => {
    return (
      <Container
        color="accent"
        flex={false}
        style={[styles.compactContainer, headerIcon ? { height: 290 } : 200]}
        center
        middle
      >
        <Container flex={false} padding={[10, 0]} style={{ marginTop: 10 }}>
          <Text center offWhite bold size={28}>
            {title}
          </Text>
          <HeaderDivider
            color="offWhite"
            style={{
              width: 300,
              height: StyleSheet.hairlineWidth,
              marginTop: 10,
            }}
          />
        </Container>
        {!customTextProp && (
          <Text
            center
            size={theme.fontSizes.medium}
            offWhite
            style={{ width: "90%" }}
          >
            {descriptorText}
          </Text>
        )}
        {customTextProp}
        {renderNavButtons()}
      </Container>
    );
  };

  return (
    <React.Fragment>
      <Modal isVisible={visible} onBackdropPress={() => hideModal()}>
        {headerIcon && (
          <Container
            flex={false}
            center
            middle
            style={[
              styles.iconHeader,
              { backgroundColor: headerIconBackground },
            ]}
          >
            {headerIcon}
          </Container>
        )}

        {compact && renderCompactContent()}
        {!compact && <Container>{children}</Container>}
      </Modal>
    </React.Fragment>
  );
};

export default CommonModal;

const styles = StyleSheet.create({
  compactContainer: {
    height: 200,
    width: "95%",
    alignSelf: "center",
    borderRadius: 10,
  },
  navButtons: {
    width: "70%",
    alignSelf: "center",
  },
  iconHeader: {
    borderRadius: 50,
    height: 100,
    width: 100,
    alignSelf: "center",
    borderColor: theme.colors.accent,
    borderWidth: 5,
    top: 45,
    zIndex: 1,
  },
});
