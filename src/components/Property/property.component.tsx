import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Container, Text, VerticalDivider } from "components/common";
import React, { Component } from "react";
import { animations, constants, mockData, theme } from "shared";
import { findIndex, sortBy, sumBy } from "lodash";
import {
  formatNumber,
  getDataFromProperty,
  getPropertyImage,
  getPropertyTypeIcons,
} from "shared/Utils";

import { Entypo } from "@expo/vector-icons";
import PropertyContentComponent from "components/Property/PropertyContent/property.content.component";
import { PropertyModel } from "models";
import moment from "moment";

const { width } = Dimensions.get("window");

const tenantData = mockData.Tenants;
const expensesData = mockData.Expenses;
const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
  TouchableOpacity
);

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
    };
  }

  togglePropertyContent = () => {
    const {
      animatedHeaderHeight,
      expanded,
      animatedHeaderImageWidth,
      animatedHeaderImageHeight,
      animatedContainerHeight,
      animatedHeaderPropertyAddressTop,
      animatedExpandedContentOpacity,
    } = this.state;

    // animate header height
    animations.animateOnToggle(animatedHeaderHeight, expanded, 100, 70);

    // animate header image width
    animations.animateOnToggle(animatedHeaderImageWidth, expanded, 74, 45);

    // animate header image height
    animations.animateOnToggle(animatedHeaderImageHeight, expanded, 74, 45);

    // animate entire container height
    animations.animateOnToggle(animatedContainerHeight, expanded, 200, 750);

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

    this.setState({ expanded: !expanded });
  };

  renderHeader = () => {
    const { propertyData } = this.props;
    const {
      animatedHeaderHeight,
      animatedHeaderImageWidth,
      animatedHeaderImageHeight,
      animatedHeaderPropertyAddressTop,
      expanded,
    } = this.state;
    const iconImageData = getPropertyTypeIcons(propertyData.unitType);

    return (
      <AnimatedContainer
        row
        flex={false}
        style={[
          styles.headerContainer,
          { backgroundColor: propertyData.color, height: animatedHeaderHeight },
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
            <Text accent light size={theme.fontSizes.medium}>
              {propertyData.propertyAddress}
            </Text>
            <TouchableOpacity
              style={{ position: "absolute", right: -5 }}
              onPress={() => console.log("Edit Pressed...")}
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
    );
  };

  getOneTenantFromData = (index: number) => {
    const { propertyData } = this.props;
    const tenantIdToFind = propertyData.tenants[index];
    return tenantData[findIndex(tenantData, (e) => e.id === tenantIdToFind)];
  };

  findEarliestMoveInDate = () => {
    const { propertyData } = this.props;
    const tenants = getDataFromProperty(propertyData.tenants, tenantData);

    // sort on leaseStartDate
    const earliestMoveIn = sortBy(tenants, (e: any) =>
      moment(e.leaseStartDate)
    )[0].leaseStartDate;
    return moment(earliestMoveIn).format("MM/DD/YYYY");
  };

  sumExpenses = () => {
    const { propertyData } = this.props;

    const expenses = getDataFromProperty(propertyData.expenses, expensesData);
    return sumBy(expenses, "amount");
  };

  renderTenantNames = () => {
    const { propertyData } = this.props;
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
          {propertyData.tenants.map((e: any, index: number) => (
            <Container row space="between" middle key={index}>
              <Text accent medium>
                {this.getOneTenantFromData(index).name.split(" ")[0]}
              </Text>
              <Text light size={11} style={{ top: 2 }}>
                From {this.getOneTenantFromData(index).leaseStartDate}
              </Text>
            </Container>
          ))}
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
  };

  sumAllTenantIncomeForTimePeriod = (timePeriod: string) => {
    const { propertyData } = this.props;
    const date = new Date();
    const tenantInfo = getDataFromProperty(propertyData.tenants, tenantData);
    let totalIncome = 0;

    switch (timePeriod) {
      case constants.RECURRING_PAYMENT_TYPE.MONTHLY:
        const curMonth = date.getMonth() + 1;
        const curDate = moment();

        tenantInfo.forEach((data: any) => {
          const paidMonth = moment(data.lastPaymentDate).month() + 1;
          const paidDate = moment(data.lastPaymentDate);

          if (curMonth === paidMonth && paidDate.diff(curDate) <= 0) {
            totalIncome += data.rent;
          }
        });

        break;
      default:
        break;
    }

    return totalIncome;
  };

  renderBottom = () => {
    const { propertyData } = this.props;
    const expensesSum = this.sumExpenses();
    const totalIncome =
      this.sumAllTenantIncomeForTimePeriod(
        constants.RECURRING_PAYMENT_TYPE.MONTHLY
      ) || 0;
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
              {moment(new Date()).format("MMM, YYYY")} Report
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

    return (
      <AnimatedTouchableOpacity
        style={[styles.mainContainer, { height: animatedContainerHeight }]}
        onPress={() => this.togglePropertyContent()}
        activeOpacity={0.9}
      >
        {this.renderHeader()}
        {!expanded && this.renderBottom()}
        {expanded && (
          <AnimatedContainer
            style={{ opacity: animatedExpandedContentOpacity }}
          >
            <PropertyContentComponent
              tenantData={getDataFromProperty(propertyData.tenants, tenantData)}
              expenseData={getDataFromProperty(
                propertyData.expenses,
                expensesData
              )}
              propertyData={propertyData}
              totalIncome={this.sumAllTenantIncomeForTimePeriod(
                constants.RECURRING_PAYMENT_TYPE.MONTHLY
              )}
            />
          </AnimatedContainer>
        )}
      </AnimatedTouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: theme.colors.offWhite,
    borderRadius: 10,
    width: "90%",
    height: 200,
    // maxHeight: 600,
    marginBottom: theme.sizes.padding,
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
  editButton: {
    width: 60,
    position: "absolute",
    right: 0,
    height: 40,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: 10,
  },
});

export default PropertyComponent;
