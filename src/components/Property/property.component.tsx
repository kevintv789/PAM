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
import { filter, isEqual, isEqualWith, sortBy } from "lodash";
import {
  filterArrayForTimePeriod,
  formatNumber,
  getPropertyImage,
  getPropertyTypeIcons,
} from "shared/Utils";

import { Entypo } from "@expo/vector-icons";
import PropertyContentComponent from "components/PropertyContent/property.content.component";
import { PropertyModel } from "models";
import TenantService from "services/tenant.service";
import { bindActionCreators } from "redux";
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
  private tenantService = new TenantService();

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
      financesData: [],
      tenantsData: [],
      propertyData: this.props.propertyData,
    };
  }

  componentDidMount() {
    this.getTenantData();
    this.setFinancialData();
  }

  componentDidUpdate(prevProps: PropertyModel.Props) {
    const { propertyData, financesData, tenantData } = this.props;

    if (!isEqual(prevProps.tenantData, tenantData)) {
      // Get tenants data from property
      this.getTenantData();
    }

    if (!isEqual(prevProps.financesData, financesData)) {
      this.setFinancialData();
    }
  }

  setFinancialData = () => {
    const { propertyData, financesData } = this.props;

    const filteredFinancialData = filter(
      financesData,
      (e: any) => e.propertyId === propertyData.id
    );

    this.setState({ financesData: filteredFinancialData });
  };

  getTenantData = () => {
    const { propertyData, tenantData } = this.props;
    const tenants = propertyData.tenants;

    if (tenants && tenants.length > 0) {
      const filteredTenants = tenantData.filter((tenant: any) => {
        return tenant.propertyId === propertyData.id;
      });
      this.setState({ tenantsData: filteredTenants });
    }
  };

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
      financesData,
      tenantsData,
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
      (!tenantsData.length && financesData.length) ||
      (tenantsData.length && !financesData.length && totalIncome === 0) ||
      (tenantsData.length && financesData.length && totalIncome === 0) ||
      (tenantsData && tenantsData.length > 0 && tenantsData.length < 4)
    ) {
      height = 510 + 40 * tenantsData.length;

      const reportDetailsLength = filterArrayForTimePeriod(
        financesData,
        "paidOn",
        timePeriod
      )?.length;

      if (reportDetailsLength && reportDetailsLength > 0) {
        height += 40 * reportDetailsLength;
      }
    } else if (
      (!tenantsData.length && !financesData.length) ||
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

  findEarliestMoveInDate = () => {
    const { propertyData } = this.props;
    const { tenantsData } = this.state;
    // sort on leaseStartDate
    if (tenantsData && tenantsData.length > 0) {
      const earliestMoveIn = sortBy(tenantsData, (e: any) =>
        moment(e.leaseStartDate)
      )[0].leaseStartDate;
      return moment(earliestMoveIn, "MM/DD/YYYY").format("MM/DD/YYYY");
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
          const paidMonth =
            moment(new Date(data.paidOn), moment.ISO_8601).month() + 1;
          const paidDate = moment(new Date(data.paidOn), moment.ISO_8601);

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
    const { tenantsData } = this.state;

    if (tenantsData) {
      if (!tenantsData.length) {
        return (
          <Text accent semibold size={theme.fontSizes.big}>
            Vacant
          </Text>
        );
      } else if (tenantsData.length > 0 && tenantsData.length < 4) {
        return (
          <Container>
            {tenantsData.map((tenant: any) => {
              if (typeof tenant === "object") {
                return (
                  <Container row space="between" middle key={tenant.id}>
                    <Text accent medium>
                      {tenant.name.split(" ")[0]}
                    </Text>
                    <Text light size={11} style={{ top: 2 }}>
                      From {tenant.leaseStartDate}
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
              {tenantsData.length} Occupants
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

    if (filteredFinancesData && filteredFinancesData.length > 0) {
      switch (timePeriod) {
        case constants.RECURRING_PAYMENT_TYPE.MONTHLY:
          const curMonth = date.getMonth() + 1;
          const curDate = moment(new Date(date), moment.ISO_8601);

          filteredFinancesData.forEach((data: any) => {
            if (data.paidOn) {
              const paidMonth =
                moment(new Date(data.paidOn), moment.ISO_8601).month() + 1;
              const paidDate = moment(new Date(data.paidOn), moment.ISO_8601);

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
              {moment(new Date(date), moment.ISO_8601).format("MMM, YYYY")}{" "}
              Report
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
    const { financesData, tenantsData } = this.state;

    // TODO -- add in an actual loading icon when state is finally being called from API
    if (!propertyData) {
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
                tenantsData={tenantsData}
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
  };
};

export default connect(mapStateToProps, null)(PropertyComponent);
