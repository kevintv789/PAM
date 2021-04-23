import {
  Button,
  Container,
  LoadingIndicator,
  SearchInput,
  Text,
} from "components/common";
import { Image, Keyboard, RefreshControl, StyleSheet } from "react-native";
import React, { Component } from "react";
import { getPropertyFinances, getTenants } from "reducks/modules/property";
import { includes, isEqual } from "lodash";

import AuthService from "services/auth.service";
import { HomeModel } from "models";
import PropertyComponent from "components/Property/property.component";
import { ScrollView } from "react-native-gesture-handler";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getPropertiesByIds } from "reducks/modules/property";
import { getUser } from "reducks/modules/user";
import { theme } from "shared";

class HomeScreen extends Component<HomeModel.Props, HomeModel.State> {
  private scrollViewRef: React.RefObject<ScrollView>;
  private authService = new AuthService();
  private triggered = false;

  constructor(props: any) {
    super(props);

    this.state = {
      refreshing: false,
      isLoading: true,
      searchQuery: "",
      propertyData: this.props.propertyData, // used as a state to enable mutation through search filtering
    };

    this.scrollViewRef = React.createRef();
  }

  componentDidMount() {
    this.handleUpdateData();
  }

  componentDidUpdate(prevProps: HomeModel.Props, prevState: HomeModel.State) {
    const {
      userData,
      getPropertiesByIds,
      propertyData,
      getPropertyFinances,
      financesData,
    } = this.props;

    const { searchQuery } = this.state;

    if (
      this.scrollViewRef &&
      this.scrollViewRef.current &&
      !this.triggered &&
      searchQuery === ""
    ) {
      this.scrollViewRef.current.scrollTo({
        x: 0,
        y: 50,
        animated: false,
      });
    }

    if (
      !isEqual(prevProps.userData, userData) &&
      userData.properties &&
      userData.properties.length > 0
    ) {
      getPropertiesByIds(userData.properties);
    }

    if (!isEqual(prevProps.propertyData, propertyData)) {
      this.getTenantData();
      this.setState({ propertyData });
    }

    if (!isEqual(prevProps.financesData, financesData) && getPropertyFinances) {
      getPropertyFinances();
    }

    if (prevState.searchQuery !== searchQuery) {
      const filteredProperties = propertyData.filter(
        (p: any) =>
          includes(
            p.propertyAddress.toUpperCase(),
            searchQuery.toUpperCase()
          ) ||
          includes(p.unitType.toUpperCase(), searchQuery.toUpperCase()) ||
          includes(p.propertyName.toUpperCase(), searchQuery.toUpperCase())
      );

      this.setState({ propertyData: filteredProperties });
    }
  }

  handleUpdateData = () => {
    const { getUser, getPropertyFinances, getPropertiesByIds } = this.props;

    getPropertyFinances();

    this.authService
      .getCurrentUserPromise()
      .then((res) => {
        getUser(res.data());

        const userData = res.data();

        if (userData && userData.properties && userData.properties.length > 0) {
          getPropertiesByIds(userData.properties);
          this.getTenantData();
        }
      })
      .catch((error) => console.log("ERROR in retrieving user data: ", error))
      .finally(() => this.setState({ isLoading: false, refreshing: false }));
  };

  getTenantData = () => {
    const { getTenants, propertyData } = this.props;

    if (propertyData && propertyData.length > 0 && getTenants) {
      propertyData.map((property: any) => {
        getTenants();
      });
    }
  };

  renderDefaultMessage = () => {
    const { userData, navigation } = this.props;
    return (
      <Container
        flex={false}
        center
        middle
        padding={[theme.sizes.padding * 0.2]}
      >
        <Image source={require("assets/icons/keys.png")} style={styles.keys} />
        <Text offWhite size={30}>
          Hi {userData.name}!
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
          onPress={() => navigation.navigate("AddPropertyModal")}
        >
          <Text center offWhite size={theme.fontSizes.medium}>
            Set Up Property
          </Text>
        </Button>
      </Container>
    );
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.handleUpdateData();
  };

  renderProperties = () => {
    const { navigation, tenantData } = this.props;
    const { refreshing, propertyData, searchQuery } = this.state;

    return (
      <ScrollView
        contentContainerStyle={{
          paddingBottom: theme.sizes.padding,
        }}
        nestedScrollEnabled
        style={styles.propertiesScrollView}
        ref={this.scrollViewRef}
        keyboardShouldPersistTaps={"handled"}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => this.onRefresh()}
          />
        }
      >
        <SearchInput
          handleChangeText={(value: string) => {
            this.setState({ searchQuery: value });
            this.triggered = true;
          }}
          handleClearText={() => {
            this.setState({ searchQuery: "" });
            Keyboard.dismiss();
          }}
          searchValue={searchQuery}
        />

        <Container center>
          {propertyData &&
            propertyData.map((property: any) => {
              // this is returning a property id
              let positionY = 0;
              return (
                <Container
                  key={property.id}
                  onLayout={(event: any) =>
                    (positionY = event.nativeEvent.layout.y)
                  }
                >
                  <PropertyComponent
                    tenantData={tenantData}
                    propertyData={property}
                    navigation={navigation}
                    onPropertySelect={() => this.scrollToProperty(positionY)}
                  />
                </Container>
              );
            })}
        </Container>
      </ScrollView>
    );
  };

  scrollToProperty = (positionY: number) => {
    setTimeout(() => {
      this.scrollViewRef.current?.scrollTo({
        x: 0,
        y: positionY + 50,
        animated: true,
      });
    }, 400);
  };

  renderContent = () => {
    const { userData, navigation } = this.props;
    const { searchQuery } = this.state;

    return (
      <Container color="accent">
        <Container
          middle
          center
          flex={false}
          style={{ marginTop: theme.sizes.padding * 2.5 }}
          row
        >
          <Text h1 tertiary style={{ marginBottom: theme.sizes.base }}>
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

        {userData.properties.length === 0
          ? this.renderDefaultMessage()
          : this.renderProperties()}
      </Container>
    );
  };

  render() {
    const { userData } = this.props;
    const { isLoading } = this.state;

    if (isLoading) {
      return (
        <Container
          color="accent"
          flex={1}
          center
          padding={[theme.sizes.base * 8]}
        >
          <LoadingIndicator size="large" color={theme.colors.offWhite} />
        </Container>
      );
    } else if (!isLoading && userData) {
      return this.renderContent();
    } else {
      return (
        <Container>
          <Text>No Data</Text>
        </Container>
      );
    }
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
    tenantData: state.propertyState.tenants,
    financesData: state.propertyState.finances,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getUser,
      getPropertiesByIds,
      getTenants,
      getPropertyFinances,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
