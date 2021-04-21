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
class ExpenseComponent extends Component<
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
      recurring: false,
      notes: null,
      showNotesModal: false,
      showRecurringModal: false,
      recurringText: "",
      errors: [],
    };
  }

  componentDidMount() {
    const { reportData, isEditting } = this.props;
    if (isEditting && reportData && reportData.type === "expense") {
      const { amount, name, paidOn, status, recurring } = reportData;

      this.setState({
        name,
        amount,
        expenseStatusDate: paidOn,
        expenseStatus: status,
        recurring,
      });
    }
  }

  handleExpenseSave = () => {
    const { navigation, isEditting, reportData, propertyId } = this.props;

    const {
      name,
      amount,
      expenseStatusDate,
      expenseStatus,
      recurring,
    } = this.state;

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
      recurring,
      additionalNotes: "",
      image: null,
      propertyId,
      name,
      type: "expense",
    };

    if (!errors.length) {
      if (!isEditting) {
        const docRef = this.commonService.createNewDocId(PROPERTY_FINANCES_DOC);

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
      recurring,
      recurringText,
      errors,
    } = this.state;

    const { navigation } = this.props;

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

    const expenseRecurringOptions = [
      {
        label: "No",
        value: false,
      },
      {
        label: "Yes",
        value: true,
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
        
        <Container>
          <CurrencyInput
            label="Amount"
            handleChange={(amount: number) => this.setState({ amount })}
            value={amount}
            textFieldWidth={width * 0.87}
          />
        </Container>

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

          <Toggle
            options={expenseRecurringOptions}
            initialIndex={0}
            handleToggled={(recurring: boolean) => {
              if (recurring) {
                navigation.navigate("RecurringPaymentModal", {
                  onGoBack: (value: any) =>
                    this.setState({ recurringText: value.recurringText }),
                });
              }
              this.setState({ recurring });
            }}
            containerStyle={styles.expenseStatus}
            borderRadius={13}
            height={48}
            topLabel="Recurring?"
          />
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

        {recurring && (
          <TouchableOpacity
            style={[styles.addNotesButton, { marginBottom: 10 }]}
            onPress={() =>
              navigation.navigate("RecurringPaymentModal", {
                onGoBack: (value: any) =>
                  this.setState({ recurringText: value.recurringText }),
              })
            }
          >
            <TextInput
              label="Expense Due Every"
              style={styles.input}
              value={recurringText}
              editable={false}
            />
            <Entypo
              name="chevron-small-right"
              size={26}
              color={theme.colors.gray}
              style={styles.notesChevron}
            />
          </TouchableOpacity>
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
          onPress={() => this.handleExpenseSave()}
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
          label="New Expense"
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
        <HeaderDivider title="Expense Details" style={styles.divider} />
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

export default ExpenseComponent;
