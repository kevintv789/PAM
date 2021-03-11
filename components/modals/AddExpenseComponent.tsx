import { Dimensions, Image, Modal, ScrollView, StyleSheet } from "react-native";
import React, { Component } from "react";
import { constants, theme } from "../../shared";

import { Entypo } from "@expo/vector-icons";
import { ExpenseModel } from "../../models";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import _Button from "../common/Button";
import _Container from "../common/Container";
import _HeaderDivider from "../common/HeaderDivider";
import _NotesComponent from "./NotesComponent";
import _Text from "../common/Text";
import _TextInput from "../common/TextInput";
import _Toggle from "../common/Toggle";
import { formatNumber } from "../../shared/Utils";
import moment from "moment";

const Text: any = _Text;
const Container: any = _Container;
const Button: any = _Button;
const TextInput: any = _TextInput;
const NotesComponent: any = _NotesComponent;
const Toggle: any = _Toggle;
const HeaderDivider: any = _HeaderDivider;

const { width, height } = Dimensions.get("window");

export default class AddExpenseComponent extends Component<
  ExpenseModel.defaultProps,
  ExpenseModel.initialState
> {
  constructor(props: ExpenseModel.defaultProps) {
    super(props);

    this.state = {
      expenseName: "",
      amount: 0,
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
      <Container center>
        <TouchableOpacity
          onPress={() => console.log("Adding an expense image")}
        >
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
          Add expense receipts or other related documents
        </Text>
      </Container>
    );
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
          onPress={() => navigation.goBack()}
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
        {/* TODO -- Replace with an actual currency input */}
        <TextInput
          label="Amount"
          keyboardType="numeric"
          style={styles.input}
          value={amountFormatted}
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
            label="Paid on Date"
            style={styles.input}
            value={expenseStatusDate}
            onChangeText={(expenseStatusDate: string) =>
              this.setState({ expenseStatusDate })
            }
          />
        ) : (
          <TextInput
            label="Payment Due On"
            style={styles.input}
            value={expenseStatusDate}
            onChangeText={(expenseStatusDate: string) =>
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
              paddingBottom: theme.sizes.padding * 5,
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
