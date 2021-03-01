import {
  AddressInput,
  Button,
  Container,
  HeaderDivider,
  Pills,
  Text,
  TextInput,
} from "..";
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
} from "react-native";
import React, { Component } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { constants, mockData, theme } from "../../shared/constants";

import { AddPropertyModel } from "../../models";
import { Entypo } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { width, height } = Dimensions.get("window");

export default class AddPropertyComponent extends Component<
  AddPropertyModel.Props,
  AddPropertyModel.State
> {
  constructor(props: any) {
    super(props);

    this.state = {
      propertyTypes: mockData.PropertyTypes,
      typeSelected: "",
      propertyNickName: "",
      streetAddress: "",
      streetAddressResults: [],
      showKeyboard: true,
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
              source={require("../../assets/icons/camera.png")}
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
        imagePath = require("../../assets/icons/prop_type_apartment.png");
        break;
      case constants.PROPERTY_TYPES.SINGLE_FAM:
        imagePath = require("../../assets/icons/prop_type_sfh.png");
        break;
      case constants.PROPERTY_TYPES.TOWNHOUSE:
        imagePath = require("../../assets/icons/prop_type_townhouse.png");
        newWidth = 50;
        newHeight = 50;
        break;
      case constants.PROPERTY_TYPES.MULTI_FAM:
        imagePath = require("../../assets/icons/prop_type_multiplex.png");
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

  renderNavigationButtons = () => {
    const { handleCancelClicked, handleNextClicked } = this.props;

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
          onPress={() => handleNextClicked()}
        >
          <Text offWhite center semibold>
            Next
          </Text>
        </Button>
      </Container>
    );
  };

  renderPropertyDetails = () => {
    const { propertyNickName, streetAddress, showKeyboard } = this.state;

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
        <Button style={styles.addNotesButton}>
          <Text
            gray
            size={theme.fontSizes.medium}
            style={styles.addNotesButtonText}
          >
            Add Notes
          </Text>
          <Entypo
            name="chevron-small-right"
            size={26}
            color={theme.colors.gray}
            style={styles.notesChevron}
          />
        </Button>
      </Container>
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
    width: "87%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.offWhite,
  },
  addNotesButtonText: {
    paddingLeft: 4,
  },
  notesChevron: {
    position: "absolute",
    right: 0,
    top: theme.sizes.base,
  },
});
