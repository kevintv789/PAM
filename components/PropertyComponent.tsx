import { Dimensions, Image, StyleSheet } from "react-native";
import { constants, theme } from "../shared/constants";
import { getPropertyImage, getPropertyTypeIcons } from "../shared/Utils";

import React from "react";
import _Container from "./common/Container";
import _Text from "./common/Text";
import _VerticalDivider from "./common/VerticalDivider";
import moment from "moment";

const Container: any = _Container;
const Text: any = _Text;
const VerticalDivider: any = _VerticalDivider;

const { width } = Dimensions.get("window");

const PropertyComponent = (props: any) => {
  const { data } = props;
  const iconImageData = getPropertyTypeIcons(data.unitType);

  const renderHeader = () => {
    return (
      <Container
        row
        flex={false}
        style={[styles.headerContainer, { backgroundColor: data.color }]}
      >
        <Image
          source={getPropertyImage(data.image, data.unitType)}
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
              {data.propertyAddress}
            </Text>
          </Container>

          <Text accent semibold size={theme.fontSizes.medium}>
            {data.propertyName}
          </Text>
        </Container>
      </Container>
    );
  };

  const renderTenantNames = () => {
    if (!data.tenants.length) {
      return (
        <Text accent bold>
          Vacant
        </Text>
      );
    } else if (data.tenants.length > 0 && data.tenants.length < 3) {
      return (
        <Container row>
          <Text accent bold>
            {data.tenants[1]}
          </Text>
          <Text light accent size={10}>
            From 1/12/2021
          </Text>
          <Text accent bold>
            {data.tenants[2]}
          </Text>
          <Text light accent size={10}>
            From 1/12/2021
          </Text>
        </Container>
      );
    } else {
      return (
        <Text accent bold>
          {data.tenants.length} Occupants
        </Text>
      );
    }
  };

  const renderBottom = () => {
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
            {renderTenantNames()}
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
          <Container row padding={[0, 0, 0, 3]} flex={3}>
            <Text accent medium size={theme.fontSizes.small}>
              Total Income{"  "}
            </Text>
            <Text accent medium size={theme.fontSizes.small}>
              Total Expense
            </Text>
          </Container>
          <Container row space="between">
            <Text
              secondary
              size={theme.fontSizes.small}
              style={styles.dollars}
              bold
            >
              ${data.income}
            </Text>
            <Text
              red
              size={theme.fontSizes.small}
              style={[styles.dollars, { left: 47 }]}
              bold
            >
              ${data.expenses}
            </Text>
          </Container>
        </Container>
      </Container>
    );
  };

  return (
    <Container center style={styles.mainContainer} flex={false}>
      {renderHeader()}
      {renderBottom()}
    </Container>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: theme.colors.offWhite,
    borderRadius: 10,
    width: "90%",
    minHeight: 200,
    maxHeight: 300,
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
  dollars: {
    bottom: 30,
    left: 37,
  },
});

export default PropertyComponent;
