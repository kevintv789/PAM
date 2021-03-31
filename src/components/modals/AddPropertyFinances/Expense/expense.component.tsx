import {
  Button,
  Container,
  HeaderDivider,
  Text,
  TextInput,
  Toggle,
} from "components/common";
import { Dimensions, Modal, StyleSheet } from "react-native";
import React, { Component } from "react";
import { constants, theme } from "shared";
import { formatCurrencyFromCents, hasErrors } from "shared/Utils";

import { Entypo } from "@expo/vector-icons";
import { ExpenseModel } from "@models";
import NotesComponent from "components/Modals/Notes/notes.component";
import { TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";

const { width, height } = Dimensions.get("window");
class ExpenseComponent extends Component<
  ExpenseModel.defaultProps,
  ExpenseModel.initialState
> {
  constructor(props: any) {
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
      errors: [],
    };
  }

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
          error={hasErrors("expenseName", errors)}
          label="Name"
          style={[styles.input, hasErrors("expenseName", errors)]}
          value={expenseName}
          onChangeText={(expenseName: string) =>
            this.setState({
              expenseName,
              errors: errors.filter((e) => e !== "expenseName"),
            })
          }
        />
        <TextInput
          label="Amount"
          keyboardType="numeric"
          style={styles.input}
          value={amountFormatted}
          onChangeText={(value: any) => {
            if (
              amountFormatted.length > value.length ||
              (value.length === 1 && value === ".")
            ) {
              this.setState({ amount: "", amountFormatted: "" });
            } else {
              this.setState({
                amount: parseFloat(
                  formatCurrencyFromCents(value, amount).rawVal
                ).toString(),
                amountFormatted:
                  value.lastIndexOf(".") + 1 === value.length // checks whether the last index is a decimal, if it is then remove it
                    ? `$${
                        formatCurrencyFromCents(value, amount).formattedAmt
                      }`.slice(0, -1)
                    : `$${formatCurrencyFromCents(value, amount).formattedAmt}`,
              });
            }
          }}
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
          onPress={() => console.log("SAVE")}
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

export default ExpenseComponent;

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
