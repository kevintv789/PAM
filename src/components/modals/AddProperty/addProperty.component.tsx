import {
  AddressInput,
  Button,
  Container,
  HeaderDivider,
  Pills,
  Text,
  TextInput,
} from "components/common";
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Modal,
  StyleSheet,
} from "react-native";
import React, { Component } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { constants, theme } from "shared";

import { AddPropertyModel } from "models";
import { Entypo } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NotesComponent from "components/Modals/Notes/notes.component";
import { addProperty } from "reducks/modules/property";
import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");

class AddPropertyComponent extends Component<
  AddPropertyModel.Props,
  AddPropertyModel.State
> {
  constructor(props: any) {
    super(props);

    this.state = {
      propertyTypes: constants.PROPERTY_TYPES_LIST,
      typeSelected: "",
      propertyNickName: "",
      streetAddress: "",
      streetAddressResults: [],
      showKeyboard: true,
      showNotesModal: false,
      notesValue: null,
    };
  }

  renderImageSection = () => {
    return (
      <Container center>
        <TouchableOpacity>
          <Container
            style={styles.imageContainer}
            margin={[theme.sizes.padding]}
            flex={false}
            center
            middle
          >
            <Image
              source={require("assets/icons/camera.png")}
              style={styles.cameraImage}
            />
          </Container>
        </TouchableOpacity>

        <Text offWhite light>
          Add property images or related documents
        </Text>
      </Container>
    );
  };

  renderPropertyTypeSelection = () => {
    const { propertyTypes, typeSelected } = this.state;

    return (
      <Container center margin={[theme.sizes.padding, 0, 0, 0]}>
        <HeaderDivider title="Property Type" style={styles.divider} />
        <FlatList
          keyboardShouldPersistTaps={"handled"}
          data={propertyTypes}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pills
              label={item}
              selectable
              containerStyle={{
                borderColor:
                  item === typeSelected
                    ? theme.colors.secondary
                    : theme.colors.offWhite,
              }}
              labelStyle={{
                color:
                  item === typeSelected
                    ? theme.colors.secondary
                    : theme.colors.offWhite,
              }}
              handlePillSelected={(selected: string) =>
                this.setState({ typeSelected: selected })
              }
            />
          )}
          keyExtractor={(item: any) => item}
          snapToAlignment="center"
          style={styles.propertyList}
        />

        {this.renderPropertyTypeIcons()}
      </Container>
    );
  };

  renderPropertyTypeIcons = () => {
    const { typeSelected } = this.state;
    let imagePath = "";
    let newWidth, newHeight;

    switch (typeSelected) {
      case constants.PROPERTY_TYPES.APT_CONDO:
        imagePath = require("assets/icons/prop_type_apartment.png");
        break;
      case constants.PROPERTY_TYPES.SINGLE_FAM:
        imagePath = require("assets/icons/prop_type_sfh.png");
        break;
      case constants.PROPERTY_TYPES.TOWNHOUSE:
        imagePath = require("assets/icons/prop_type_townhouse.png");
        newWidth = 50;
        newHeight = 50;
        break;
      case constants.PROPERTY_TYPES.MULTI_FAM:
        imagePath = require("assets/icons/prop_type_multiplex.png");
        newWidth = 50;
        newHeight = 50;
        break;
      default:
        break;
    }
    if (imagePath !== "") {
      return (
        <Container
          center
          middle
          margin={[theme.sizes.padding]}
          style={styles.propertyImageContainer}
        >
          <Image
            source={imagePath}
            style={{
              width: newWidth ? newWidth : 30,
              height: newHeight ? newHeight : 30,
            }}
          />
        </Container>
      );
    }
  };

  /**
   * This function combines every state together into a payload to send back to the backend
   *
   * Currently, the ID is auto generated using a random number from 0 to 10000, this will be
   * completely rewritten when the API is built out
   * 
   * TODO -- Will need to add error handling in the future
   */
  handleSaveProperty = () => {
    const { handleNextClicked, addProperty } = this.props;
    const { typeSelected, propertyNickName, streetAddress } = this.state;

    const colorArray = ["#F2CC8F", "#8ECAE6", "#E29578", "#81B29A"];

    const payload = {
      id: Math.floor(Math.random() * 10000),
      propertyName: propertyNickName,
      propertyAddress: streetAddress,
      notesId: undefined,
      tenants: [],
      image: null,
      unitType: typeSelected,
      color: colorArray[Math.floor(Math.random() * 4)],
    };

    addProperty(payload);

    // Calls parent component to show the Done Modal
    handleNextClicked();
  };

  renderNavigationButtons = () => {
    const { handleCancelClicked } = this.props;

    return (
      <Container
        row
        space="between"
        flex={false}
        padding={[
          theme.sizes.padding / 1.3,
          theme.sizes.padding / 1.3,
          0,
          theme.sizes.padding / 1.3,
        ]}
        style={{ height: height / 4.8 }}
      >
        <Button
          color="red"
          style={styles.navigationButtons}
          onPress={() => handleCancelClicked()}
        >
          <Text offWhite center semibold>
            Cancel
          </Text>
        </Button>
        <Button
          color="secondary"
          style={styles.navigationButtons}
          onPress={() => this.handleSaveProperty()}
        >
          <Text offWhite center semibold>
            Next
          </Text>
        </Button>
      </Container>
    );
  };

  renderPropertyDetails = () => {
    const { propertyNickName, notesValue } = this.state;

    return (
      <Container center>
        <HeaderDivider title="Property Details" style={styles.divider} />

        {/* BUG -- Implement Auto scroll when lists are popped up */}
        <AddressInput
          handleSelect={(streetAddress: string) =>
            this.setState({ streetAddress, showKeyboard: false })
          }
          handleResults={(streetAddressResults: Array<string>) => {
            this.setState({
              streetAddressResults,
              // showKeyboard: streetAddressResults.length > 0 ? false : true,
            });
          }}
          onFocus={() =>
            this.setState({ streetAddressResults: [], showKeyboard: true })
          }
        />
        <TextInput
          label="Property Nickname"
          style={styles.input}
          value={propertyNickName}
          onChangeText={(propertyNickName: string) =>
            this.setState({
              propertyNickName,
              showKeyboard: true,
            })
          }
        />
        <TouchableOpacity
          style={styles.addNotesButton}
          onPress={() => this.setState({ showNotesModal: true })}
        >
          <TextInput
            gray
            size={theme.fontSizes.medium}
            style={styles.addNotesButtonText}
            editable={false}
            label="Add Notes"
            value={notesValue ? notesValue.text : ""}
            numberOfLines={1}
          />
          <Entypo
            name="chevron-small-right"
            size={26}
            color={theme.colors.gray}
            style={styles.notesChevron}
          />
        </TouchableOpacity>
      </Container>
    );
  };

  handleNotesSave = (notesValue: string) => {
    this.setState({ showNotesModal: false, notesValue });
  };

  renderNotesModal = () => {
    const { showNotesModal } = this.state;

    return (
      <Modal
        visible={showNotesModal}
        animationType="fade"
        onDismiss={() => this.setState({ showNotesModal: false })}
      >
        <NotesComponent
          label="New Property"
          handleBackClick={(notesValue: string) =>
            this.handleNotesSave(notesValue)
          }
        />
      </Modal>
    );
  };

  render() {
    const { showKeyboard } = this.state;

    if (!showKeyboard) {
      Keyboard.dismiss();
    }

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1 }}
        scrollEnabled={true}
        keyboardShouldPersistTaps={"handled"}
        enableAutomaticScroll={true}
      >
        <Container center color="accent">
          <ScrollView keyboardShouldPersistTaps={"handled"}>
            <Text
              h1
              offWhite
              center
              style={{ paddingTop: theme.sizes.padding }}
            >
              Add Property
            </Text>
            {this.renderImageSection()}
            {this.renderPropertyTypeSelection()}
            {this.renderPropertyDetails()}
            {this.renderNavigationButtons()}
            {this.renderNotesModal()}
          </ScrollView>
        </Container>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: theme.colors.offWhite,
    borderRadius: 100,
    width: 90,
    height: 90,
  },
  cameraImage: {
    width: 61,
    height: 61,
  },
  divider: {
    width,
  },
  propertyList: {
    marginTop: theme.sizes.padding / 2,
    marginBottom: theme.sizes.padding,
    paddingLeft: theme.sizes.padding / 3,
  },
  propertyImageContainer: {
    backgroundColor: theme.colors.secondary,
    width: 72,
    height: 72,
    borderRadius: 50,
    shadowColor: theme.colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    marginTop: -theme.sizes.padding / 3,
  },
  navigationButtons: {
    width: theme.sizes.padding * 5.5,
  },
  input: {
    width: width * 0.87,
  },
  addNotesButton: {
    backgroundColor: "transparent",
    minWidth: "87%",
    maxWidth: "87%",
    overflow: "hidden",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.offWhite,
    height: 63,
  },
  addNotesButtonText: {
    maxWidth: "93%",
    borderBottomWidth: 0,
  },
  notesChevron: {
    position: "absolute",
    right: 0,
    top: theme.sizes.base * 1.4,
  },
});

const mapDispatchToProps = {
  addProperty,
};

export default connect(null, mapDispatchToProps)(AddPropertyComponent);
