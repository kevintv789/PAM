import { Button, Container, Text } from "../components";
import { Image, Modal, StyleSheet } from "react-native";
import React, { Component } from "react";
import { mockData, theme } from "../shared/constants";

import AddPropertyComponent from "../components/modals/AddPropertyComponent";
import AddPropertyDoneComponent from "../components/modals/AddPropertyDoneComponent";
import { HomeModel } from "../models";

export default class HomeScreen extends Component<null, HomeModel.State> {
  constructor(props: any) {
    super(props);

    this.state = {
      user: mockData.User,
      showModal: false,
      showDoneModal: false,
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
  };

  handleNextClicked = () => {
    this.setState({ showModal: false, showDoneModal: true });
  };

  renderAddPropertyModal = () => {
    const { showModal } = this.state;
    return (
      <Container flex={1}>
        <Modal
          visible={showModal}
          presentationStyle="formSheet"
          animationType="slide"
          onDismiss={() => this.setState({ showModal: false })}
        >
          <AddPropertyComponent
            handleCancelClicked={() => this.handleCancelModalClicked()}
            handleNextClicked={() => this.handleNextClicked()}
          />
        </Modal>
      </Container>
    );
  };

  renderAddPropertyDoneModal = () => {
    const { showDoneModal } = this.state;
    return (
      <Container>
        <Modal
          visible={showDoneModal}
          presentationStyle="pageSheet"
          animationType="fade"
          onDismiss={() => this.setState({ showDoneModal: false })}
        >
          <AddPropertyDoneComponent
            handleFinishedClick={() => this.setState({ showDoneModal: false })}
          />
        </Modal>
      </Container>
    );
  };

  render() {
    const { user } = this.state;
    return (
      <Container color="accent">
        <Container middle center flex={1.5}>
          <Text h1 tertiary>
            My Properties
          </Text>
        </Container>
        {!user.properties.length && this.renderDefaultMessage()}
        {this.renderAddPropertyModal()}
        {this.renderAddPropertyDoneModal()}
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
});