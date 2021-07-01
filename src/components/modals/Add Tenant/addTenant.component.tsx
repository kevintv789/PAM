import {
  AddImageButton,
  Button,
  CommonModal,
  Container,
  Counter,
  CurrencyInput,
  HeaderDivider,
  ImagesList,
  LoadingIndicator,
  PillsList,
  Text,
  TextInput,
  Toggle,
} from "components/common";
import { Dimensions, Modal, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { IMAGES_PARENT_FOLDER, PROPERTY_FINANCES_TYPE } from "shared/constants/constants";
import { PROPERTY_FINANCES_DOC, TENANTS_DOC } from "shared/constants/databaseConsts";
import React, { Component } from "react";
import { constants, theme } from "shared";
import { findIndex, isEqual } from "lodash";
import { formatMobileNumber, hasErrors, updateArrayPosition } from "shared/Utils";

import AddImageModalComponent from "../Add Image/addImage.component";
import { AddTenantModel } from "models";
import CommonService from "services/common.service";
import { Entypo } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NotesComponent from "components/Modals/Notes/notes.component";
import PropertyService from "services/property.service";
import { TouchableOpacity as ToucableOpacityRNGH } from "react-native-gesture-handler";
import { getNextPaymentDate } from "shared/Utils";
import moment from "moment";

const { width, height } = Dimensions.get("window");
const date = Date.now();

class AddTenantComponent extends Component<AddTenantModel.Props, AddTenantModel.State> {
  private scrollViewRef: any;
  private isEditting: boolean = false;
  private tenantInfo: any;
  private propertyService = new PropertyService();
  private commonService = new CommonService();

  constructor(props: AddTenantModel.Props) {
    super(props);

    this.state = {
      primaryTenantName: "",
      phone: "",
      email: "",
      leaseType: constants.LEASE_TYPE.FIXED_TERM,
      leaseStartDate: moment(new Date(date), moment.ISO_8601).format("MM/DD/YYYY"),
      leaseEndDate: "",
      rentPaidPeriod: "Monthly",
      rent: 0,
      deposit: 0,
      totalOccupants: 1,
      notes: null,
      showNotesModal: false,
      lastPaymentDate: moment(new Date(date), moment.ISO_8601).format("MM/DD/YYYY"),
      hasTenantPaidFirstRent: false,
      errors: [],
      isLoading: false,
      showAddImageModal: false,
      images: [],
      showWarningModal: false,
      imageToDelete: null,
    };

    this.scrollViewRef = React.createRef();
    const { navigation } = this.props;
    this.isEditting = navigation.getParam("isEditting");
    this.tenantInfo = navigation.getParam("tenantData");
  }

  componentDidMount() {
    // Sets default state on edit of an existing tenant
    if (this.isEditting && this.tenantInfo) {
      this.setState({
        primaryTenantName: this.tenantInfo.name,
        phone: formatMobileNumber(this.tenantInfo.phone, ""),
        email: this.tenantInfo.email,
        leaseType: this.tenantInfo.leaseType,
        leaseStartDate: this.tenantInfo.leaseStartDate,
        leaseEndDate: moment(this.tenantInfo.leaseEndDate).isValid() ? this.tenantInfo.leaseEndDate : "",
        rentPaidPeriod: this.tenantInfo.recurringPaymentType,
        rent: this.tenantInfo.rent,
        deposit: this.tenantInfo.securityDeposit,
        totalOccupants: this.tenantInfo.totalOccupants,
        lastPaymentDate: this.tenantInfo.lastPaymentDate,
        hasTenantPaidFirstRent: this.tenantInfo.lastPaymentDate != null,
        images: this.tenantInfo.images,
        notes: this.tenantInfo.notes,
      });
    }
  }

  componentDidUpdate(_: any, prevState: AddTenantModel.State) {
    const { images } = this.state;

    if (!isEqual(images, prevState.images)) {
      this.updateImagesWithDownloadPath();
    }
  }

  handleAddTenant = () => {
    const { navigation } = this.props;
    const {
      primaryTenantName,
      phone,
      email,
      leaseType,
      leaseStartDate,
      leaseEndDate,
      deposit,
      rentPaidPeriod,
      totalOccupants,
      lastPaymentDate,
      hasTenantPaidFirstRent,
      rent,
      images,
      notes,
    } = this.state;

    const errors = [];
    const propertyData = navigation.getParam("propertyData");

    if (!primaryTenantName.length) {
      errors.push("tenantName");
    }

    const tenantPayload = {
      id: this.isEditting ? this.tenantInfo.id : "",
      propertyId: this.isEditting ? this.tenantInfo.propertyId : propertyData.id,
      name: primaryTenantName.trim(),
      phone,
      email,
      leaseType,
      leaseStartDate,
      leaseEndDate,
      securityDeposit: deposit,
      recurringPaymentType: rentPaidPeriod, // monthly, quarterly, annually, etc. this will be used to calculate next expected payment
      totalOccupants,
      rent,
      collectionDay: 1, // Day of the month that rent is collected. if 0 or null, then default to the lease start date day
      lastPaymentDate: hasTenantPaidFirstRent ? lastPaymentDate : null,
      nextPaymentDate: this.isEditting
        ? this.tenantInfo.nextPaymentDate
        : getNextPaymentDate(leaseStartDate, rentPaidPeriod),
      createdOn: this.isEditting ? this.tenantInfo.createdOn : new Date(),
      images,
      notes,
    };

    if (!errors.length) {
      if (!this.isEditting) {
        const tenantDocRef = this.commonService.createNewDocId(TENANTS_DOC);

        if (images.length > 0) {
          // handle create with images
          this.handleCreateWithImages(tenantPayload, tenantDocRef, tenantPayload.propertyId);
        } else {
          // handle create regular
          this.handleRegularCreate(tenantPayload, tenantDocRef);
        }
      } else {
        if (images.length > 0) {
          // handle update with images
          this.handleUpdateWithImages(tenantPayload, this.tenantInfo, tenantPayload.propertyId);
        } else {
          // handle update regular
          this.handleUpdateRegular(tenantPayload);
        }
      }
    } else {
      this.scrollViewRef.current?.scrollTo({ x: 0, y: 10, animated: true });
    }

    this.setState({ errors, isLoading: true });
  };

  handleRegularCreate = (tenantPayload: any, tenantDocRef: any) => {
    const { navigation } = this.props;

    this.commonService
      .handleCreate(tenantPayload, tenantDocRef)
      .then(() => {
        // Update property on the backend with the new tenant ID
        this.propertyService.addTenantIdToProperty(tenantDocRef.id, tenantPayload.propertyId);

        // Add tenant's income/rent to finances
        if (
          tenantPayload.lastPaymentDate &&
          moment(new Date(tenantPayload.lastPaymentDate), moment.ISO_8601).isValid() &&
          tenantPayload.lastPaymentDate
        ) {
          this.addToPropertyFinances(tenantPayload);
        } else {
          navigation.goBack();
        }
      })
      .catch((error: any) => console.log("ERROR in creating a new tenant: ", error))
      .finally(() => this.setState({ isLoading: false }));
  };

  handleCreateWithImages = (payload: any, docRef: any, propertyId: any) => {
    const { images } = this.state;

    if (images) {
      this.commonService
        .handleCreateWithImages(payload, docRef, images, IMAGES_PARENT_FOLDER.TENANTS, propertyId)
        .then(() => {
          // Update property on the backend with the new tenant ID
          this.propertyService.addTenantIdToProperty(docRef.id, payload.propertyId);

          // Add tenant's income/rent to finances
          if (
            payload.lastPaymentDate &&
            moment(new Date(payload.lastPaymentDate), moment.ISO_8601).isValid() &&
            payload.lastPaymentDate
          ) {
            this.addToPropertyFinances(payload);
          }

          this.uploadImages(docRef.id, propertyId);
        })
        .catch((error: any) => console.log("ERROR in updating a new tenant object: ", error));
    }
  };

  handleUpdateRegular = (tenantPayload: any) => {
    const { navigation } = this.props;

    this.commonService
      .handleUpdate(tenantPayload, tenantPayload.id, TENANTS_DOC)
      .then(() => navigation.goBack())
      .catch((error: any) => console.log("ERROR in updating tenant: ", error))
      .finally(() => this.setState({ isLoading: false }));
  };

  handleUpdateWithImages = (payload: any, reportData: any, propertyId: any) => {
    const { images } = this.state;

    if (images) {
      this.commonService
        .handleUpdateWithImages(payload, reportData.id, TENANTS_DOC, images, IMAGES_PARENT_FOLDER.TENANTS, propertyId)
        .then(() => this.uploadImages(reportData.id, propertyId))
        .catch((error) => console.log("ERROR in updating tenant with images: ", error));
    }
  };

  uploadImages = (id: string, propertyId: any) => {
    const { images } = this.state;
    const { navigation } = this.props;

    if (images) {
      this.commonService
        .handleUploadImages(images, id, IMAGES_PARENT_FOLDER.TENANTS, propertyId)
        .then(() => navigation.goBack())
        .catch((error) => console.log("ERROR in uploading tenant images, ", error))
        .finally(() => this.setState({ isLoading: false }));
    }
  };

  addToPropertyFinances = (payload: any) => {
    const { navigation } = this.props;

    const financePayload = {
      amount: payload.rent,
      status: constants.EXPENSE_STATUS_TYPE.PAID,
      description: "",
      paidOn: payload.lastPaymentDate,
      paymentDue: "",
      recurring: null,
      additionalNotes: "",
      image: null,
      propertyId: payload.propertyId,
      name: payload.name,
      type: PROPERTY_FINANCES_TYPE.INCOME,
    };

    const collectionRef = this.commonService.createNewDocId(PROPERTY_FINANCES_DOC);

    this.commonService
      .handleCreate(financePayload, collectionRef)
      .then(() => navigation.goBack())
      .catch((error: any) => console.log("ERROR in creating a new finance object: ", error));
  };

  updateImagesWithDownloadPath = async () => {
    const images = this.tenantInfo && this.tenantInfo.images ? this.tenantInfo.images : [];
    let newImages: any[] = [...images];
    let shouldUpdate = false;

    if (images.length > 0 && this.tenantInfo) {
      // retrieve download path from storage and update image array with download path
      await Promise.all(
        images.map(async (image: any, index: number) => {
          if (image.downloadPath === "" || image.downloadPath == null) {
            const url = await this.commonService.getSingleImageDownloadPath(image);

            const obj = {
              downloadPath: url,
              name: image.name,
              uri: image.uri,
            };

            newImages[index] = obj;
            shouldUpdate = true;
          }
        })
      );

      if (shouldUpdate) {
        // update backend with new image array
        this.commonService.handleUpdateSingleField(TENANTS_DOC, this.tenantInfo.id, { images: newImages });
      }
    }
  };

  renderImageSection = () => {
    const { images } = this.state;

    if (images.length > 0) {
      const imagesToMap = [...images];

      const uris = imagesToMap.map((image) => {
        let obj = {};
        if (image.downloadPath !== "" && image.downloadPath != null) {
          obj["uri"] = image.downloadPath;
        } else {
          obj["uri"] = image.uri;
        }
        return obj;
      });

      const nonCachedUri = uris.filter((img: any) => img.uri.includes("file"));

      return (
        <Container style={{ flex: 1 }} margin={[-10, 0, 14]}>
          <ImagesList
            isCached={nonCachedUri.length === 0} // caches image if there are only firebase url's available, otherwise don't cache b/c it doesn't work with source files
            images={uris}
            iconHorizontalPadding={14}
            showAddImageModal={() => this.setState({ showAddImageModal: true })}
            onDeleteImage={(image: any) => this.setState({ showWarningModal: true, imageToDelete: image })}
            onDragEnd={(data: any[]) => {
              this.updateImagePosition(data);
            }}
          />
        </Container>
      );
    }

    return (
      <AddImageButton
        handleOnPress={() => this.setState({ showAddImageModal: true })}
        caption="Add lease related photos or documents"
      />
    );
  };

  renderTenantInfo = () => {
    const { primaryTenantName, phone, email, errors } = this.state;

    return (
      <Container center flex={false}>
        <TextInput
          required
          error={hasErrors("tenantName", errors)}
          label="Name"
          value={primaryTenantName}
          onChangeText={(primaryTenantName: string) =>
            this.setState({
              primaryTenantName,
              errors: errors.filter((e) => e !== "tenantName"),
            })
          }
          style={[styles.input, hasErrors("tenantName", errors)]}
        />
        <TextInput
          keyboardType="phone-pad"
          label="Phone"
          value={phone}
          onChangeText={(phone: string) =>
            this.setState<any>((prevState) => ({
              phone: formatMobileNumber(phone, prevState.phone),
            }))
          }
          style={styles.input}
        />
        <TextInput
          keyboardType="email-address"
          label="Email Address"
          value={email}
          onChangeText={(email: string) => this.setState({ email })}
          style={styles.input}
        />
      </Container>
    );
  };

  renderLeaseInfo = () => {
    const {
      leaseStartDate,
      leaseEndDate,
      rentPaidPeriod,
      rent,
      deposit,
      notes,
      hasTenantPaidFirstRent,
      lastPaymentDate,
      leaseType,
    } = this.state;

    const leaseTypes = Object.values(constants.LEASE_TYPE);

    const rentPeriods = Object.values(constants.RECURRING_PAYMENT_TYPE).filter(
      (e) => e !== constants.RECURRING_PAYMENT_TYPE.MONTH
    );

    const options = [
      { label: "No", value: false },
      { label: "Yes", value: true },
    ];

    return (
      <Container center>
        <PillsList
          label="Select a lease type:"
          defaultSelected={this.isEditting ? this.tenantInfo.leaseType : leaseType}
          data={leaseTypes}
          handlePillSelected={(leaseType: string) => this.setState({ leaseType })}
        />
        <TextInput
          dateTime
          label="Lease starts on"
          style={styles.input}
          value={leaseStartDate}
          dateValue={new Date(leaseStartDate)}
          onChangeDate={(leaseStartDate: string) => this.setState({ leaseStartDate })}
        />
        <TextInput
          dateTime
          label="Lease ends on"
          value={leaseEndDate}
          style={styles.input}
          onChangeDate={(leaseEndDate: string) => this.setState({ leaseEndDate })}
        />

        {/* ------ RENT IS PAID TOGGLE ------ */}
        <Container flex={false} row space="between" center margin={[0, 10, 0, 0]}>
          <Container left padding={[18, 0, 0, 11]}>
            <Text semibold tertiary>
              Has tenant already paid rent?
            </Text>
          </Container>

          <Toggle
            options={options}
            initialIndex={this.isEditting && this.tenantInfo.lastPaymentDate != null ? 1 : 0}
            handleToggled={(value: boolean) => {
              this.setState({ hasTenantPaidFirstRent: value });
            }}
            containerStyle={styles.toggle}
            borderRadius={13}
            height={48}
          />
        </Container>

        {/* ------ RENT PAID ON DATE ------ */}
        {hasTenantPaidFirstRent && (
          <TextInput
            dateTime
            label="Rent paid on"
            value={hasTenantPaidFirstRent ? lastPaymentDate : ""}
            style={styles.input}
            onChangeDate={(lastPaymentDate: string) =>
              hasTenantPaidFirstRent ? this.setState({ lastPaymentDate }) : this.setState({ lastPaymentDate: "" })
            }
          />
        )}

        {/* ------ RENT IS PAID PILLS LIST ------ */}
        <PillsList
          label="Rent is paid:"
          defaultSelected={
            this.isEditting ? this.tenantInfo.recurringPaymentType : constants.RECURRING_PAYMENT_TYPE.MONTHLY
          }
          data={rentPeriods}
          handlePillSelected={(rentPaidPeriod: string) => this.setState({ rentPaidPeriod })}
        />

        <CurrencyInput
          label={`Rent / ${rentPaidPeriod}`}
          handleChange={(rent: number) => this.setState({ rent })}
          value={rent}
          textFieldWidth={"94%"}
        />

        <CurrencyInput
          label="Deposit paid"
          handleChange={(deposit: number) => this.setState({ deposit })}
          value={deposit}
          textFieldWidth={"94%"}
        />

        {/* ------- TOTAL OCCUPANTS COUNTER ------- */}
        <Container row center padding={[theme.sizes.base * 1.4, theme.sizes.base, theme.sizes.base, theme.sizes.base]}>
          <Container left>
            <Text tertiary semibold>
              Total Occupants:
            </Text>
          </Container>

          <Container right flex={false}>
            <Counter
              defaultValue={this.isEditting ? this.tenantInfo.totalOccupants : null}
              min={1}
              max={99}
              onCountChange={(count: number) => this.setState({ totalOccupants: count })}
            />
          </Container>
        </Container>

        {/* ------- ADD NOTES INPUT ------- */}
        <ToucableOpacityRNGH style={styles.addNotesButton} onPress={() => this.setState({ showNotesModal: true })}>
          <TextInput
            gray
            size={theme.fontSizes.medium}
            style={styles.addNotesButtonText}
            editable={false}
            label={notes ? "Edit Notes" : "Add Notes"}
            value={notes ? notes.value : ""}
            numberOfLines={1}
          />
          <Entypo name="chevron-small-right" size={26} color={theme.colors.gray} style={styles.notesChevron} />
        </ToucableOpacityRNGH>
      </Container>
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
        padding={[theme.sizes.padding / 1.3, theme.sizes.padding / 1.3, 0, theme.sizes.padding / 1.3]}
        style={{ height: height / 4.8 }}
      >
        <Button color="red" style={styles.navigationButtons} onPress={() => navigation.goBack()}>
          <Text offWhite center semibold>
            Cancel
          </Text>
        </Button>
        <Button
          color="secondary"
          style={styles.navigationButtons}
          onPress={() => this.handleAddTenant()}
          disabled={isLoading}
        >
          <Text offWhite center semibold style={{ alignSelf: "center" }}>
            {!isLoading && "Save"}
            {isLoading && <LoadingIndicator size="small" color={theme.colors.offWhite} />}
          </Text>
        </Button>
      </Container>
    );
  };

  renderNotesModal = () => {
    const { showNotesModal, notes } = this.state;

    return (
      <Modal visible={showNotesModal} animationType="fade" onDismiss={() => this.setState({ showNotesModal: false })}>
        <NotesComponent
          label={notes ? "Edit Tenant(s)" : "New Tenant(s)"}
          handleBackClick={(notes: string) => this.setState({ notes, showNotesModal: false })}
          notesData={notes}
        />
      </Modal>
    );
  };

  onCaptureImage = (data: any[]) => {
    const { images } = this.state;

    const tempImages = [...images];
    data.forEach((image) => tempImages.push(image));
    this.setState({ images: tempImages });
  };

  onUpdateImagesStateOnDelete = () => {
    const { imageToDelete, images } = this.state;

    const indexToDelete = findIndex(images, (img) => {
      if (img.downloadPath && img.downloadPath !== "") {
        return img.downloadPath === imageToDelete.uri;
      } else {
        return img.uri === imageToDelete.uri;
      }
    });

    const deletedImgObj = images[indexToDelete];

    const newImages = [...images];
    newImages.splice(indexToDelete, 1);

    this.setState({ images: newImages });

    // remove images from backend
    // TODO -- might need to refactor to ONLY delete from storage when user presses the 'Save' button
    this.onRemoveImageFromBackend(newImages, deletedImgObj);
  };

  onRemoveImageFromBackend = (newImages: any, deletedImgObj: any) => {
    const { imageToDelete } = this.state;

    if (this.isEditting && this.tenantInfo) {
      this.commonService
        .deleteSingleItemFromStorage(deletedImgObj.name)
        .then(() => {
          this.commonService.handleUpdateSingleField(PROPERTY_FINANCES_DOC, this.tenantInfo.id, { images: newImages });
        })
        .catch((error) => console.log(`ERROR could not remove ${imageToDelete.name} from storage`, error));
    }
  };

  updateImagePosition = (data: any) => {
    const { images } = this.state;

    const from = data.from;
    const to = data.to;
    const tempArray = [...images];

    updateArrayPosition(tempArray, from, to);
    this.setState({ images: tempArray });
  };

  render() {
    const { showAddImageModal, images, showWarningModal } = this.state;

    return (
      <React.Fragment>
        <ScrollView keyboardShouldPersistTaps={"handled"} ref={this.scrollViewRef} nestedScrollEnabled scrollEnabled>
          <Container center color="accent" padding={[0, 0, theme.sizes.padding]}>
            <KeyboardAwareScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              scrollEnabled={true}
              nestedScrollEnabled
              keyboardShouldPersistTaps={"handled"}
              enableAutomaticScroll={true}
            >
              <Container row>
                <Container style={{ width: "95%" }}>
                  <Text h1 offWhite center style={{ paddingTop: theme.sizes.padding }}>
                    {this.isEditting ? "Edit Tenant" : "Add Tenant"}
                  </Text>
                </Container>

                {images.length > 0 && (
                  <Container flex={false} style={{ width: "5%" }}>
                    <TouchableOpacity
                      style={styles.addImagesBtn}
                      onPress={() => this.setState({ showAddImageModal: true })}
                    >
                      <MaterialCommunityIcons name="camera-plus-outline" size={28} color={theme.colors.tertiary} />
                    </TouchableOpacity>
                  </Container>
                )}
              </Container>

              {this.renderImageSection()}
              <HeaderDivider title="Primary Tenant Information" />
              {this.renderTenantInfo()}
              <HeaderDivider title="Lease Information" />
              {this.renderLeaseInfo()}
              {this.renderNavigationButtons()}
              {this.renderNotesModal()}
            </KeyboardAwareScrollView>
          </Container>
        </ScrollView>
        <AddImageModalComponent
          visible={showAddImageModal}
          hideModal={() => this.setState({ showAddImageModal: false })}
          onSelectImages={(data: any[]) => {
            this.onCaptureImage(data);
          }}
          onCaptureImages={(data: any[]) => {
            this.onCaptureImage(data);
          }}
        />
        <CommonModal
          visible={showWarningModal}
          compact
          descriptorText={`Are you sure you want to delete this image?\n\nYou can't undo this action.`}
          hideModal={() => this.setState({ showWarningModal: false })}
          onSubmit={() => this.onUpdateImagesStateOnDelete()}
          headerIcon={<FontAwesome name="warning" size={36} color={theme.colors.offWhite} />}
          headerIconBackground={theme.colors.primary}
          title="Confirm"
        />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: width * 0.93,
  },
  navigationButtons: {
    width: theme.sizes.padding * 5.5,
  },
  addNotesButton: {
    backgroundColor: "transparent",
    minWidth: "93%",
    maxWidth: "93%",
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
  toggle: {
    minWidth: 140,
    maxWidth: 140,
  },
  addImagesBtn: {
    width: 95,
    alignSelf: "flex-end",
    margin: 20,
    marginTop: 25,
  },
});

export default AddTenantComponent;
