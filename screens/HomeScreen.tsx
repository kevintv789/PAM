import { Button, Container, Text } from "../components";
import { Dimensions, Image, Platform, StyleSheet } from "react-native";
import React, { Component } from "react";
import { mockData, theme } from "../shared/constants";

import AddPropertyComponent from "../components/AddPropertyComponent";
import { HomeModel } from "../models";
import Modal from "react-native-modal";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =
  Platform.OS === "ios"
    ? Dimensions.get("window").height
    : require("react-native-extra-dimensions-android").get(
        "REAL_WINDOW_HEIGHT"
      );

export default class HomeScreen extends Component<null, HomeModel.State> {
  constructor(props: any) {
    super(props);

    this.state = {
      user: mockData.User,
      showModal: false,
    };
  }
  renderDefaultMessage = () => {
    const { user } = this.state;
    return (
      <Container
        flex={false}
        center
        middle
        padding={[theme.sizes.padding * 0.2]}
      >
        <Image
          source={require("../assets/icons/keys.png")}
          style={styles.keys}
        />
        <Text offWhite size={30}>
          Hi {user.firstName}!
        </Text>
        <Text
          center
          offWhite
          light
          style={{ width: "90%", paddingTop: theme.sizes.base }}
        >
          Start by adding your first property to unlock new features, and i’ll
          handle the rest!
        </Text>
        <Button
          style={styles.setUpProperty}
          onPress={() => this.setState({ showModal: true })}
        >
          <Text center offWhite size={theme.fontSizes.medium}>
            Set Up Property
          </Text>
        </Button>
      </Container>
    );
  };

  handleCancelModalClicked = () => {
    this.setState({ showModal: false });
  }

  renderAddPropertyModal = () => {
    const { showModal } = this.state;
    return (
      <Container flex={1}>
        <Modal
          isVisible={showModal}
          onBackdropPress={() => this.setState({ showModal: false })}
          // onSwipeComplete={() => this.setState({ showModal: false })}
          // swipeDirection="down"
          hideModalContentWhileAnimating={true}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
          style={styles.modal}
          propagateSwipe={true}
        >
          <AddPropertyComponent handleCancelClicked={() => this.handleCancelModalClicked()}/>
        </Modal>
      </Container>
    );
  };

  render() {
    const { user } = this.state;
    return (
      <Container color="accent">
        <Container middle center flex={0.8}>
          <Text h1 tertiary>
            My Properties
          </Text>
        </Container>
        {!user.properties.length && this.renderDefaultMessage()}
        {this.renderAddPropertyModal()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  keys: {
    width: 130,
    height: 130,
    marginBottom: theme.sizes.padding * 1.5,
  },
  setUpProperty: {
    marginTop: theme.sizes.base * 1.6,
  },
  modal: {
    marginTop: theme.sizes.padding * 2,
    marginLeft: 0,
    marginRight: 0,
  }
});
