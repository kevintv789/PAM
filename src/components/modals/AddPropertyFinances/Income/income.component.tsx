import {
  Button,
  Container,
  CurrencyInput,
  HeaderDivider,
  LoadingIndicator,
  Text,
  TextInput,
  Toggle,
} from "components/common";
import { Dimensions, Modal, StyleSheet } from "react-native";
import { IMAGES_PARENT_FOLDER, PROPERTY_FINANCES_TYPE } from "shared/constants/constants";
import React, { Component } from "react";
import { constants, theme } from "shared";

import CommonService from "services/common.service";
import { Entypo } from "@expo/vector-icons";
import { FinancesModel } from "@models";
import NotesComponent from "components/Modals/Notes/notes.component";
import { PROPERTY_FINANCES_DOC } from "shared/constants/databaseConsts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { hasErrors } from "shared/Utils";
import { isEqual } from "lodash";
import moment from "moment";

const { width, height } = Dimensions.get("window");
class IncomeComponent extends Component<FinancesModel.defaultProps, FinancesModel.initialState> {
  private commonService = new CommonService();

  constructor(props: FinancesModel.defaultProps) {
    super(props);

    this.state = {
      name: "",
      amount: 0,
      expenseStatusDate: moment(new Date(), moment.ISO_8601).format("MM/DD/YYYY"),
      expenseStatus: constants.EXPENSE_STATUS_TYPE.PAID,
      notes: null,
      showNotesModal: false,
      showRecurringModal: false,
      errors: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    const { reportData, isEditting } = this.props;
    if (isEditting && reportData && reportData.type === PROPERTY_FINANCES_TYPE.INCOME) {
      const { amount, name, paidOn, status, notes } = reportData;

      this.setState({
        name,
        amount,
        expenseStatusDate: paidOn,
        expenseStatus: status,
        notes,
      });
    }
  }

  componentDidUpdate(prevProps: FinancesModel.defaultProps, _: any) {
    const { incomeImages } = this.props;

    if (!isEqual(incomeImages, prevProps.incomeImages)) {
      this.updateImagesWithDownloadPath();
    }
  }

  handleIncomeSave = () => {
    const { propertyId, isEditting, reportData, incomeImages } = this.props;
    const { name, amount, expenseStatusDate, expenseStatus, notes } = this.state;

    const errors = [];

    if (!name.length) {
      errors.push("name");
    }

    // Call API to save expense to property
    const payload = {
      id: isEditting ? reportData.id : "",
      amount,
      status: expenseStatus,
      description: "",
      paidOn: expenseStatusDate,
      paymentDue: "",
      recurring: null,
      notes,
      images: incomeImages,
      propertyId,
      name,
      type: PROPERTY_FINANCES_TYPE.INCOME,
    };

    if (!errors.length) {
      if (!isEditting) {
        const docRef = this.commonService.createNewDocId(PROPERTY_FINANCES_DOC);

        if (incomeImages && incomeImages.length > 0) {
          // create with images
          this.handleCreateWithImages(payload, docRef, propertyId);
        } else {
          // regular create
          this.handleRegularCreate(payload, docRef);
        }
      } else {
        if (incomeImages && incomeImages.length > 0) {
          // update with images
          this.handleUpdateWithImages(payload, reportData.id, propertyId);
        } else {
          this.handleRegularUpdate(payload, reportData.id);
        }
      }
    }

    this.setState({ errors, isLoading: true });

    if (errors.length > 0) {
      this.setState({ isLoading: false });
    }
  };

  handleRegularCreate = (payload: any, docRef: any) => {
    const { navigation } = this.props;

    this.commonService
      .handleCreate(payload, docRef)
      .then(() => {
        navigation.goBack();
      })
      .catch((error: any) => console.log("ERROR in creating a new income object: ", error))
      .finally(() => this.setState({ isLoading: false }));
  };

  handleCreateWithImages = (payload: any, docRef: any, propertyId: any) => {
    const { incomeImages } = this.props;

    if (incomeImages) {
      this.commonService
        .handleCreateWithImages(payload, docRef, incomeImages, IMAGES_PARENT_FOLDER.INCOME, propertyId)
        .then(() => {
          this.uploadImages(docRef.id, propertyId);
        })
        .catch((error: any) => console.log("ERROR in updating a new income object: ", error));
    }
  };

  handleRegularUpdate = (payload: any, id: string) => {
    const { navigation } = this.props;

    this.commonService
      .handleUpdate(payload, id, PROPERTY_FINANCES_DOC)
      .then(() => navigation.goBack())
      .catch((error: any) => console.log("ERROR in updating a new income object: ", error));
  };

  handleUpdateWithImages = (payload: any, id: string, propertyId: any) => {
    const { incomeImages } = this.props;

    if (incomeImages) {
      this.commonService
        .handleUpdateWithImages(
          payload,
          id,
          PROPERTY_FINANCES_DOC,
          incomeImages,
          IMAGES_PARENT_FOLDER.INCOME,
          propertyId
        )
        .then(() => this.uploadImages(id, propertyId))
        .catch((error) => console.log("ERROR in updating income with images: ", error));
    }
  };

  uploadImages = (id: string, propertyId: any) => {
    const { incomeImages, navigation } = this.props;

    if (incomeImages) {
      this.commonService
        .handleUploadImages(incomeImages, id, IMAGES_PARENT_FOLDER.INCOME, propertyId)
        .then(() => navigation.goBack())
        .catch((error) => console.log("ERROR in uploading income images, ", error))
        .finally(() => this.setState({ isLoading: false }));
    }
  };

  updateImagesWithDownloadPath = async () => {
    const { reportData } = this.props;
    const images = reportData ? reportData.images : [];
    let newImages: any[] = [...images];
    let shouldUpdate = false;

    if (images.length > 0 && reportData) {
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
        this.commonService.handleUpdateSingleField(PROPERTY_FINANCES_DOC, reportData.id, { images: newImages });
      }
    }
  };

  renderTextInputs = () => {
    const { name, amount, notes, expenseStatus, expenseStatusDate, errors } = this.state;

    const expenseStatusOptions = [
      {
        label: "Unpaid",
        value: constants.EXPENSE_STATUS_TYPE.UNPAID,
      },
      {
        label: "Paid",
        value: constants.EXPENSE_STATUS_TYPE.PAID,
      },
    ];

    return (
      <Container center>
        <TextInput
          required
          error={hasErrors("name", errors)}
          label="Name"
          style={[styles.input, hasErrors("name", errors)]}
          value={name}
          onChangeText={(name: string) =>
            this.setState({
              name,
              errors: errors.filter((e) => e !== "name"),
            })
          }
        />

        <CurrencyInput
          label="Amount"
          handleChange={(amount: number) => this.setState({ amount })}
          value={amount}
          textFieldWidth={width * 0.87}
        />

        <Container row padding={[theme.sizes.padding * 0.5, 0, 15, 0]} flex={false} style={{ alignSelf: "flex-start" }}>
          <Toggle
            options={expenseStatusOptions}
            initialIndex={1}
            handleToggled={(expenseStatus: string) => this.setState({ expenseStatus })}
            containerStyle={styles.expenseStatus}
            borderRadius={13}
            height={48}
            topLabel="Status"
          />
        </Container>

        {expenseStatus === constants.EXPENSE_STATUS_TYPE.PAID ? (
          <TextInput
            dateTime
            label="Paid on Date"
            style={styles.input}
            value={expenseStatusDate}
            dateValue={moment(new Date(expenseStatusDate), moment.ISO_8601).toDate()}
            onChangeDate={(expenseStatusDate: string) => this.setState({ expenseStatusDate })}
          />
        ) : (
          <TextInput
            dateTime
            label="Payment Due On"
            style={styles.input}
            value={expenseStatusDate}
            dateValue={moment(new Date(expenseStatusDate), moment.ISO_8601).toDate()}
            onChangeDate={(expenseStatusDate: string) => this.setState({ expenseStatusDate })}
          />
        )}

        <TouchableOpacity style={styles.addNotesButton} onPress={() => this.setState({ showNotesModal: true })}>
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
        </TouchableOpacity>

        {this.renderNavigationButtons()}
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
        padding={[theme.sizes.padding / 1.3, theme.sizes.padding / 1.3, 0, theme.sizes.padding / 1.3]}
      >
        <Button color="red" style={styles.navigationButtons} onPress={() => navigation.goBack()}>
          <Text offWhite center semibold>
            Cancel
          </Text>
        </Button>
        <Button
          color="secondary"
          style={styles.navigationButtons}
          onPress={() => this.handleIncomeSave()}
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
          label={notes ? "Edit Income" : "New Income"}
          handleBackClick={(notes: string) => this.setState({ notes, showNotesModal: false })}
          notesData={notes}
        />
      </Modal>
    );
  };

  render() {
    return (
      <Container>
        <HeaderDivider title="Income Details" style={styles.divider} />
        {this.renderTextInputs()}
        {this.renderNotesModal()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  divider: {
    width,
    marginTop: 0,
  },
  input: {
    width: width * 0.87,
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
  expenseStatus: {
    minWidth: 145,
    maxWidth: 145,
    marginHorizontal: theme.sizes.padding,
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
  navigationButtons: {
    width: theme.sizes.padding * 5.5,
    marginHorizontal: 27,
  },
});

export default IncomeComponent;
