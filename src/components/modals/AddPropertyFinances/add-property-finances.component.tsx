import * as EvaUI from "@ui-kitten/components";

import { AddImageButton, Container, Text } from "components/common";
import React, { Component } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Tab, TabView } from "@ui-kitten/components";
import { constants, theme } from "shared";

import ExpenseComponent from "./Expense/expense.component";
import { FinancesModel } from "models";
import IncomeComponent from "./Income/income.component";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { addFinances } from "reducks/modules/property";
import { connect } from "react-redux";
import moment from "moment";

class AddPropertyFinancesComponent extends Component<
  FinancesModel.defaultProps,
  FinancesModel.addFinancesState
> {
  private reportData: any;
  private isEditting = false;
  private isIncomeType = false;
  private propertyId: number;

  constructor(props: FinancesModel.defaultProps) {
    super(props);

    this.state = {
      activeTabIndex: 0,
    };

    const { navigation } = this.props;
    this.isEditting = navigation.getParam("isEditting");
    this.reportData = navigation.getParam("reportData");
    this.isIncomeType = this.reportData && this.reportData.type === "income";
    this.propertyId = this.props.navigation.getParam("propertyId");
  }

  renderImageSection = () => {
    return (
      <AddImageButton
        handleOnPress={() => console.log("Adding an expense image")}
        caption="Add receipts or other related documents"
        containerStyle={this.isEditting ? { marginBottom: 15 } : ""}
      />
    );
  };

  renderTabView = () => {
    const { activeTabIndex } = this.state;
    const { navigation } = this.props;
    return (
      <TabView
        selectedIndex={activeTabIndex}
        onSelect={(index) => this.setState({ activeTabIndex: index })}
        tabBarStyle={styles.tabBar}
        indicatorStyle={styles.tabIndicator}
      >
        <Tab
          title={(evaProps) => (
            <EvaUI.Text
              {...evaProps}
              style={
                activeTabIndex === 0 ? styles.activeTab : styles.inactiveTab
              }
            >
              Expense
            </EvaUI.Text>
          )}
        >
          <Container flex={false}>
            <ExpenseComponent
              navigation={navigation}
              propertyId={this.propertyId}
            />
          </Container>
        </Tab>
        <Tab
          title={(evaProps) => (
            <EvaUI.Text
              {...evaProps}
              style={
                activeTabIndex === 1 ? styles.activeTab : styles.inactiveTab
              }
            >
              Income
            </EvaUI.Text>
          )}
        >
          <Container flex={false}>
            <IncomeComponent
              navigation={navigation}
              propertyId={this.propertyId}
            />
          </Container>
        </Tab>
      </TabView>
    );
  };

  render() {
    const { activeTabIndex } = this.state;
    const { navigation } = this.props;

    let title = "";

    if (this.isEditting) {
      title += "Edit";
      if (this.isIncomeType) {
        title += " Income";
      } else {
        title += " Expense";
      }
    } else {
      if (activeTabIndex === 0) {
        title += "Add Expense";
      } else {
        title += "Add Income";
      }
    }

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1 }}
        scrollEnabled={true}
        keyboardShouldPersistTaps={"handled"}
        enableAutomaticScroll={true}
      >
        <Container color="accent">
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
              {title}
            </Text>
            {this.renderImageSection()}
            {!this.isEditting && this.renderTabView()}
            {this.isEditting && this.reportData.type === "income" && (
              <IncomeComponent
                navigation={navigation}
                isEditting={this.isEditting}
                reportData={this.reportData}
                propertyId={this.propertyId}
              />
            )}
            {this.isEditting && this.reportData.type === "expense" && (
              <ExpenseComponent
                navigation={navigation}
                isEditting={this.isEditting}
                reportData={this.reportData}
                propertyId={this.propertyId}
              />
            )}
          </ScrollView>
        </Container>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  expenseStatus: {
    minWidth: 145,
    maxWidth: 145,
    marginHorizontal: theme.sizes.padding,
  },
  activeTab: {
    color: theme.colors.offWhite,
    fontWeight: "bold",
    fontSize: 16,
  },
  inactiveTab: {
    color: theme.colors.gray2,
    fontSize: 16,
  },
  tabIndicator: {
    backgroundColor: theme.colors.secondary,
    height: 6,
    borderRadius: 10,
  },
  tabBar: {
    backgroundColor: "transparent",
    height: 40,
    marginTop: theme.sizes.base,
  },
});

const mapDispatchToprops = {
  addFinances,
};

export default connect(null, mapDispatchToprops)(AddPropertyFinancesComponent);
