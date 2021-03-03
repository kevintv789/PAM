import { Animated, Dimensions, Image, StyleSheet } from "react-native";
import React, { Component } from "react";
import { filter, findIndex, sortBy } from "lodash";
import {
  formatNumber,
  getPropertyImage,
  getPropertyTypeIcons,
} from "../shared/Utils";
import { mockData, theme } from "../shared/constants";

import { PropertyModel } from "../models";
import { TouchableOpacity } from "react-native-gesture-handler";
import _Container from "./common/Container";
import _Text from "./common/Text";
import _VerticalDivider from "./common/VerticalDivider";
import moment from "moment";

const Container: any = _Container;
const Text: any = _Text;
const VerticalDivider: any = _VerticalDivider;

const { width } = Dimensions.get("window");

const tenantData = mockData.Tenants;
const AnimatedContainer = Animated.createAnimatedComponent(Container);

class PropertyComponent extends Component<
  PropertyModel.Props,
  PropertyModel.State
> {
  constructor(props: PropertyModel.Props) {
    super(props);

    this.state = {
      expanded: false,
      animatedHeaderHeight: new Animated.Value(100),
    };
  }

  togglePropertyContent = () => {
    const { animatedHeaderHeight, expanded } = this.state;

    Animated.timing(animatedHeaderHeight, {
      toValue: !expanded ? 50 : 100,
      duration: 500,
      useNativeDriver: false,
    }).start();

    this.setState({ expanded: !expanded });
  };

  renderHeader = () => {
    const { propertyData } = this.props;
    const { animatedHeaderHeight } = this.state;
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
        <Image
          source={getPropertyImage(propertyData.image, propertyData.unitType)}
          style={styles.propertyImages}
        />
        <Container>
          <Container row center>
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
                },
              ]}
            />
            <Text accent light size={theme.fontSizes.medium}>
              {propertyData.propertyAddress}
            </Text>
          </Container>

          <Text accent semibold size={theme.fontSizes.medium}>
            {propertyData.propertyName}
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

  getAllTenantsFromData = () => {
    const { propertyData } = this.props;
    const tenantIds = propertyData.tenants;
    let tenants: object[] = [];

    // Loop on each tenant IDs and build an array
    if (tenantIds && tenantIds.length) {
      tenantIds.forEach((id: number) => {
        tenants.push(filter(tenantData, (e) => e.id === id)[0]);
      });
    }

    return tenants;
  };

  findEarliestMoveInDate = () => {
    const tenants = this.getAllTenantsFromData();

    // sort on leaseStartDate
    const earliestMoveIn = sortBy(tenants, "leaseStartDate")[0].leaseStartDate;
    return moment(earliestMoveIn).format("MM/DD/YYYY");
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

  renderBottom = () => {
    const { propertyData } = this.props;
    const totalProfit = propertyData.income - propertyData.expenses;

    return (
      <Container row>
        <Container>
          <Container row padding={8}>
            <Image
              source={require("../assets/icons/key.png")}
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
              source={require("../assets/icons/dollar_sign.png")}
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
                ${formatNumber(propertyData.income)}
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
                ${formatNumber(propertyData.expenses)}
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
                ${formatNumber(totalProfit)}
              </Text>
            </Container>
          </Container>
        </Container>
      </Container>
    );
  };

  render() {
    const { expanded } = this.state;

    return (
      <TouchableOpacity
        style={[styles.mainContainer]}
        onPress={() => this.togglePropertyContent()}
      >
        {this.renderHeader()}
        {!expanded && this.renderBottom()}
      </TouchableOpacity>
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
});

export default PropertyComponent;
