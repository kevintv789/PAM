import {
  Animated,
  Dimensions,
  Image as RNImage,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  CommonModal,
  Container,
  HeaderDivider,
  Text,
  TooltipWrapper,
  VerticalDivider,
} from "components/common";
import {
  PROPERTIES_DOC,
  PROPERTY_FINANCES_DOC,
  TENANTS_DOC,
} from "shared/constants/databaseConsts";
import React, { Component } from "react";
import { animations, constants, theme } from "shared";
import { filter, isEqual, remove, sortBy, uniqBy } from "lodash";
import {
  formatNumber,
  getPropertyImage,
  getPropertyTypeIcons,
} from "shared/Utils";

import AuthService from "services/auth.service";
import CommonService from "services/common.service";
import { Image } from "react-native-expo-image-cache";
import { PROPERTY_FINANCES_TYPE } from "shared/constants/constants";
import PropertyContentComponent from "components/PropertyContent/property.content.component";
import { PropertyModel } from "models";
import PropertyService from "services/property.service";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getUser } from "reducks/modules/user";
import moment from "moment";

const { width } = Dimensions.get("window");

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedText = Animated.createAnimatedComponent(Text);
const date = Date.now();

class PropertyComponent extends Component<
  PropertyModel.Props,
  PropertyModel.State
> {
  private tooltipRef: React.RefObject<any>;
  private propertyService = new PropertyService();
  private authService = new AuthService();
  private commonService = new CommonService();

  constructor(props: PropertyModel.Props) {
    super(props);

    this.state = {
      expanded: false,
      animatedHeaderHeight: new Animated.Value(100),
      animatedHeaderImageWidth: new Animated.Value(74),
      animatedHeaderImageHeight: new Animated.Value(74),
      animatedContainerHeight: new Animated.Value(0),
      animatedHeaderPropertyAddressTop: new Animated.Value(0),
      animatedExpandedContentOpacity: new Animated.Value(0),
      animatedPropertyAddressWidth: new Animated.Value(180),
      financesData: [],
      tenantsData: [],
      propertyData: this.props.propertyData,
      showTooltip: false,
      showCommonModal: false,
      imagesUrl: [],
    };

    this.tooltipRef = React.createRef();
  }

  componentDidMount() {
    const { propertyData } = this.state;

    this.getTenantData(propertyData);
    this.setFinancialData();

    if (propertyData.images && propertyData.images.length > 0) {
      this.updateImageDownloadUrl(propertyData.images);
    }
  }

  static getDerivedStateFromProps(
    props: PropertyModel.Props,
    state: PropertyModel.State
  ) {
    if (!isEqual(props.propertyData, state.propertyData)) {
      return { propertyData: props.propertyData };
    }

    return null;
  }

  componentDidUpdate(prevProps: PropertyModel.Props) {
    const { financesData, tenantData, propertyData } = this.props;

    if (
      !isEqual(prevProps.propertyData, propertyData) ||
      !isEqual(prevProps.tenantData, tenantData)
    ) {
      this.getTenantData(propertyData);
      setTimeout(() => {
        this.updateImageDownloadUrl(propertyData.images);
      }, 3000);
    }

    if (!isEqual(prevProps.financesData, financesData)) {
      this.setFinancialData();
    }
  }

  onDeleteSingleImage = (image: any) => {
    const { propertyData } = this.props;
    const propertyImages = [...propertyData.images];

    const removedItem = remove(
      propertyImages,
      (p: any) => p.downloadPath === image.uri
    );

    this.commonService
      .deleteStorageFile(removedItem)
      .then(() => {
        // update property images with new object
        this.commonService.handleUpdateSingleField(
          PROPERTIES_DOC,
          propertyData.id,
          { images: propertyImages }
        );
      })
      .catch((error) =>
        console.log("ERROR cannot remove item: ", removedItem[0].name, error)
      );
  };

  setFinancialData = () => {
    const { financesData } = this.props;
    const { propertyData } = this.state;

    const filteredFinancialData = filter(
      financesData,
      (e: any) => e.propertyId === propertyData.id
    );

    this.setState({ financesData: filteredFinancialData });
  };

  getTenantData = (propertyData: any) => {
    const { tenantData } = this.props;
    const tenants = propertyData.tenants;

    if (tenants && tenants.length > 0) {
      const filteredTenants: any[] = [];

      tenants.map((id: string) => {
        tenantData.map((tenant: any) => {
          if (tenant.id === id) {
            filteredTenants.push(tenant);
          }
        });
      });

      this.setState({ tenantsData: filteredTenants });
    }
  };

  togglePropertyContent = () => {
    const { onPropertySelect } = this.props;
    const {
      animatedHeaderHeight,
      expanded,
      animatedHeaderImageWidth,
      animatedHeaderImageHeight,
      animatedHeaderPropertyAddressTop,
      animatedExpandedContentOpacity,
      animatedPropertyAddressWidth,
      animatedContainerHeight,
    } = this.state;

    // animate header height
    animations.animateOnToggle(animatedHeaderHeight, expanded, 100, 70);

    // animate header image width
    animations.animateOnToggle(animatedHeaderImageWidth, expanded, 74, 45);

    // animate header image height
    animations.animateOnToggle(animatedHeaderImageHeight, expanded, 74, 45);

    // animate property address width
    animations.animateOnToggle(
      animatedPropertyAddressWidth,
      expanded,
      180,
      210
    );

    // Animate content height
    animations.animateOnToggle(animatedContainerHeight, expanded, 0, 1);

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
      1000
    );

    // The onPropertySelect() prop sets a height on the parent (HomeScreen) component
    // to help the auto scroll function
    onPropertySelect();
    this.setState({ expanded: !expanded });
  };

  renderEditPropertyButton = () => {
    return (
      <View
        style={{ width: 50 }}
        hitSlop={{ top: 20, bottom: 20, left: 30, right: 30 }}
      >
        <Entypo
          name="dots-three-vertical"
          size={20}
          color={theme.colors.accent}
        />
      </View>
    );
  };

  renderTooltipOptions = (width: number) => {
    const { navigation } = this.props;
    const { propertyData } = this.state;

    return (
      <React.Fragment>
        <TouchableOpacity
          style={{ width: "100%" }}
          onPress={() => {
            this.tooltipRef.current?.toggleTooltip();
            navigation.navigate("AddPropertyModal", {
              editting: true,
              propertyData,
            });
          }}
        >
          <Container row flex={false}>
            <AntDesign name="edit" size={18} color={theme.colors.accent} />
            <Text
              accent
              style={{ paddingLeft: 5 }}
              size={theme.fontSizes.medium}
            >
              Edit
            </Text>
          </Container>
        </TouchableOpacity>
        <HeaderDivider
          color="accent"
          style={{ width, height: StyleSheet.hairlineWidth, marginTop: 0 }}
        />
        <TouchableOpacity
          style={{ width: "100%" }}
          onPress={() => {
            this.tooltipRef.current?.toggleTooltip();
            this.setState({ showCommonModal: true });
          }}
        >
          <Container row flex={false}>
            <MaterialCommunityIcons
              name="bulldozer"
              size={18}
              color={theme.colors.red}
            />
            <Text
              accent
              style={{ paddingLeft: 5 }}
              size={theme.fontSizes.medium}
            >
              Bulldoze
            </Text>
          </Container>
        </TouchableOpacity>
      </React.Fragment>
    );
  };

  updateImageDownloadUrl = async (images: any[]) => {
    const { propertyData } = this.props;

    // use this to only download images if and only if said property doesn't have download path
    const filteredPropertyImages = images.filter(
      (p: any) => p.downloadPath == null || p.downloadPath === ""
    );

    if (filteredPropertyImages && filteredPropertyImages.length > 0) {
      const data = await (
        await this.commonService.getImageDownloadUri(filteredPropertyImages)
      ).filter((i: any) => i.uri != null);

      if (data && data.length > 0) {
        // update property object collection to include the full uri
        const tempImages = [...filteredPropertyImages];
        tempImages.map((image, index) => {
          image.downloadPath = data[index].uri;
        });

        const propertyImages = [...images];
        tempImages.forEach((image) => propertyImages.push(image));

        this.commonService
          .handleUpdateSingleField(PROPERTIES_DOC, propertyData.id, {
            images: uniqBy(propertyImages, "uri"),
          })
          .then(() =>
            console.log("Updated property document with new image list")
          );
      }
    }
  };

  renderHeader = () => {
    const {
      animatedHeaderHeight,
      animatedHeaderImageWidth,
      animatedHeaderImageHeight,
      animatedHeaderPropertyAddressTop,
      expanded,
      propertyData,
      imagesUrl,
    } = this.state;

    const imageUri = getPropertyImage(
      propertyData.images,
      propertyData.unitType
    ).uri;

    const iconImageData = getPropertyTypeIcons(propertyData.unitType);
    const AnimatedImage = Animated.createAnimatedComponent(Image);
    const AnimatedRNImage = Animated.createAnimatedComponent(RNImage);

    return (
      <TouchableOpacity
        style={[styles.touchableArea, theme.sharedStyles.shadowEffect]}
        onPress={() => this.togglePropertyContent()}
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
          {imageUri.includes("http") && (
            <AnimatedImage
              uri={imageUri}
              onError={() => console.log("ERROR in retrieving cache image")}
              style={[
                styles.propertyImages,
                {
                  width: animatedHeaderImageWidth,
                  height: animatedHeaderImageHeight,
                },
              ]}
            />
          )}
          
          {imageUri.includes("file") && (
            <AnimatedRNImage
              source={{ uri: imageUri }}
              style={[
                styles.propertyImages,
                {
                  width: animatedHeaderImageWidth,
                  height: animatedHeaderImageHeight,
                },
              ]}
            />
          )}
          <Container>
            <AnimatedContainer
              row
              center
              left
              flex={1}
              style={{ top: animatedHeaderPropertyAddressTop }}
            >
              <RNImage
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
                style={{ width: "80%" }}
              >
                {propertyData.propertyAddress}
              </AnimatedText>

              <Container style={{ width: 28 }} flex={false}>
                <TooltipWrapper
                  anchor={this.renderEditPropertyButton()}
                  content={this.renderTooltipOptions(125)}
                  width={125}
                  height={100}
                  tooltipRef={this.tooltipRef}
                />
              </Container>
            </AnimatedContainer>

            <Text
              accent
              semibold
              size={theme.fontSizes.medium}
              numberOfLines={1}
            >
              {!expanded && propertyData.propertyName}
            </Text>
          </Container>
        </AnimatedContainer>
      </TouchableOpacity>
    );
  };

  findEarliestMoveInDate = () => {
    const { tenantsData } = this.state;

    // sort on leaseStartDate
    if (tenantsData && tenantsData.length > 0) {
      const earliestMoveIn = sortBy(tenantsData, (e: any) =>
        moment(new Date(e.leaseStartDate), moment.ISO_8601)
      )[0].leaseStartDate;
      return moment(earliestMoveIn, "MM/DD/YYYY").format("MM/DD/YYYY");
    }
  };

  sumExpenseForTimePeriod = (timePeriod: string) => {
    const { financesData } = this.state;
    const date = new Date();
    const expenseData = financesData.filter(
      (f: any) => f.type === PROPERTY_FINANCES_TYPE.EXPENSE
    );
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
      (i: any) => i.type === PROPERTY_FINANCES_TYPE.INCOME
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
      <Container row style={{ position: "relative", height: 0 }}>
        <Container>
          <Container row padding={8}>
            <RNImage
              source={require("assets/icons/key.png")}
              style={{ width: theme.sizes.base, height: theme.sizes.base }}
            />
            <Text light accent>
              Tenants
            </Text>
          </Container>
          <Container
            padding={8}
            style={{ width: width / 2.3, position: "absolute", top: 30 }}
          >
            {this.renderTenantNames()}
          </Container>
        </Container>

        <VerticalDivider borderStyle="dashed" />

        <Container style={styles.right}>
          <Container row padding={8} style={{ width: width / 2.3 }}>
            <RNImage
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
            padding={[0, 5, 0, 3]}
            flex={false}
            style={{ width: width / 2.3, position: "absolute", top: 40 }}
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

  onRemoveProperty = async () => {
    const { propertyData, userData } = this.props;
    const propertyId = propertyData.id;
    const images = propertyData.images;
    const promises: Promise<any>[] = [];

    const propertyFinancesPromise = this.propertyService
      .handleRemovePropertyFromFinances(propertyId)
      .catch((error) =>
        console.log(
          `ERROR in removing property references from ${PROPERTY_FINANCES_DOC}`,
          error
        )
      );

    if (propertyData.tenants && propertyData.tenants.length > 0) {
      const tenantsPromise = this.propertyService
        .handleRemovePropertyFromTenant(propertyId)
        .catch((error) =>
          console.log(
            `ERROR in removing property references from ${TENANTS_DOC}`,
            error
          )
        );

      promises.push(tenantsPromise);
    }

    if (images && images.length > 0) {
      const imagesPromise = this.commonService
        .deleteStorageFile(images)
        .catch((error) =>
          console.log("ERROR in removing image files: ", error)
        );

      promises.push(imagesPromise);
    }

    // Remove all references of properties from the user collection
    const userPromise = this.propertyService
      .handleRemovePropertyFromUser(propertyId, userData)
      .catch((error) =>
        console.log("ERROR in removing property from user", error)
      );

    const propertiesPromise = this.propertyService
      .handleRemoveProperty(propertyId)
      .catch((error) =>
        console.log(
          `ERROR in removing property references from ${PROPERTIES_DOC}`,
          error
        )
      );

    promises.push(propertyFinancesPromise);
    promises.push(userPromise);
    promises.push(propertiesPromise);

    return await Promise.all(promises).finally(() => {
      this.updateUserData();
    });
  };

  updateUserData = async () => {
    const { getUser } = this.props;

    return await this.authService
      .getCurrentUserPromise()
      .then((res) => {
        getUser(res.data());
      })
      .catch((error) =>
        console.log(
          "ERROR in getting user after removal of properties: ",
          error
        )
      );
  };

  updateImagePosition = (images: any) => {
    const { propertyData, imagesUrl } = this.state;

    if (images && images.data) {
      let oldImageData = [...propertyData.images];
      const from = images.from;
      const to = images.to;

      // swap locations
      [oldImageData[from], oldImageData[to]] = [
        oldImageData[to],
        oldImageData[from],
      ];

      this.commonService
        .handleUpdateSingleField(PROPERTIES_DOC, propertyData.id, {
          images: oldImageData,
        })
        .catch((error) =>
          console.log("Could not update image positioning", error)
        );
    }
  };

  render() {
    const {
      expanded,
      animatedContainerHeight,
      animatedExpandedContentOpacity,
      showCommonModal,
      financesData,
      tenantsData,
      propertyData,
    } = this.state;

    const imagesUrl = propertyData.images.map((image: any) => ({
      uri:
        image.downloadPath && image.downloadPath !== ""
          ? image.downloadPath
          : image.uri,
    }));

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
              maxHeight: animatedContainerHeight.interpolate({
                inputRange: [0, 1],
                outputRange: ["60%", "100%"],
              }),
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
                imagesUrl={imagesUrl}
                totalIncome={this.sumIncomeForTimePeriod(
                  constants.RECURRING_PAYMENT_TYPE.MONTHLY
                )}
                onDeleteImageFromProperty={(image: any) =>
                  this.onDeleteSingleImage(image)
                }
                onImageDragEnd={(data: any) => this.updateImagePosition(data)}
              />
            </AnimatedContainer>
          )}
          <CommonModal
            visible={showCommonModal}
            compact
            descriptorText={`Are you sure you want to bulldoze this property?\n\nYou can't undo this action.`}
            hideModal={() => this.setState({ showCommonModal: false })}
            onSubmit={() => this.onRemoveProperty()}
            headerIcon={
              <FontAwesome
                name="warning"
                size={36}
                color={theme.colors.offWhite}
              />
            }
            headerIconBackground={theme.colors.primary}
            title="Confirm"
            isAsync
          />
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
    marginBottom: theme.sizes.padding,
    overflow: "hidden",
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
    borderRadius: 100,
  },
  right: {
    left: -55,
  },
  dollarContainers: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.gray,
    top: -10,
    paddingBottom: 3,
  },
  dollars: {
    top: 5,
  },
});

const mapStateToProps = (state: any) => {
  return {
    userData: state.userState.user,
    financesData: state.propertyState.finances,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getUser,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertyComponent);
