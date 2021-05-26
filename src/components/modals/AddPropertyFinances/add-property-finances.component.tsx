import * as EvaUI from "@ui-kitten/components";

import { AddImageButton, Container, Text } from "components/common";
import { Keyboard, ScrollView, StyleSheet } from "react-native";
import React, { Component } from "react";
import { Tab, TabView } from "@ui-kitten/components";

import AddImageModalComponent from "../Add Image/addImage.component";
import ExpenseComponent from "./Expense/expense.component";
import { FinancesModel } from "models";
import IncomeComponent from "./Income/income.component";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PROPERTY_FINANCES_TYPE } from "shared/constants/constants";
import { addFinances } from "reducks/modules/property";
import { connect } from "react-redux";
import { theme } from "shared";

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
      activeTabIndex: PROPERTY_FINANCES_TYPE.EXPENSE_TAB,
      showAddImageModal: false,
      expenseImages: [],
      incomeImages: [],
    };

    const { navigation } = this.props;
    this.isEditting = navigation.getParam("isEditting");
    this.reportData = navigation.getParam("reportData");
    this.isIncomeType =
      this.reportData && this.reportData.type === PROPERTY_FINANCES_TYPE.INCOME;
    this.propertyId = this.props.navigation.getParam("propertyId");
  }

  determineIfExpenseTab = () =>
    (this.reportData &&
      this.reportData.type.toUpperCase() ===
        PROPERTY_FINANCES_TYPE.EXPENSE.toUpperCase()) ||
    (this.reportData == null &&
      this.state.activeTabIndex === PROPERTY_FINANCES_TYPE.EXPENSE_TAB);

  renderImageSection = () => {
    const { expenseImages, incomeImages } = this.state;
    const isExpenseTab = this.determineIfExpenseTab();

    if (expenseImages.length > 0 && isExpenseTab) {
    } else if (incomeImages.length > 0 && !isExpenseTab) {
    } else {
      return (
        <AddImageButton
          handleOnPress={() => this.setState({ showAddImageModal: true })}
          caption="Add receipts or other related documents"
        />
      );
    }
  };

  renderTabView = () => {
    const { activeTabIndex, incomeImages, expenseImages } = this.state;
    const { navigation } = this.props;
    return (
      <TabView
        selectedIndex={activeTabIndex}
        onSelect={(index) => {
          this.setState({ activeTabIndex: index });
          Keyboard.dismiss();
        }}
        tabBarStyle={styles.tabBar}
        indicatorStyle={styles.tabIndicator}
      >
        <Tab
          title={(evaProps) => (
            <EvaUI.Text
              {...evaProps}
              style={
                activeTabIndex === PROPERTY_FINANCES_TYPE.EXPENSE_TAB
                  ? styles.activeTab
                  : styles.inactiveTab
              }
            >
              {PROPERTY_FINANCES_TYPE.EXPENSE}
            </EvaUI.Text>
          )}
        >
          <Container flex={false}>
            <ExpenseComponent
              navigation={navigation}
              propertyId={this.propertyId}
              expenseImages={expenseImages}
            />
          </Container>
        </Tab>
        <Tab
          title={(evaProps) => (
            <EvaUI.Text
              {...evaProps}
              style={
                activeTabIndex === PROPERTY_FINANCES_TYPE.INCOME_TAB
                  ? styles.activeTab
                  : styles.inactiveTab
              }
            >
              {PROPERTY_FINANCES_TYPE.INCOME}
            </EvaUI.Text>
          )}
        >
          <Container flex={false}>
            <IncomeComponent
              navigation={navigation}
              propertyId={this.propertyId}
              incomeImages={incomeImages}
            />
          </Container>
        </Tab>
      </TabView>
    );
  };

  onCaptureImage = (isExpenseTab: boolean, data: any[]) => {
    const { expenseImages, incomeImages } = this.state;

    const tempImages = isExpenseTab ? [...expenseImages] : [...incomeImages];
    data.forEach((image) => tempImages.push(image));
    isExpenseTab
      ? this.setState({ expenseImages: tempImages })
      : this.setState({ incomeImages: tempImages });
  };

  render() {
    const {
      activeTabIndex,
      showAddImageModal,
      expenseImages,
      incomeImages,
    } = this.state;
    const { navigation } = this.props;

    let title = "";

    if (this.isEditting) {
      title += "Edit";
      if (this.isIncomeType) {
        title += ` ${PROPERTY_FINANCES_TYPE.INCOME}`;
      } else {
        title += ` ${PROPERTY_FINANCES_TYPE.EXPENSE}`;
      }
    } else {
      if (activeTabIndex === 0) {
        title += `Add ${PROPERTY_FINANCES_TYPE.EXPENSE}`;
      } else {
        title += `Add ${PROPERTY_FINANCES_TYPE.INCOME}`;
      }
    }

    const isExpenseTab = this.determineIfExpenseTab();

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
            {this.isEditting &&
              this.reportData.type === PROPERTY_FINANCES_TYPE.INCOME && (
                <IncomeComponent
                  navigation={navigation}
                  isEditting={this.isEditting}
                  reportData={this.reportData}
                  propertyId={this.propertyId}
                  incomeImages={incomeImages}
                />
              )}
            {this.isEditting &&
              this.reportData.type === PROPERTY_FINANCES_TYPE.EXPENSE && (
                <ExpenseComponent
                  navigation={navigation}
                  isEditting={this.isEditting}
                  reportData={this.reportData}
                  propertyId={this.propertyId}
                  expenseImages={expenseImages}
                />
              )}
          </ScrollView>
        </Container>
        <AddImageModalComponent
          visible={showAddImageModal}
          hideModal={() => this.setState({ showAddImageModal: false })}
          onSelectImages={(data: any[]) => {
            this.onCaptureImage(isExpenseTab, data);
          }}
          onCaptureImages={(data: any[]) => {
            this.onCaptureImage(isExpenseTab, data);
          }}
        />
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
