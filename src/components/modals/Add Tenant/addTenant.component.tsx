import {
  AddImageButton,
  Button,
  Container,
  Counter,
  HeaderDivider,
  PillsList,
  Text,
  TextInput,
  Toggle,
} from "components/common";
import { Dimensions, Modal, ScrollView, StyleSheet } from "react-native";
import React, { Component } from "react";
import {
  addTenant,
  updateProperty,
  updateTenant,
} from "reducks/modules/property";
import { constants, theme } from "shared";
import {
  formatCurrencyFromCents,
  formatMobileNumber,
  hasErrors,
} from "shared/Utils";

import { AddTenantModel } from "models";
import { Entypo } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NotesComponent from "components/Modals/Notes/notes.component";
import { TouchableOpacity } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { getNextPaymentDate } from "shared/Utils";
import moment from "moment";
import update from "react-addons-update";

const { width, height } = Dimensions.get("window");

class AddTenantComponent extends Component<
  AddTenantModel.Props,
  AddTenantModel.State
> {
  private scrollViewRef: any;
  private isEditting: boolean = false;
  private tenantInfo: any;

  constructor(props: AddTenantModel.Props) {
    super(props);

    this.state = {
      primaryTenantName: "",
      phone: "",
      email: "",
      leaseType: "",
      leaseStartDate: moment(new Date()).format("MM/DD/YYYY"),
      leaseEndDate: "",
      rentPaidPeriod: "Monthly",
      rent: "",
      rentFormatted: "",
      deposit: "",
      depositFormatted: "",
      totalOccupants: 1,
      notes: undefined,
      showNotesModal: false,
      lastPaymentDate: moment().format("MM/DD/YYYY"),
      hasTenantPaidFirstRent: false,
      errors: [],
    };

    this.scrollViewRef = React.createRef();
    const { navigation } = this.props;
    this.isEditting = navigation.getParam("isEditting");
    this.tenantInfo = navigation.getParam("tenantData");
  }

  componentDidMount() {
    // Sets default state on edit of an existing tenant
    if (this.isEditting && this.tenantInfo) {
      this.setState({
        primaryTenantName: this.tenantInfo.name,
        phone: formatMobileNumber(this.tenantInfo.phone, ""),
        email: this.tenantInfo.email,
        leaseType: this.tenantInfo.leaseType,
        leaseStartDate: this.tenantInfo.leaseStartDate,
        leaseEndDate: moment(this.tenantInfo.leaseEndDate).isValid()
          ? this.tenantInfo.leaseEndDate
          : "",
        rentPaidPeriod: this.tenantInfo.recurringPaymentType,
        rent: this.tenantInfo.rent,
        rentFormatted: "$" + this.tenantInfo.rent,
        deposit: this.tenantInfo.securityDeposit,
        depositFormatted: "$" + this.tenantInfo.securityDeposit,
        totalOccupants: this.tenantInfo.totalOccupants,
        lastPaymentDate: this.tenantInfo.lastPaymentDate,
        hasTenantPaidFirstRent: this.tenantInfo.lastPaymentDate !== "",
      });
    }
  }

  handleAddTenant = () => {
    const { navigation, addTenant, updateProperty, updateTenant } = this.props;
    const {
      primaryTenantName,
      phone,
      email,
      leaseType,
      leaseStartDate,
      leaseEndDate,
      deposit,
      rentPaidPeriod,
      totalOccupants,
      rentFormatted,
      lastPaymentDate,
      hasTenantPaidFirstRent,
    } = this.state;

    const errors = [];
    const propertyData = navigation.getParam("propertyData");
    const rentToInt =
      rentFormatted !== ""
        ? parseFloat(rentFormatted.replace("$", "").replace(",", ""))
        : 0;
    const tenantId = this.isEditting
      ? this.tenantInfo.id
      : Math.floor(10 + Math.random() * 10000);

    if (!primaryTenantName.length) {
      errors.push("tenantName");
    }

    const tenantPayload = {
      id: tenantId,
      properties: this.isEditting
        ? this.tenantInfo.properties
        : [propertyData.id],
      name: primaryTenantName,
      phone,
      email,
      leaseType,
      leaseStartDate,
      leaseEndDate,
      securityDeposit: deposit,
      recurringPaymentType: rentPaidPeriod, // monthly, quarterly, annually, etc. this will be used to calculate next expected payment
      totalOccupants,
      rent: rentToInt,
      collectionDay: 1, // Day of the month that rent is collected. if 0 or null, then default to the lease start date day
      lastPaymentDate: hasTenantPaidFirstRent ? lastPaymentDate : undefined,
      nextPaymentDate: this.isEditting
        ? this.tenantInfo.nextPaymentDate
        : getNextPaymentDate(leaseStartDate, rentPaidPeriod),
    };

    if (!errors.length) {
      if (!this.isEditting) {
        addTenant(tenantPayload);

        const propertyPayload = update(propertyData, {
          tenants: { $push: [tenantId] },
        });

        updateProperty(propertyPayload);
      } else {
        updateTenant(tenantPayload);
      }

      navigation.goBack();
    } else {
      this.scrollViewRef.current?.scrollTo({ x: 0, y: 10, animated: true });
    }

    this.setState({ errors });
  };

  renderImageSection = () => {
    return (
      <AddImageButton
        handleOnPress={() => console.log("Adding tenant related images...")}
        caption="Add lease related photos or documents"
      />
    );
  };

  renderTenantInfo = () => {
    const { primaryTenantName, phone, email, errors } = this.state;

    return (
      <Container center flex={false}>
        <TextInput
          required
          error={hasErrors("tenantName", errors)}
          label="Name"
          value={primaryTenantName}
          onChangeText={(primaryTenantName: string) =>
            this.setState({
              primaryTenantName,
              errors: errors.filter((e) => e !== "tenantName"),
            })
          }
          style={[styles.input, hasErrors("tenantName", errors)]}
        />
        <TextInput
          keyboardType="phone-pad"
          label="Phone"
          value={phone}
          onChangeText={(phone: string) =>
            this.setState<any>((prevState) => ({
              phone: formatMobileNumber(phone, prevState.phone),
            }))
          }
          style={styles.input}
        />
        <TextInput
          keyboardType="email-address"
          label="Email Address"
          value={email}
          onChangeText={(email: string) => this.setState({ email })}
          style={styles.input}
        />
      </Container>
    );
  };

  renderLeaseInfo = () => {
    const {
      leaseStartDate,
      leaseEndDate,
      rentPaidPeriod,
      rent,
      rentFormatted,
      deposit,
      depositFormatted,
      notes,
      hasTenantPaidFirstRent,
      lastPaymentDate,
    } = this.state;

    const leaseTypes = Object.values(constants.LEASE_TYPE);

    const rentPeriods = Object.values(constants.RECURRING_PAYMENT_TYPE).filter(
      (e) => e !== constants.RECURRING_PAYMENT_TYPE.MONTH
    );

    const options = [
      { label: "No", value: false },
      { label: "Yes", value: true },
    ];

    return (
      <Container center>
        <PillsList
          label="Select a lease type:"
          defaultSelected={constants.LEASE_TYPE.FIXED_TERM}
          data={leaseTypes}
          handlePillSelected={(leaseType: string) =>
            this.setState({ leaseType })
          }
        />
        <TextInput
          dateTime
          label="Lease starts on"
          style={styles.input}
          value={leaseStartDate}
          dateValue={moment(leaseStartDate).toDate()}
          onChangeDate={(leaseStartDate: string) =>
            this.setState({ leaseStartDate })
          }
        />
        <TextInput
          dateTime
          label="Lease ends on"
          value={leaseEndDate}
          style={styles.input}
          onChangeDate={(leaseEndDate: string) =>
            this.setState({ leaseEndDate })
          }
        />

        {/* ------ RENT IS PAID TOGGLE ------ */}
        <Container
          flex={false}
          row
          space="between"
          center
          margin={[0, 10, 0, 0]}
        >
          <Container left padding={[18, 0, 0, 11]}>
            <Text semibold tertiary>
              Has tenant already paid rent?
            </Text>
          </Container>

          <Toggle
            options={options}
            initialIndex={
              this.isEditting && this.tenantInfo.lastPaymentDate !== "" ? 1 : 0
            }
            handleToggled={(value: boolean) => {
              this.setState({ hasTenantPaidFirstRent: value });
            }}
            containerStyle={styles.toggle}
            borderRadius={13}
            height={48}
          />
        </Container>

        {/* ------ RENT PAID ON DATE ------ */}
        {hasTenantPaidFirstRent && (
          <TextInput
            dateTime
            label="Rent paid on"
            value={lastPaymentDate}
            style={styles.input}
            onChangeDate={(lastPaymentDate: string) =>
              this.setState({ lastPaymentDate })
            }
          />
        )}

        {/* ------ RENT IS PAID PILLS LIST ------ */}
        <PillsList
          label="Rent is paid:"
          defaultSelected={constants.RECURRING_PAYMENT_TYPE.MONTHLY}
          data={rentPeriods}
          handlePillSelected={(rentPaidPeriod: string) =>
            this.setState({ rentPaidPeriod })
          }
        />
        <TextInput
          label={`Rent / ${rentPaidPeriod}`}
          keyboardType="numeric"
          style={styles.input}
          value={rentFormatted}
          onChangeText={(value: any) => {
            if (
              rentFormatted.length > value.length ||
              (value.length === 1 && value === ".")
            ) {
              this.setState({ rent: "", rentFormatted: "" });
            } else {
              this.setState({
                rent: parseFloat(
                  formatCurrencyFromCents(value, rent).rawVal
                ).toString(),
                rentFormatted:
                  value.lastIndexOf(".") + 1 === value.length // checks whether the last index is a decimal, if it is then remove it
                    ? `$${
                        formatCurrencyFromCents(value, rent).formattedAmt
                      }`.slice(0, -1)
                    : `$${formatCurrencyFromCents(value, rent).formattedAmt}`,
              });
            }
          }}
        />
        <TextInput
          label="Deposit paid"
          keyboardType="numeric"
          style={styles.input}
          value={depositFormatted}
          onChangeText={(value: any) => {
            if (
              depositFormatted.length > value.length ||
              (value.length === 1 && value === ".")
            ) {
              this.setState({ deposit: "", depositFormatted: "" });
            } else {
              this.setState({
                deposit: parseFloat(
                  formatCurrencyFromCents(value, deposit).rawVal
                ).toString(),
                depositFormatted:
                  value.lastIndexOf(".") + 1 === value.length // checks whether the last index is a decimal, if it is then remove it
                    ? `$${
                        formatCurrencyFromCents(value, deposit).formattedAmt
                      }`.slice(0, -1)
                    : `$${
                        formatCurrencyFromCents(value, deposit).formattedAmt
                      }`,
              });
            }
          }}
        />

        {/* ------- TOTAL OCCUPANTS COUNTER ------- */}
        <Container
          row
          center
          padding={[
            theme.sizes.base * 1.4,
            theme.sizes.base,
            theme.sizes.base,
            theme.sizes.base,
          ]}
        >
          <Container left>
            <Text tertiary semibold>
              Total Occupants:
            </Text>
          </Container>

          <Container right flex={false}>
            <Counter
              min={1}
              max={99}
              onCountChange={(count: number) =>
                this.setState({ totalOccupants: count })
              }
            />
          </Container>
        </Container>

        {/* ------- ADD NOTES INPUT ------- */}
        <TouchableOpacity
          style={styles.addNotesButton}
          onPress={() => this.setState({ showNotesModal: true })}
        >
          <TextInput
            gray
            size={theme.fontSizes.medium}
            style={styles.addNotesButtonText}
            editable={false}
            label="Add Notes"
            value={notes ? notes.text : ""}
            numberOfLines={1}
          />
          <Entypo
            name="chevron-small-right"
            size={26}
            color={theme.colors.gray}
            style={styles.notesChevron}
          />
        </TouchableOpacity>
      </Container>
    );
  };

  renderNavigationButtons = () => {
    const { navigation } = this.props;

    return (
      <Container
        row
        space="between"
        flex={false}
        padding={[
          theme.sizes.padding / 1.3,
          theme.sizes.padding / 1.3,
          0,
          theme.sizes.padding / 1.3,
        ]}
        style={{ height: height / 4.8 }}
      >
        <Button
          color="red"
          style={styles.navigationButtons}
          onPress={() => navigation.goBack()}
        >
          <Text offWhite center semibold>
            Cancel
          </Text>
        </Button>
        <Button
          color="secondary"
          style={styles.navigationButtons}
          onPress={() => this.handleAddTenant()}
        >
          <Text offWhite center semibold>
            Save
          </Text>
        </Button>
      </Container>
    );
  };

  renderNotesModal = () => {
    const { showNotesModal } = this.state;

    return (
      <Modal
        visible={showNotesModal}
        animationType="fade"
        onDismiss={() => this.setState({ showNotesModal: false })}
      >
        <NotesComponent
          label="New Tenant(s)"
          handleBackClick={(notes: string) =>
            this.setState({ notes, showNotesModal: false })
          }
        />
      </Modal>
    );
  };

  render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        ref={this.scrollViewRef}
        nestedScrollEnabled
        scrollEnabled
      >
        <Container center color="accent" padding={[0, 0, theme.sizes.padding]}>
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            scrollEnabled={true}
            nestedScrollEnabled
            keyboardShouldPersistTaps={"handled"}
            enableAutomaticScroll={true}
          >
            <Text
              h1
              offWhite
              center
              style={{ paddingTop: theme.sizes.padding }}
            >
              {this.isEditting ? "Edit Tenant" : "Add Tenant"}
            </Text>
            {this.renderImageSection()}
            <HeaderDivider title="Primary Tenant Information" />
            {this.renderTenantInfo()}
            <HeaderDivider title="Lease Information" />
            {this.renderLeaseInfo()}
            {this.renderNavigationButtons()}
            {this.renderNotesModal()}
          </KeyboardAwareScrollView>
        </Container>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: width * 0.93,
  },
  navigationButtons: {
    width: theme.sizes.padding * 5.5,
  },
  addNotesButton: {
    backgroundColor: "transparent",
    minWidth: "93%",
    maxWidth: "93%",
    overflow: "hidden",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.offWhite,
    height: 63,
  },
  addNotesButtonText: {
    maxWidth: "93%",
    borderBottomWidth: 0,
  },
  notesChevron: {
    position: "absolute",
    right: 0,
    top: theme.sizes.base * 1.4,
  },
  toggle: {
    minWidth: 140,
    maxWidth: 140,
  },
});

const mapDispatchToProps = {
  addTenant,
  updateProperty,
  updateTenant,
};

export default connect(null, mapDispatchToProps)(AddTenantComponent);
