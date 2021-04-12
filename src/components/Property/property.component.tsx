import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Container, Text, VerticalDivider } from "components/common";
import React, { Component } from "react";
import { animations, constants, theme } from "shared";
import { filter, findIndex, isEqual, property, sortBy, sumBy } from "lodash";
import {
  filterArrayForTimePeriod,
  formatNumber,
  getDataFromProperty,
  getPropertyImage,
  getPropertyTypeIcons,
} from "shared/Utils";
import { getExpense, getTenants } from "reducks/modules/property";

import { Entypo } from "@expo/vector-icons";
import PropertyContentComponent from "components/PropertyContent/property.content.component";
import { PropertyModel } from "models";
import { connect } from "react-redux";
import moment from "moment";

const { width } = Dimensions.get("window");

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedText = Animated.createAnimatedComponent(Text);
const date = Date.now();

class PropertyComponent extends Component<
  PropertyModel.Props,
  PropertyModel.State
> {
  constructor(props: PropertyModel.Props) {
    super(props);

    this.state = {
      expanded: false,
      animatedHeaderHeight: new Animated.Value(100),
      animatedHeaderImageWidth: new Animated.Value(74),
      animatedHeaderImageHeight: new Animated.Value(74),
      animatedContainerHeight: new Animated.Value(200),
      animatedHeaderPropertyAddressTop: new Animated.Value(0),
      animatedExpandedContentOpacity: new Animated.Value(0),
      animatedPropertyAddressWidth: new Animated.Value(180),
      financesData: this.props.financesData,
      tenantData: this.props.tenantData,
      propertyData: this.props.propertyData,
    };
  }

  componentDidMount() {
    const { getExpense, getTenants } = this.props;
    const { propertyData, financesData } = this.state;

    // This is where app needs to call action to read from Database
    getExpense();
    getTenants();

    const filteredExpenses = filter(
      financesData,
      (e: any) => e.propertyId === propertyData.id
    );

    this.setState({ financesData: filteredExpenses });
  }

  togglePropertyContent = (timePeriod: string) => {
    const { onPropertySelect } = this.props;
    const {
      animatedHeaderHeight,
      expanded,
      animatedHeaderImageWidth,
      animatedHeaderImageHeight,
      animatedContainerHeight,
      animatedHeaderPropertyAddressTop,
      animatedExpandedContentOpacity,
      animatedPropertyAddressWidth,
      propertyData,
      financesData,
    } = this.state;

    // animate header height
    animations.animateOnToggle(animatedHeaderHeight, expanded, 100, 70);

    // animate header image width
    animations.animateOnToggle(animatedHeaderImageWidth, expanded, 74, 45);

    // animate header image height
    animations.animateOnToggle(animatedHeaderImageHeight, expanded, 74, 45);

    // animate entire container height
    const totalIncome =
      this.sumIncomeForTimePeriod(constants.RECURRING_PAYMENT_TYPE.MONTHLY) ||
      0;

    let height = 750;

    // TODO --- Super hacky conditional, find a better way to do this shiz
    if (
      (!propertyData.tenants.length && financesData.length) ||
      (propertyData.tenants.length &&
        !financesData.length &&
        totalIncome === 0) ||
      (propertyData.tenants.length &&
        financesData.length &&
        totalIncome === 0) ||
      (propertyData.tenants &&
        propertyData.tenants.length > 0 &&
        propertyData.tenants.length < 4)
    ) {
      height = 600;

      const reportDetailsLength = filterArrayForTimePeriod(
        financesData,
        "paidOn",
        timePeriod
      )?.length;
      if (reportDetailsLength && reportDetailsLength > 0) {
        height += 40 * reportDetailsLength;
      }
    } else if (
      (!propertyData.tenants.length && !financesData.length) ||
      totalIncome === 0
    ) {
      height = 550;
    }

    animations.animateOnToggle(animatedContainerHeight, expanded, 200, height);

    // animate property address width
    animations.animateOnToggle(
      animatedPropertyAddressWidth,
      expanded,
      180,
      215
    );

    // animate property address on header
    animations.animateOnToggle(
      animatedHeaderPropertyAddressTop,
      expanded,
      0,
      10
    );

    // animate expanded content opacity
    animations.animateOnToggle(
      animatedExpandedContentOpacity,
      expanded,
      0,
      1,
      800
    );

    // The onPropertySelect() prop sets a height on the parent (HomeScreen) component
    // to help the auto scroll function
    onPropertySelect();
    this.setState({ expanded: !expanded });
  };

  renderHeader = () => {
    const { propertyData, navigation } = this.props;
    const {
      animatedHeaderHeight,
      animatedHeaderImageWidth,
      animatedHeaderImageHeight,
      animatedHeaderPropertyAddressTop,
      animatedPropertyAddressWidth,
      expanded,
    } = this.state;
    const iconImageData = getPropertyTypeIcons(propertyData.unitType);

    return (
      <TouchableOpacity
        style={[styles.touchableArea, theme.sharedStyles.shadowEffect]}
        onPress={() =>
          this.togglePropertyContent(constants.RECURRING_PAYMENT_TYPE.MONTHLY)
        }
        activeOpacity={0.9}
      >
        <AnimatedContainer
          row
          flex={false}
          style={[
            styles.headerContainer,
            {
              backgroundColor: propertyData.color,
              height: animatedHeaderHeight,
            },
          ]}
        >
          <AnimatedImage
            source={getPropertyImage(propertyData.image, propertyData.unitType)}
            style={[
              styles.propertyImages,
              {
                width: animatedHeaderImageWidth,
                height: animatedHeaderImageHeight,
              },
            ]}
          />
          <Container>
            <AnimatedContainer
              row
              center
              flex={1}
              style={{ top: animatedHeaderPropertyAddressTop }}
            >
              <Image
                source={iconImageData.imagePath}
                style={[
                  styles.propIcons,
                  {
                    width: iconImageData.newWidth
                      ? iconImageData.newWidth / 1.8
                      : 20,
                    height: iconImageData.newHeight
                      ? iconImageData.newHeight / 1.8
                      : 20,
                    marginTop: -5,
                  },
                ]}
              />
              <AnimatedText
                accent
                light
                size={theme.fontSizes.medium}
                numberOfLines={1}
                style={{ width: animatedPropertyAddressWidth }}
              >
                {propertyData.propertyAddress}
              </AnimatedText>
              <TouchableOpacity
                style={{ position: "absolute", right: -5 }}
                onPress={() =>
                  navigation.navigate("AddPropertyModal", {
                    editting: true,
                    propertyData,
                  })
                }
              >
                <Container flex={false}>
                  <Entypo
                    name="dots-three-vertical"
                    size={18}
                    color={theme.colors.accent}
                  />
                </Container>
              </TouchableOpacity>
            </AnimatedContainer>

            <Text accent semibold size={theme.fontSizes.medium}>
              {!expanded && propertyData.propertyName}
            </Text>
          </Container>
        </AnimatedContainer>
      </TouchableOpacity>
    );
  };

  getOneTenantFromData = (index: number) => {
    const { propertyData } = this.props;
    const { tenantData } = this.state;
    const tenantIdToFind = propertyData.tenants[index];
    return tenantData[
      findIndex(tenantData, (e: any) => e.id === tenantIdToFind)
    ];
  };

  findEarliestMoveInDate = () => {
    const { propertyData } = this.props;
    const { tenantData } = this.state;
    const tenants = getDataFromProperty(propertyData.tenants, tenantData);

    // sort on leaseStartDate
    if (tenants && tenants.length > 0) {
      const earliestMoveIn = sortBy(tenants, (e: any) =>
        moment(e.leaseStartDate, moment.ISO_8601)
      )[0].leaseStartDate;
      return moment(earliestMoveIn, "MM/DD/YYYY");
    }
  };

  sumExpenseForTimePeriod = (timePeriod: string) => {
    const { financesData } = this.state;
    const date = new Date();
    const expenseData = financesData.filter((f: any) => f.type === "expense");
    let totalExpense = 0;

    switch (timePeriod) {
      case constants.RECURRING_PAYMENT_TYPE.MONTHLY:
        const curMonth = date.getMonth() + 1;
        const curDate = moment(new Date(date), moment.ISO_8601);

        expenseData.forEach((data: any) => {
          const paidMonth = moment(data.paidOn, moment.ISO_8601).month() + 1;
          const paidDate = moment(data.paidOn, moment.ISO_8601);

          if (curMonth === paidMonth && paidDate.diff(curDate) <= 0) {
            totalExpense += data.amount;
          }
        });
        break;
      default:
        break;
    }

    return totalExpense;
  };

  renderTenantNames = () => {
    const { propertyData } = this.props;

    if (propertyData.tenants) {
      if (!propertyData.tenants.length) {
        return (
          <Text accent semibold size={theme.fontSizes.big}>
            Vacant
          </Text>
        );
      } else if (
        propertyData.tenants.length > 0 &&
        propertyData.tenants.length < 4
      ) {
        return (
          <Container>
            {propertyData.tenants.map((e: any, index: number) => {
              if (this.getOneTenantFromData(index)) {
                return (
                  <Container row space="between" middle key={index}>
                    <Text accent medium>
                      {this.getOneTenantFromData(index).name.split(" ")[0]}
                    </Text>
                    <Text light size={11} style={{ top: 2 }}>
                      From {this.getOneTenantFromData(index).leaseStartDate}
                    </Text>
                  </Container>
                );
              }
            })}
          </Container>
        );
      } else {
        return (
          <Container>
            <Text accent semibold>
              {propertyData.tenants.length} Occupants
            </Text>
            <Text light>From {this.findEarliestMoveInDate()}</Text>
          </Container>
        );
      }
    }
  };

  sumIncomeForTimePeriod = (timePeriod: string) => {
    const { financesData } = this.state;
    const date = new Date();
    let totalIncome = 0;

    // filter to type of income only
    const filteredFinancesData = financesData.filter(
      (i: any) => i.type === "income"
    );

    if (filteredFinancesData.length) {
      switch (timePeriod) {
        case constants.RECURRING_PAYMENT_TYPE.MONTHLY:
          const curMonth = date.getMonth() + 1;
          const curDate = moment(new Date(date), moment.ISO_8601);

          filteredFinancesData.forEach((data: any) => {
            if (data.paidOn) {
              const paidMonth = moment(data.paidOn, moment.ISO_8601).month() + 1;
              const paidDate = moment(data.paidOn, moment.ISO_8601);

              if (curMonth === paidMonth && paidDate.diff(curDate) <= 0) {
                totalIncome += data.amount;
              }
            }
          });

          break;
        default:
          break;
      }
    }

    return totalIncome;
  };

  renderBottom = () => {
    const expensesSum = this.sumExpenseForTimePeriod(
      constants.RECURRING_PAYMENT_TYPE.MONTHLY
    );
    const totalIncome =
      this.sumIncomeForTimePeriod(constants.RECURRING_PAYMENT_TYPE.MONTHLY) ||
      0;
    const totalProfit = totalIncome - expensesSum;

    return (
      <Container row>
        <Container>
          <Container row padding={8}>
            <Image
              source={require("assets/icons/key.png")}
              style={{ width: theme.sizes.base, height: theme.sizes.base }}
            />
            <Text light accent>
              Tenants
            </Text>
          </Container>
          <Container padding={8} flex={4} style={{ width: width / 2.3 }}>
            {this.renderTenantNames()}
          </Container>
        </Container>

        <VerticalDivider borderStyle="dashed" />

        <Container style={styles.right}>
          <Container row padding={8} style={{ width: width / 2.3 }}>
            <Image
              source={require("assets/icons/dollar_sign.png")}
              style={{
                width: theme.sizes.base,
                height: theme.sizes.base,
                marginRight: 2,
              }}
            />
            <Text light accent>
              {moment(new Date(date), moment.ISO_8601).format("MMM, YYYY")} Report
            </Text>
          </Container>
          <Container
            padding={[0, 0, 0, 3]}
            flex={3}
            style={{ width: width / 2.3 }}
          >
            <Container row space="between" style={styles.dollarContainers}>
              <Text accent medium style={styles.dollars}>
                Total Income
              </Text>
              <Text
                secondary
                size={theme.fontSizes.small}
                bold
                style={styles.dollars}
              >
                ${formatNumber(totalIncome)}
              </Text>
            </Container>

            <Container row space="between" style={styles.dollarContainers}>
              <Text accent medium style={styles.dollars}>
                Total Expense
              </Text>
              <Text
                primary
                size={theme.fontSizes.small}
                bold
                style={styles.dollars}
              >
                ${formatNumber(expensesSum)}
              </Text>
            </Container>

            <Container row space="between" style={styles.dollarContainers}>
              <Text accent medium style={styles.dollars}>
                Total Profit
              </Text>
              <Text
                color={totalProfit > 0 ? "secondary" : "primary"}
                size={theme.fontSizes.small}
                bold
                style={styles.dollars}
              >
                {totalProfit < 0 ? "-" : ""}$
                {formatNumber(Math.abs(totalProfit))}
              </Text>
            </Container>
          </Container>
        </Container>
      </Container>
    );
  };

  render() {
    const {
      expanded,
      animatedContainerHeight,
      animatedExpandedContentOpacity,
    } = this.state;

    const { propertyData } = this.props;
    const { financesData, tenantData } = this.state;

    // TODO -- add in an actual loading icon when state is finally being called from API
    if (!propertyData || !tenantData.length) {
      return (
        <Container>
          <Text offWhite>Loading...</Text>
        </Container>
      );
    } else {
      return (
        <AnimatedContainer
          style={[
            styles.mainContainer,
            {
              height: animatedContainerHeight,
            },
          ]}
        >
          {this.renderHeader()}
          {!expanded && this.renderBottom()}
          {expanded && (
            <AnimatedContainer
              style={{ opacity: animatedExpandedContentOpacity }}
            >
              <PropertyContentComponent
                tenantData={getDataFromProperty(
                  propertyData.tenants,
                  tenantData
                )}
                financesData={financesData}
                propertyData={propertyData}
                totalIncome={this.sumIncomeForTimePeriod(
                  constants.RECURRING_PAYMENT_TYPE.MONTHLY
                )}
              />
            </AnimatedContainer>
          )}
        </AnimatedContainer>
      );
    }
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: theme.colors.offWhite,
    borderRadius: 10,
    width: "90%",
    minHeight: 200,
    maxHeight: 750,
    marginBottom: theme.sizes.padding,
  },
  touchableArea: {
    width: "100%",
  },
  headerContainer: {
    width: "100%",
    height: "50%",
    padding: theme.sizes.base,
    paddingBottom: 20,
    borderRadius: 10,
  },
  propIcons: {
    marginRight: theme.sizes.base / 3,
  },
  propertyImages: {
    width: 74,
    height: 74,
    marginRight: 8,
    marginLeft: -5,
    marginVertical: -5,
  },
  right: {
    left: -55,
  },
  dollarContainers: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.gray,
    top: -10,
  },
  dollars: {
    top: 5,
  },
});

const mapStateToProps = (state: any) => {
  return {
    financesData: state.propertyState.finances,
    tenantData: state.propertyState.tenants,
  };
};

const mapDispatchToprops = {
  getExpense,
  getTenants,
};

export default connect(mapStateToProps, mapDispatchToprops)(PropertyComponent);
