import {
  AddImageButton,
  AddressInput,
  Button,
  CheckBox,
  CommonModal,
  Container,
  HeaderDivider,
  ImagesList,
  LoadingIndicator,
  PillsList,
  Text,
  TextInput,
} from "components/common";
import { Dimensions, Image, Keyboard, Modal, StyleSheet } from "react-native";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import React, { Component } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { constants, theme } from "shared";
import { isEqual, property, remove } from "lodash";

import AddImageModalComponent from "../Add Image/addImage.component";
import { AddPropertyModel } from "models";
import CommonService from "services/common.service";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NotesComponent from "components/Modals/Notes/notes.component";
import { PROPERTIES_DOC } from "shared/constants/databaseConsts";
import PropertyService from "services/property.service";
import { connect } from "react-redux";
import { hasErrors } from "shared/Utils";
import { updateProperty } from "reducks/modules/property";

const { width, height } = Dimensions.get("window");

class AddPropertyComponent extends Component<
  AddPropertyModel.Props,
  AddPropertyModel.State
> {
  private propertyService = new PropertyService();
  private commonService = new CommonService();

  constructor(
    props: any,
    private scrollViewRef: React.RefObject<ScrollView>,
    private routePropertyData: any,
    private isEditting: boolean
  ) {
    super(props);

    this.state = {
      propertyTypes: constants.PROPERTY_TYPES_LIST,
      typeSelected: constants.PROPERTY_TYPES.SINGLE_FAM,
      propertyNickName: "",
      streetAddress: "",
      streetAddressResults: [],
      showNotesModal: false,
      notesValue: null,
      errors: [],
      autoFill: true,
      showKeyboard: true,
      isLoading: false,
      showAddImageModal: false,
      images: [],
      imageStorageDownloadUrls: [],
      showWarningModal: false,
      imageToDelete: null,
    };

    this.scrollViewRef = React.createRef();
    this.routePropertyData = this.props.navigation.getParam("propertyData");
    this.isEditting = this.props.navigation.getParam("editting");
  }

  componentDidMount() {
    if (this.isEditting && this.routePropertyData) {
      this.setState({
        streetAddress: this.routePropertyData.propertyAddress,
        autoFill: false,
        propertyNickName: this.routePropertyData.propertyName,
        typeSelected: this.routePropertyData.unitType,
        images: this.routePropertyData.images,
        // TODO -- Add notes later
      });

      this.retrieveImageDownloadUrl(this.routePropertyData.images);
    }
  }

  componentDidUpdate(_: any, prevState: AddPropertyModel.State) {
    const { images } = this.state;

    if (!isEqual(images, prevState.images)) {
      this.updateImageDownloadUrl();
    }
  }

  onDeleteSingleImage = () => {
    const { imageToDelete, images, imageStorageDownloadUrls } = this.state;
    const propertyImages = [...images];
    const imageStorageUrls = [...imageStorageDownloadUrls];

    const removedItem = remove(propertyImages, (p: any) =>
      p.downloadPath != null
        ? p.downloadPath === imageToDelete.uri
        : p.uri === imageToDelete.uri
    );

    remove(imageStorageUrls, (p: any) => p.uri === imageToDelete.uri);

    if (
      this.isEditting &&
      this.routePropertyData &&
      imageToDelete.uri.substring(0, 4) === "http"
    ) {
      this.commonService
        .deleteStorageFile(removedItem)
        .then(() => {
          // update property images with new object
          this.commonService
            .handleUpdateSingleField(
              PROPERTIES_DOC,
              this.routePropertyData.id,
              { images: propertyImages }
            )
            .then(() =>
              this.setState({ imageStorageDownloadUrls: imageStorageUrls })
            );
        })
        .catch((error) =>
          console.log("ERROR cannot remove item: ", removedItem[0].name, error)
        );
    } else {
      this.setState({
        images: propertyImages,
        imageStorageDownloadUrls: imageStorageUrls,
      });
    }
  };

  renderImageSection = () => {
    const { images, imageStorageDownloadUrls } = this.state;
    if (images && images.length === 0) {
      return (
        <AddImageButton
          handleOnPress={() => this.setState({ showAddImageModal: true })}
          caption="Add property images or related documents"
        />
      );
    }

    if (!this.isEditting) {
      return (
        <Container style={{ flex: 1 }}>
          <ImagesList
            images={images}
            showAddImageModal={() => this.setState({ showAddImageModal: true })}
            caption="Add property images or related documents"
            isCached={false}
            onDeleteImage={(image: any) =>
              this.setState({ showWarningModal: true, imageToDelete: image })
            }
          />
        </Container>
      );
    } else {
      if (imageStorageDownloadUrls.length > 0)
        return (
          <Container style={{ flex: 1 }}>
            <ImagesList
              images={imageStorageDownloadUrls}
              showAddImageModal={() =>
                this.setState({ showAddImageModal: true })
              }
              caption="Add property images or related documents"
              onDeleteImage={(image: any) =>
                this.setState({ showWarningModal: true, imageToDelete: image })
              }
            />
          </Container>
        );
    }
  };

  retrieveImageDownloadUrl = async (images: any[]) => {
    if (images && images.length > 0) {
      const data = await (
        await this.commonService.getImageDownloadUri(images)
      ).filter((i: any) => i.uri != null);

      if (data && data.length > 0) {
        this.setState({ imageStorageDownloadUrls: data });
      }
    }
  };

  updateImageDownloadUrl = () => {
    const { images, imageStorageDownloadUrls } = this.state;

    if (images && images.length > imageStorageDownloadUrls.length) {
      // If the regular images state is bigger than the loaded URLs, then we know
      // there are additional images being added during edit
      const tempDownloadedUrls = [...imageStorageDownloadUrls];

      images.forEach((image, index) => {
        if (index === tempDownloadedUrls.length) {
          tempDownloadedUrls.push({ uri: image.uri });
        }
      });

      this.setState({ imageStorageDownloadUrls: tempDownloadedUrls });
    }
  };

  renderPropertyTypeSelection = () => {
    const { propertyTypes } = this.state;
    return (
      <Container center>
        <HeaderDivider title="Property Type" style={styles.divider} />
        <PillsList
          data={propertyTypes}
          defaultSelected={
            this.isEditting
              ? this.routePropertyData.unitType
              : constants.PROPERTY_TYPES.SINGLE_FAM
          }
          handlePillSelected={(selected: string) =>
            this.setState({ typeSelected: selected })
          }
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
   */
  handleSaveProperty = () => {
    const { navigation } = this.props;
    const {
      typeSelected,
      propertyNickName,
      streetAddress,
      images,
    } = this.state;

    const errors = [];

    if (!streetAddress.length) {
      errors.push("streetAddress");
    }

    const colorArray = ["#F2CC8F", "#8ECAE6", "#E29578", "#81B29A"];

    const payload = {
      propertyName: propertyNickName,
      propertyAddress: streetAddress,
      notesId: "",
      tenants: [],
      unitType: typeSelected,
      color: colorArray[Math.floor(Math.random() * 4)],
      createdOn: this.isEditting
        ? this.routePropertyData.createdOn
        : new Date(),
    };

    if (!errors.length) {
      if (!this.isEditting) {
        const propertiesCollection = this.commonService.createNewDocId(
          PROPERTIES_DOC
        );

        this.commonService
          .handleCreateWithImages(payload, propertiesCollection, images)
          .then(() => {
            const propertyId = propertiesCollection.id;

            // After creating property, set its ID onto the user document
            this.propertyService
              .updateUserDataWithProperty(propertyId)
              .then(() => {
                // Upload any images if there are any
                if (images && images.length > 0) {
                  this.uploadImages(propertyId);
                } else {
                  navigation.goBack();
                  navigation.navigate("AddPropertyDoneModal");
                }
              })
              .catch((error) =>
                console.log(
                  "ERROR failed to update property ID onto the user doc",
                  error
                )
              );
          })
          .catch((error: any) => console.log(error))
          .finally(() => {
            if (!images || images.length === 0) {
              this.setState({ isLoading: false });
            }
          });
      } else {
        const { id, notesId, color, tenants } = this.routePropertyData;
        payload.notesId = notesId;
        payload.color = color;
        payload.tenants = tenants;

        this.commonService
          .handleUpdateWithImages(
            payload,
            id,
            PROPERTIES_DOC,
            images,
            "property"
          )
          .then(() => this.uploadImages(id))
          .catch((error) => console.log("ERROR in updating property: ", error));
      }
    }

    this.setState({ errors, isLoading: true });
  };

  uploadImages = (propertyId: string) => {
    const { images } = this.state;
    const { navigation } = this.props;

    this.commonService
      .handleUploadImages(images, propertyId, "property")
      .then(() => {
        setTimeout(() => {
          navigation.goBack();

          if (!this.isEditting) {
            navigation.navigate("AddPropertyDoneModal");
          }
        }, 2000);
      })
      .catch((error: any) =>
        console.log("ERROR failed to upload images", error)
      )
      .finally(() =>
        setTimeout(() => this.setState({ isLoading: false }), 3500)
      );
  };

  renderNavigationButtons = () => {
    const { navigation } = this.props;
    const { isLoading } = this.state;

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
          onPress={() => navigation.goBack()}
        >
          <Text offWhite center semibold>
            Cancel
          </Text>
        </Button>
        <Button
          color="secondary"
          style={styles.navigationButtons}
          onPress={() => this.handleSaveProperty()}
          disabled={isLoading}
        >
          <Text offWhite center semibold style={{ alignSelf: "center" }}>
            {!isLoading && "Next"}
            {isLoading && (
              <LoadingIndicator size="small" color={theme.colors.offWhite} />
            )}
          </Text>
        </Button>
      </Container>
    );
  };

  renderPropertyDetails = () => {
    const {
      propertyNickName,
      notesValue,
      errors,
      streetAddress,
      autoFill,
    } = this.state;

    return (
      <Container center>
        <HeaderDivider title="Property Details" style={styles.divider} />

        {!autoFill && (
          <TextInput
            label="Street Address *"
            style={[styles.input, hasErrors("streetAddress", errors)]}
            value={streetAddress}
            error={hasErrors("streetAddress", errors)}
            onChangeText={(streetAddress: string) =>
              this.setState({
                streetAddress,
                errors: errors.filter((e) => e !== "streetAddress"),
              })
            }
          />
        )}

        {autoFill && (
          <AddressInput
            handleSelect={(streetAddress: string) =>
              this.setState({
                streetAddress,
                showKeyboard: false,
                errors: errors.filter((e) => e !== "streetAddress"),
              })
            }
            handleResults={(
              text: string,
              streetAddressResults: Array<string>
            ) => {
              this.setState({
                streetAddressResults,
                streetAddress: text.length > 0 ? streetAddress : "",
              });
            }}
            onFocus={() => this.setState({ showKeyboard: true })}
            error={hasErrors("streetAddress", errors)}
            textInputStyle={hasErrors("streetAddress", errors)}
          />
        )}
        <CheckBox
          rightLabel="Autofill"
          defaultChecked={!this.isEditting}
          handleCheck={(checked: boolean) =>
            this.setState({ autoFill: !checked })
          }
          touchAreaStyle={styles.autoFill}
        />
        <TextInput
          label="Property Nickname"
          style={styles.input}
          value={propertyNickName}
          onFocus={() => this.setState({ showKeyboard: true })}
          onChangeText={(propertyNickName: string) =>
            this.setState({
              propertyNickName,
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

  scrollToBottom = () => {
    if (this.scrollViewRef) {
      this.scrollViewRef.current?.scrollTo({
        x: 0,
        y: 300,
        animated: true,
      });
    }
  };

  render() {
    const {
      streetAddressResults,
      autoFill,
      showKeyboard,
      showAddImageModal,
      images,
      showWarningModal,
    } = this.state;

    if (streetAddressResults.length > 0 && autoFill) {
      this.scrollToBottom();
    }

    if (!showKeyboard) {
      Keyboard.dismiss();
    }

    return (
      <React.Fragment>
        <ScrollView
          keyboardShouldPersistTaps={"handled"}
          ref={this.scrollViewRef}
        >
          <Container center color="accent">
            <KeyboardAwareScrollView
              contentContainerStyle={{ flex: 1 }}
              scrollEnabled={false}
              keyboardShouldPersistTaps={"handled"}
            >
              <Text
                h1
                offWhite
                center
                style={{ paddingTop: theme.sizes.padding }}
              >
                {this.isEditting ? "Edit Property" : "Add Property"}
              </Text>
              {this.renderImageSection()}
              {this.renderPropertyTypeSelection()}
              {this.renderPropertyDetails()}
              {this.renderNavigationButtons()}
              {this.renderNotesModal()}
            </KeyboardAwareScrollView>
          </Container>
        </ScrollView>
        <AddImageModalComponent
          visible={showAddImageModal}
          hideModal={() => this.setState({ showAddImageModal: false })}
          onSelectImages={(data: any[]) => {
            const tempImages = [...images];
            data.forEach((image) => tempImages.push(image));
            this.setState({ images: tempImages });
          }}
          onCaptureImages={(data: any[]) => {
            const tempImages = [...images];
            data.forEach((image) => tempImages.push(image));
            this.setState({ images: tempImages });
          }}
        />
        <CommonModal
          visible={showWarningModal}
          compact
          descriptorText={`Are you sure you want to delete this image?\n\nYou can't undo this action.`}
          hideModal={() => this.setState({ showWarningModal: false })}
          onSubmit={() => this.onDeleteSingleImage()}
          headerIcon={
            <FontAwesome
              name="warning"
              size={36}
              color={theme.colors.offWhite}
            />
          }
          headerIconBackground={theme.colors.primary}
          title="Confirm"
        />
      </React.Fragment>
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
  autoFill: {
    paddingRight: theme.sizes.padding,
    justifyContent: "flex-end",
    marginBottom: -10,
  },
});

const mapDispatchToProps = {
  updateProperty,
};

export default connect(null, mapDispatchToProps)(AddPropertyComponent);
