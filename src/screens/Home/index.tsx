import { Button, Container, Text } from "components/common";
import { Image, Modal, StyleSheet } from "react-native";
import React, { Component } from "react";
import { mockData, theme } from "shared";

import AddPropertyComponent from "components/Modals/AddProperty/addProperty.component";
import AddPropertyDoneComponent from "components/Modals/AddPropertyDone/addPropertyDone.component";
import { HomeModel } from "models";
import PropertyComponent from "components/Property/property.component";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { getUser } from "reducks/modules/user";

class HomeScreen extends Component<HomeModel.Props, HomeModel.State> {
  constructor(props: any) {
    super(props);

    this.state = {
      showModal: false,
      showDoneModal: false,
    };
  }

  componentDidMount() {
    const { getUser } = this.props;
    getUser(mockData.User);
  }

  renderDefaultMessage = () => {
    const { userData } = this.props;
    return (
      <Container
        flex={false}
        center
        middle
        padding={[theme.sizes.padding * 0.2]}
      >
        <Image source={require("assets/icons/keys.png")} style={styles.keys} />
        <Text offWhite size={30}>
          Hi {userData.firstName}!
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

  renderProperties = () => {
    const { userData } = this.props;

    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: theme.sizes.padding,
        }}
        nestedScrollEnabled
        style={styles.propertiesScrollView}
        keyboardShouldPersistTaps={"handled"}
        showsVerticalScrollIndicator={false}
      >
        <Container center>
          {userData.properties.map((property: any) => {
            return (
              <Container
                key={property.id}
                // onLayout={(event) => {}} // TODO -- perhaps use onlayout to calculate the new position for scrollTo
              >
                <PropertyComponent propertyData={property} />
              </Container>
            );
          })}
        </Container>
      </ScrollView>
    );
  };

  renderContent = () => {
    const { userData } = this.props;

    return (
      <Container color="accent" style={{}}>
        <Container
          middle
          center
          flex={false}
          style={{ marginTop: theme.sizes.padding * 2.5 }}
          row
        >
          <Text h1 tertiary>
            My Properties
          </Text>
          <Button
            color="transparent"
            style={styles.addPropButton}
            onPress={() => this.setState({ showModal: true })}
          >
            <Image
              source={require("assets/icons/plus.png")}
              style={{ width: 29, height: 29 }}
            />
          </Button>
        </Container>
        {!userData.properties.length
          ? this.renderDefaultMessage()
          : this.renderProperties()}
        {this.renderAddPropertyModal()}
        {this.renderAddPropertyDoneModal()}
      </Container>
    );
  };

  render() {
    const { userData } = this.props;
    return userData ? (
      this.renderContent()
    ) : (
      <Container>
        <Text>No Data</Text>
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
  propertiesScrollView: {
    paddingTop: theme.sizes.padding,
  },
  addPropButton: {
    position: "absolute",
    right: 20,
    top: -5,
    width: 29,
    height: 29,
  },
});

const mapStateToProps = (state: any) => {
  return { userData: state.userState.user };
};

const mapDispatchToProps = {
  getUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
