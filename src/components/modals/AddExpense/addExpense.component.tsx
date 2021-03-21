import {
  AddImageButton,
  Button,
  Container,
  HeaderDivider,
  Text,
  TextInput,
  Toggle,
} from "components/common";
import { Dimensions, Modal, ScrollView, StyleSheet } from "react-native";
import React, { Component } from "react";
import { constants, theme } from "shared";

import { Entypo } from "@expo/vector-icons";
import { ExpenseModel } from "models";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NotesComponent from "components/Modals/Notes/notes.component";
import { TouchableOpacity } from "react-native-gesture-handler";
import { addExpense } from "reducks/modules/property";
import { connect } from "react-redux";
import { formatCurrencyFromCents } from "shared/Utils";
import moment from "moment";

const { width, height } = Dimensions.get("window");

class AddExpenseComponent extends Component<
  ExpenseModel.defaultProps,
  ExpenseModel.initialState
> {
  constructor(props: ExpenseModel.defaultProps) {
    super(props);

    this.state = {
      expenseName: "",
      amount: "",
      amountFormatted: "",
      expenseStatusDate: moment().format("MM/DD/YYYY"),
      expenseStatus: constants.EXPENSE_STATUS_TYPE.PAID,
      recurring: false,
      notes: null,
      showNotesModal: false,
      showRecurringModal: false,
      recurringText: "",
    };
  }

  renderImageSection = () => {
    return (
      <AddImageButton
        handleOnPress={() => console.log("Adding an expense image")}
        caption="Add expense receipts or other related documents"
      />
    );
  };

  handleExpenseSave = () => {
    const { navigation, addExpense } = this.props;
    const {
      expenseName,
      amountFormatted,
      expenseStatusDate,
      expenseStatus,
      recurring,
    } = this.state;

    // Call API to save expense to property
    const payload = {
      id: Math.floor(Math.random() * 1000),
      amount: amountFormatted.replace("$", ""),
      status: expenseStatus,
      description: "",
      paidOn: expenseStatusDate,
      paymentDue: "",
      recurring: recurring,
      additionalNotes: "",
      image: null,
      propertyId: navigation.getParam("propertyId"),
      name: expenseName,
    };

    addExpense(payload);

    navigation.goBack();
  };

  renderNavigationButtons = () => {
    const { handleCancelClicked, navigation } = this.props;

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

  renderTextInputs = () => {
    const {
      expenseName,
      amount,
      amountFormatted,
      notes,
      expenseStatus,
      expenseStatusDate,
      recurring,
      recurringText,
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
          label="Expense Name"
          style={styles.input}
          value={expenseName}
          onChangeText={(expenseName: string) => this.setState({ expenseName })}
        />
        <TextInput
          label="Amount"
          keyboardType="numeric"
          style={styles.input}
          value={amountFormatted}
          onChangeText={(value: any) => {
            if (amountFormatted.length > value.length) {
              this.setState({ amount: "", amountFormatted: "" });
            } else {
              this.setState({
                amount: parseFloat(
                  formatCurrencyFromCents(value, amount).rawVal
                ).toString(),
                amountFormatted: `$${
                  formatCurrencyFromCents(value, amount).formattedAmt
                }`,
              });
            }
          }}
        />

        <Container
          row
          space="between"
          padding={[theme.sizes.padding * 0.9, 0, 10, 0]}
        >
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
            dateValue={moment(expenseStatusDate).toDate()}
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
            dateValue={moment(expenseStatusDate).toDate()}
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
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1 }}
        scrollEnabled={true}
        keyboardShouldPersistTaps={"handled"}
        enableAutomaticScroll={true}
      >
        <Container center color="accent">
          <ScrollView
            keyboardShouldPersistTaps={"handled"}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          >
            <Text
              h1
              offWhite
              center
              style={{ paddingTop: theme.sizes.padding }}
            >
              Add Expense
            </Text>
            {this.renderImageSection()}
            <HeaderDivider title="Expense Details" style={styles.divider} />
            {this.renderTextInputs()}
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
    marginTop: theme.sizes.base,
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
  expenseStatus: {
    minWidth: 145,
    maxWidth: 145,
    marginHorizontal: theme.sizes.padding,
  },
});

const mapDispatchToprops = {
  addExpense,
};

export default connect(null, mapDispatchToprops)(AddExpenseComponent);
