import { Button, Container, Text } from "components/common";
import { Image, StyleSheet } from "react-native";
import React, { Component } from "react";

import { HomeModel } from "models";
import PropertyComponent from "components/Property/property.component";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { getPropertiesByIds } from "reducks/modules/property";
import { getUser } from "reducks/modules/user";
import { theme } from "shared";

class HomeScreen extends Component<HomeModel.Props, HomeModel.State> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    const { getUser } = this.props;
    getUser();
  }

  componentDidUpdate(prevProps: HomeModel.Props) {
    const { userData, getPropertiesByIds } = this.props;

    if (prevProps.userData !== userData) {
      getPropertiesByIds(userData.properties);
    }
  }

  renderDefaultMessage = () => {
    const { userData } = this.props;
    return (
      <Container
        flex={false}
        center
        middle
        padding={[theme.sizes.padding * 0.2]}
      >
        <Image source={require("assets/icons/keys.png")} style={styles.keys} />
        <Text offWhite size={30}>
          Hi {userData.firstName}!
        </Text>
        <Text
          center
          offWhite
          light
          style={{ width: "90%", paddingTop: theme.sizes.base }}
        >
          Start by adding your first property to unlock new features, and i’ll
          handle the rest!
        </Text>
        <Button
          style={styles.setUpProperty}
          onPress={() => this.setState({ showModal: true })}
        >
          <Text center offWhite size={theme.fontSizes.medium}>
            Set Up Property
          </Text>
        </Button>
      </Container>
    );
  };

  renderProperties = () => {
    const { propertyData } = this.props;

    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: theme.sizes.padding,
        }}
        nestedScrollEnabled
        style={styles.propertiesScrollView}
        keyboardShouldPersistTaps={"handled"}
        showsVerticalScrollIndicator={false}
      >
        <Container center>
          {propertyData.map((property: any) => {
            // this is returning a property id
            return (
              <Container
                key={property.id}
                // onLayout={(event) => {}} // TODO -- perhaps use onlayout to calculate the new position for scrollTo
              >
                <PropertyComponent propertyData={property} />
              </Container>
            );
          })}
        </Container>
      </ScrollView>
    );
  };

  renderContent = () => {
    const { userData, navigation } = this.props;

    return (
      <Container color="accent" style={{}}>
        <Container
          middle
          center
          flex={false}
          style={{ marginTop: theme.sizes.padding * 2.5 }}
          row
        >
          <Text h1 tertiary>
            My Properties
          </Text>
          <Button
            color="transparent"
            style={styles.addPropButton}
            onPress={() => navigation.navigate("AddPropertyModal")}
          >
            <Image
              source={require("assets/icons/plus.png")}
              style={{ width: 29, height: 29 }}
            />
          </Button>
        </Container>
        {!userData.properties.length
          ? this.renderDefaultMessage()
          : this.renderProperties()}
      </Container>
    );
  };

  render() {
    const { userData } = this.props;
    return userData ? (
      this.renderContent()
    ) : (
      <Container>
        <Text>No Data</Text>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  keys: {
    width: 130,
    height: 130,
    marginBottom: theme.sizes.padding * 1.5,
  },
  setUpProperty: {
    marginTop: theme.sizes.base * 1.6,
  },
  propertiesScrollView: {
    paddingTop: theme.sizes.padding,
  },
  addPropButton: {
    position: "absolute",
    right: 20,
    top: -5,
    width: 29,
    height: 29,
  },
});

const mapStateToProps = (state: any) => {
  return {
    userData: state.userState.user,
    propertyData: state.propertyState.properties,
  };
};

const mapDispatchToProps = {
  getUser,
  getPropertiesByIds,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
