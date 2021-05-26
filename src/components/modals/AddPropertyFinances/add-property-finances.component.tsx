import * as EvaUI from "@ui-kitten/components";

import {
  AddImageButton,
  CommonModal,
  Container,
  ImagesList,
  Text,
} from "components/common";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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
      showWarningModal: false,
      imageToDelete: null,
    };

    const { navigation } = this.props;
    this.isEditting = navigation.getParam("isEditting");
    this.reportData = navigation.getParam("reportData");
    this.isIncomeType =
      this.reportData && this.reportData.type === PROPERTY_FINANCES_TYPE.INCOME;
    this.propertyId = this.props.navigation.getParam("propertyId");
  }

  componentDidMount() {
    const isExpenseTab = this.determineIfExpenseTab();
    if (this.reportData && isExpenseTab) {
      this.setState({ expenseImages: this.reportData.images });
    } else if (this.reportData && !isExpenseTab) {
      this.setState({ incomeImages: this.reportData.images });
    }
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
      const uris = expenseImages.map((image) => {
        let obj = {};
        if (image.downloadPath !== "" && image.downloadPath != null) {
          obj["uri"] = image.downloadPath;
        } else {
          obj["uri"] = image.uri;
        }
        return obj;
      });

      return (
        <Container style={{ flex: 1 }} margin={[-10, 0, 14]}>
          <ImagesList
            images={uris}
            showAddImageModal={() => this.setState({ showAddImageModal: true })}
            onDeleteImage={(image: any) =>
              this.setState({ showWarningModal: true, imageToDelete: image })
            }
            // onDragEnd={(data: any[]) => {
            //   this.updateImagePosition(data, false);
            // }}
          />
        </Container>
      );
    } else if (incomeImages.length > 0 && !isExpenseTab) {
    } else {
      return (
        <AddImageButton
          handleOnPress={() => this.setState({ showAddImageModal: true })}
          caption="Add receipts or other related documents"
          containerStyle={{ marginBottom: 14 }}
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
      showWarningModal,
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
    const showExpenseAddImageBtn =
      isExpenseTab && expenseImages && expenseImages.length > 0;
    const showIncomeAddImageBtn =
      !isExpenseTab && incomeImages && incomeImages.length > 0;

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
            <Container row>
              <Container style={{ width: "95%" }}>
                <Text
                  h1
                  offWhite
                  center
                  style={{ paddingTop: theme.sizes.padding }}
                >
                  {title}
                </Text>
              </Container>

              {(showExpenseAddImageBtn || showIncomeAddImageBtn) && (
                <Container flex={false} style={{ width: "5%" }}>
                  <TouchableOpacity
                    style={styles.addImagesBtn}
                    onPress={() => this.setState({ showAddImageModal: true })}
                  >
                    <MaterialCommunityIcons
                      name="camera-plus-outline"
                      size={28}
                      color={theme.colors.tertiary}
                    />
                  </TouchableOpacity>
                </Container>
              )}
            </Container>

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
        <CommonModal
          visible={showWarningModal}
          compact
          descriptorText={`Are you sure you want to delete this image?\n\nYou can't undo this action.`}
          hideModal={() => this.setState({ showWarningModal: false })}
          // onSubmit={() => this.onDeleteSingleImage()}
          headerIcon={
            <FontAwesome
              name="warning"
              size={36}
              color={theme.colors.offWhite}
            />
          }
          headerIconBackground={theme.colors.primary}
          title="Confirm"
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
  addImagesBtn: {
    width: 95,
    alignSelf: "flex-end",
    margin: 20,
    marginTop: 25,
  },
});

const mapDispatchToprops = {
  addFinances,
};

export default connect(null, mapDispatchToprops)(AddPropertyFinancesComponent);
