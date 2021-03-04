import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { Component } from "react";
import { formatNumber, formatPlural, getDaysDiffFrom } from "../shared/Utils";
import { mockData, theme } from "../shared";

import { Entypo } from "@expo/vector-icons";
import { PropertyContentModel } from "../models";
import _Button from "./common/Button";
import _Container from "./common/Container";
import _DataOutline from "./common/DataOutline";
import _Text from "./common/Text";
import moment from "moment";
import { property } from "lodash";

const Text: any = _Text;
const Container: any = _Container;
const Button: any = _Button;
const DataOutline: any = _DataOutline;

export default class PropertyContentComponent extends Component<
  PropertyContentModel.Props,
  PropertyContentModel.State
> {
  constructor(props: PropertyContentModel.Props) {
    super(props);
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
        style={{ maxHeight: "30%", paddingTop: 5 }}
        flex={1}
      >
        <ScrollView
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={{ flexGrow: 1 }}
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
            onPress={() => console.log("Adding an expense...")}
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

  renderReport = () => {
    const { propertyData } = this.props;
    const profit = propertyData.income - propertyData.expenses;

    return (
      <Container padding={[15, 10, 10, 10]}>
        {this.renderReportHeader()}

        <Container>
          <Container row middle space="between">
          <DataOutline
              square
              color="secondary"
              text={"$" + formatNumber(propertyData.income)}
              caption="Income"
            />
            <DataOutline
              circle
              color="secondary"
              text={"$" + formatNumber(profit)}
              caption="Profit"
            />
            <DataOutline
              square
              color="primary"
              text={"$" + formatNumber(propertyData.expenses)}
              caption="Expense"
            />
          </Container>
        </Container>
      </Container>
    );
  };

  render() {
    return (
      <Container>
        {this.renderTenantHeader()}
        {this.renderTenantInfo()}
        {this.renderReport()}
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
});
