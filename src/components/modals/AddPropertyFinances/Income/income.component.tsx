import {
  Button,
  Container,
  CurrencyInput,
  HeaderDivider,
  Text,
  TextInput,
  Toggle,
} from "components/common";
import { Dimensions, Modal, StyleSheet } from "react-native";
import React, { Component } from "react";
import { constants, theme } from "shared";

import CommonService from "services/common.service";
import { Entypo } from "@expo/vector-icons";
import { FinancesModel } from "@models";
import NotesComponent from "components/Modals/Notes/notes.component";
import { PROPERTY_FINANCES_DOC } from "shared/constants/databaseConsts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { hasErrors } from "shared/Utils";
import moment from "moment";

const { width, height } = Dimensions.get("window");
class IncomeComponent extends Component<
  FinancesModel.defaultProps,
  FinancesModel.initialState
> {
  private commonService = new CommonService();

  constructor(props: FinancesModel.defaultProps) {
    super(props);

    this.state = {
      name: "",
      amount: 0,
      expenseStatusDate: moment(new Date(), moment.ISO_8601).format(
        "MM/DD/YYYY"
      ),
      expenseStatus: constants.EXPENSE_STATUS_TYPE.PAID,
      notes: null,
      showNotesModal: false,
      showRecurringModal: false,
      errors: [],
    };
  }

  componentDidMount() {
    const { reportData, isEditting } = this.props;
    if (isEditting && reportData && reportData.type === "income") {
      const { amount, name, paidOn, status } = reportData;

      this.setState({
        name,
        amount,
        expenseStatusDate: paidOn,
        expenseStatus: status,
      });
    }
  }

  handleIncomeSave = () => {
    const { navigation, propertyId, isEditting, reportData } = this.props;
    const { name, amount, expenseStatusDate, expenseStatus } = this.state;

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
      additionalNotes: "",
      image: null,
      propertyId,
      name,
      type: "income",
    };

    if (!errors.length) {
      if (!isEditting) {
        const docRef = this.commonService.createNewDocId(
          PROPERTY_FINANCES_DOC
        );
        this.commonService
          .handleCreate(payload, docRef)
          .then(() => {
            navigation.goBack();
          })
          .catch((error: any) =>
            console.log("ERROR in creating a new income object: ", error)
          );
      } else {
        this.commonService
          .handleUpdate(payload, reportData.id, PROPERTY_FINANCES_DOC)
          .then(() => navigation.goBack())
          .catch((error: any) =>
            console.log("ERROR in updating a new income object: ", error)
          );
      }
    }

    this.setState({ errors });
  };

  renderTextInputs = () => {
    const {
      name,
      amount,
      notes,
      expenseStatus,
      expenseStatusDate,
      errors,
    } = this.state;

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
      <Container center flex={false}>
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
        />

        <Container row padding={[theme.sizes.padding * 0.9, 0, 10, 0]}>
          <Container left>
            <Toggle
              options={expenseStatusOptions}
              initialIndex={1}
              handleToggled={(expenseStatus: string) =>
                this.setState({ expenseStatus })
              }
              containerStyle={styles.expenseStatus}
              borderRadius={13}
              height={48}
              topLabel="Status"
            />
          </Container>
        </Container>

        {expenseStatus === constants.EXPENSE_STATUS_TYPE.PAID ? (
          <TextInput
            dateTime
            label="Paid on Date"
            style={styles.input}
            value={expenseStatusDate}
            dateValue={moment(
              new Date(expenseStatusDate),
              moment.ISO_8601
            ).toDate()}
            onChangeDate={(expenseStatusDate: string) =>
              this.setState({ expenseStatusDate })
            }
          />
        ) : (
          <TextInput
            dateTime
            label="Payment Due On"
            style={styles.input}
            value={expenseStatusDate}
            dateValue={moment(
              new Date(expenseStatusDate),
              moment.ISO_8601
            ).toDate()}
            onChangeDate={(expenseStatusDate: string) =>
              this.setState({ expenseStatusDate })
            }
          />
        )}

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
            value={notes ? notes.text : ""}
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

  renderNavigationButtons = () => {
    const { navigation } = this.props;

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
          onPress={() => this.handleIncomeSave()}
        >
          <Text offWhite center semibold>
            Save
          </Text>
        </Button>
      </Container>
    );
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
          label="New Income"
          handleBackClick={(notes: string) =>
            this.setState({ notes, showNotesModal: false })
          }
        />
      </Modal>
    );
  };

  render() {
    return (
      <Container>
        <HeaderDivider title="Income Details" style={styles.divider} />
        {this.renderTextInputs()}
        {this.renderNavigationButtons()}
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
  },
});

export default IncomeComponent;
