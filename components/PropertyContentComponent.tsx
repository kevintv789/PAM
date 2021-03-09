import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { Component } from "react";
import { constants, mockData, theme } from "../shared";
import { formatNumber, formatPlural, getDaysDiffFrom } from "../shared/Utils";
import { orderBy, sumBy } from "lodash";

import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { PropertyContentModel } from "../models";
import _Button from "./common/Button";
import _Container from "./common/Container";
import _DataOutline from "./common/DataOutline";
import _NotesComponent from "./modals/NotesComponent";
import _Text from "./common/Text";
import moment from "moment";
import { withNavigation } from 'react-navigation';

const Text: any = _Text;
const Container: any = _Container;
const Button: any = _Button;
const NotesComponent: any = _NotesComponent;
const DataOutline: any = _DataOutline;

const notesData = mockData.Notes;

class PropertyContentComponent extends Component<
  PropertyContentModel.Props,
  PropertyContentModel.State
> {
  constructor(props: PropertyContentModel.Props) {
    super(props);

    this.state = {
      showNotesModal: false,
      notesValue: null,
      showAddExpenseModal: false,
    };
  }

  renderTenantHeader = () => (
    <Container row padding={10} style={styles.tenantheader} flex={false}>
      <Image
        source={require("../assets/icons/key.png")}
        style={{ width: theme.sizes.base, height: theme.sizes.base }}
      />
      <Text accent bold size={13}>
        All Tenants {"  "}
      </Text>
      <Text light accent size={13}>
        {moment(new Date()).format("MMMM DD, YYYY")}
      </Text>
      <Button
        color="transparent"
        style={styles.addTenantButton}
        onPress={() => {}}
      >
        <Text light accent style={{ top: 2 }} size={13}>
          Add Tenant
        </Text>
        <Image
          source={require("../assets/icons/plus.png")}
          style={{ width: 20, height: 20 }}
        />
      </Button>
    </Container>
  );

  renderDueDate = (tenant: any) => {
    const dueDate = getDaysDiffFrom(new Date(), tenant.nextPaymentDate);
    let text;

    if (dueDate === 0) {
      text = (
        <Text red medium>
          Due today!
        </Text>
      );
    } else if (dueDate && dueDate > 0 && dueDate <= 5) {
      text = (
        <Text>
          Due in{" "}
          <Text medium red>
            {dueDate}{" "}
          </Text>
          {formatPlural("day", dueDate)}
        </Text>
      );
    } else if (dueDate && dueDate < 0) {
      text = (
        <Text>
          is{" "}
          <Text medium red>
            {Math.abs(dueDate)}{" "}
          </Text>
          {formatPlural("day", dueDate)} late!
        </Text>
      );
    } else {
      text = (
        <Text>
          Due in{" "}
          <Text medium secondary>
            {dueDate}{" "}
          </Text>
          {formatPlural("day", dueDate || 0)}
        </Text>
      );
    }

    return text;
  };

  renderTenantInfo = () => {
    const { tenantData } = this.props;
    return (
      <Container
        onStartShouldSetResponder={() => true}
        style={{ maxHeight: 150, paddingTop: 5 }}
        flex={1}
      >
        <ScrollView
          keyboardShouldPersistTaps={"handled"}
          //   contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={true}
          horizontal={false}
          nestedScrollEnabled
        >
          {tenantData.map((tenant: any) => {
            return (
              <Container style={styles.tenantInfoItem} key={tenant.id}>
                <TouchableWithoutFeedback>
                  <TouchableOpacity>
                    <Container row space="between" padding={10}>
                      <Text
                        numberOfLines={1}
                        semibold
                        accent
                        size={13}
                        style={{ width: "33%" }}
                      >
                        {tenant.name}
                      </Text>
                      <Text semibold accent size={13} style={{ width: "31%" }}>
                        Payment
                      </Text>
                      <Text semibold accent size={13} style={{ width: "32%" }}>
                        Next Payment
                      </Text>
                      <Entypo
                        name="chevron-small-right"
                        size={24}
                        color={theme.colors.accent}
                        style={{ width: "5%", top: -4 }}
                      />
                    </Container>
                    <Container
                      row
                      flex={false}
                      padding={[0, 0, 0, 10]}
                      style={{ top: -5 }}
                    >
                      <Text
                        light
                        accent
                        size={theme.fontSizes.small}
                        style={{ width: "32%" }}
                      >
                        From {tenant.leaseStartDate}
                      </Text>
                      <Text
                        light
                        style={{ width: "30%" }}
                        size={theme.fontSizes.small}
                      >
                        {this.renderDueDate(tenant)}
                      </Text>
                      <Text
                        light
                        style={{ width: "38%" }}
                        size={theme.fontSizes.small}
                        numberOfLines={1}
                      >
                        <Text secondary medium>
                          ${formatNumber(tenant.rent)}{" "}
                        </Text>
                        on {moment(tenant.nextPaymentDate).format("MM/DD")}
                      </Text>
                    </Container>
                  </TouchableOpacity>
                </TouchableWithoutFeedback>
              </Container>
            );
          })}
        </ScrollView>
      </Container>
    );
  };

  renderReportHeader = () => {
    return (
      <Container row style={styles.reportHeader} flex={false}>
        <Image
          source={require("../assets/icons/dollar_sign.png")}
          style={{
            width: theme.sizes.base,
            height: theme.sizes.base,
            marginRight: 2,
          }}
        />
        <Text accent size={13} bold>
          Monthly Report for {moment().format("MMMM")}
        </Text>
        <Container row style={{}} flex={1}>
          <Button
            color="transparent"
            style={styles.addExpenseButton}
            onPress={() => this.props.navigation.navigate("AddExpenseModal")}
          >
            <Text light accent style={{ top: 2, right: 4 }} size={13}>
              Add Expense
            </Text>
            <Image
              source={require("../assets/icons/plus.png")}
              style={{ width: 20, height: 20 }}
            />
          </Button>
          <Button
            color="transparent"
            style={styles.filterButton}
            onPress={() => console.log("Filtering...")}
          >
            <Image
              source={require("../assets/icons/filter_button.png")}
              style={{ width: 20, height: 20 }}
            />
          </Button>
        </Container>
      </Container>
    );
  };

  flattenList = (list: any[]) => {
    return list.map((e) => {
      return {
        id: e.id,
        name: e.name,
        amount: e.rent || e.amount,
        type: e.rent ? "rent" : "expense",
        paidOn:
          (e.paidOn && moment(e.paidOn).format("MM/DD/YYYY")) ||
          (e.lastPaymentDate && moment(e.lastPaymentDate).format("MM/DD/YYYY")),
      };
    });
  };

  getReportForTimePeriod = (list: any[], timePeriod: string) => {
    let newList: any[] = [];

    switch (timePeriod) {
      case constants.RECURRING_PAYMENT_TYPE.MONTHLY:
        const curDate = moment();

        list.forEach((item) => {
          const monthPaid = moment(item.paidOn);
          if (
            monthPaid.diff(curDate) <= 0 &&
            curDate.month() + 1 === monthPaid.month() + 1
          ) {
            newList.push(item);
          }
        });
        break;
      default:
        break;
    }

    return orderBy(newList, "paidOn", ["desc"]);
  };

  formatAmount = (amount: number, type: string) => {
    if (type === "expense") {
      return `- $${formatNumber(amount)}`;
    }

    return `+ $${formatNumber(amount)}`;
  };

  renderReportDetailsSection = () => {
    const { expenseData, tenantData } = this.props;

    // combine tenantData and expenseData and sort on paidDate/lastPaymentDate
    const combinedData = [...expenseData, ...tenantData];
    const flattenList = this.flattenList(combinedData);

    // further filters out array based on selected time period
    const filteredList = this.getReportForTimePeriod(
      flattenList,
      constants.RECURRING_PAYMENT_TYPE.MONTHLY
    );

    return (
      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
        horizontal={false}
        nestedScrollEnabled
      >
        {filteredList.map((data: any) => (
          <Container
            key={`${data.id}-${data.type}`}
            style={styles.expensesContainer}
          >
            <TouchableWithoutFeedback>
              <TouchableOpacity onPress={() => console.log(data)}>
                <Container row>
                  <Text semibold accent>
                    {data.name}
                    {"  "}
                  </Text>
                  <Text accent light size={theme.fontSizes.small}>
                    Paid {data.paidOn}
                  </Text>
                  <Container row style={{ right: 0, position: "absolute" }}>
                    <Text
                      color={data.type === "rent" ? "secondary" : "primary"}
                      semibold
                    >
                      {this.formatAmount(data.amount, data.type)}
                    </Text>

                    <Entypo
                      name="chevron-small-right"
                      size={20}
                      color={theme.colors.accent}
                      style={{ top: -2 }}
                    />
                  </Container>
                </Container>
              </TouchableOpacity>
            </TouchableWithoutFeedback>
          </Container>
        ))}
      </ScrollView>
    );
  };

  renderReport = () => {
    const { propertyData, expenseData, totalIncome } = this.props;
    const totalExpense = sumBy(expenseData, "amount");
    const profit = totalIncome - totalExpense;

    return (
      <Container
        padding={[theme.sizes.padding, 10, 10, 10]}
        style={{ maxHeight: 350 }}
        flex={false}
      >
        {this.renderReportHeader()}

        <Container
          row
          middle
          space="around"
          flex={false}
          padding={[0, 0, theme.sizes.base]}
        >
          <DataOutline
            square
            color="secondary"
            text={"$" + formatNumber(totalIncome)}
            caption="Income"
          />
          <DataOutline
            circle
            color={profit < 0 ? "primary" : "secondary"}
            text={
              (profit < 0 ? "-" : "") + "$" + formatNumber(Math.abs(profit))
            }
            caption="Profit"
          />
          <DataOutline
            square
            color="primary"
            text={"$" + formatNumber(totalExpense)}
            caption="Expense"
          />
        </Container>

        {this.renderReportDetailsSection()}
      </Container>
    );
  };

  renderNotesSection = () => {
    const { propertyData } = this.props;
    const { notesValue } = this.state;

    const notesFromProperty =
      notesValue ||
      notesData.filter((note: any) => note.id === propertyData.notesId)[0];

    return (
      <Container>
        <Container style={styles.notesHeaderContainer} flex={false} row>
          <Image
            source={require("../assets/icons/notes.png")}
            style={{
              width: theme.sizes.base,
              height: theme.sizes.base,
              marginRight: 2,
            }}
          />
          <Text accent bold size={13}>
            Notes
          </Text>
        </Container>
        {notesFromProperty ? (
          <TouchableOpacity
            style={styles.notesContainer}
            onPress={() => this.setState({ showNotesModal: true })}
          >
            <Container
              color="accent"
              margin={10}
              flex={false}
              padding={10}
              style={{ borderRadius: 10 }}
            >
              <Text offWhite numberOfLines={3}>
                {notesFromProperty.text}
              </Text>

              <Container flex={false} row space="between">
                {notesFromProperty.lastUpdated && (
                  <Text
                    light
                    offWhite
                    size={theme.fontSizes.small}
                    style={{ marginTop: 2 }}
                  >
                    Last editted on {notesFromProperty.lastUpdated}
                  </Text>
                )}
                <Text offWhite style={{ textDecorationLine: "underline" }}>
                  More
                </Text>
              </Container>
            </Container>
          </TouchableOpacity>
        ) : (
          <Container center padding={[theme.sizes.padding]}>
            <Button
              style={styles.createNotesButton}
              onPress={() => this.setState({ showNotesModal: true })}
            >
              <Ionicons
                name="ios-create-outline"
                size={22}
                color={theme.colors.secondary}
              />
              <Text center secondary bold style={{ paddingTop: 2 }}>
                Create a Note
              </Text>
            </Button>
          </Container>
        )}
      </Container>
    );
  };

  handleNotesSave = (notesValue: string) => {
    this.setState({ showNotesModal: false, notesValue });
  };

  renderNotesModal = () => {
    const { showNotesModal } = this.state;
    const { propertyData } = this.props;

    const notesFromProperty = notesData.filter(
      (note: any) => note.id === propertyData.notesId
    )[0];

    return (
      <Modal
        visible={showNotesModal}
        animationType="fade"
        onDismiss={() => this.setState({ showNotesModal: false })}
      >
        <NotesComponent
          label={propertyData.propertyAddress}
          handleBackClick={(notesValue: string) =>
            this.handleNotesSave(notesValue)
          }
          notesData={notesFromProperty}
        />
      </Modal>
    );
  };

  render() {
    return (
      <Container>
        {this.renderTenantHeader()}
        {this.renderTenantInfo()}
        {this.renderReport()}
        {this.renderNotesSection()}
        {this.renderNotesModal()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  tenantheader: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.gray,
  },
  reportHeader: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.gray,
    height: 29,
  },
  expensesContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.gray,
    marginBottom: theme.sizes.padding * 0.7,
  },
  addTenantButton: {
    flexDirection: "row",
    position: "absolute",
    right: 5,
    top: 0,
    bottom: 0,
    justifyContent: "space-between",
    width: 95,
  },
  addExpenseButton: {
    flexDirection: "row",
    left: 12,
    bottom: 10,
    justifyContent: "space-between",
    width: 100,
  },
  filterButton: {
    position: "absolute",
    top: -24,
    right: -25,
    width: 40,
  },
  tenantInfoItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.gray,
  },
  notesHeaderContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.gray,
    padding: 10,
  },
  notesContainer: {
    maxHeight: 100,
  },
  createNotesButton: {
    backgroundColor: "transparent",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    alignItems: "center",
  },
});

export default withNavigation(PropertyContentComponent);
