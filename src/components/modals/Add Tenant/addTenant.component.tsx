import {
  AddImageButton,
  Button,
  Container,
  HeaderDivider,
  PillsList,
  Text,
  TextInput,
} from "components/common";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import React, { Component } from "react";
import { constants, theme } from "shared";

import { AddTenantModel } from "models";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { formatCurrencyFromCents } from "shared/Utils";
import moment from "moment";

const { width, height } = Dimensions.get("window");

export default class AddTenantComponent extends Component<
  AddTenantModel.Props,
  AddTenantModel.State
> {
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
      notes: "",
    };
  }
  renderImageSection = () => {
    return (
      <AddImageButton
        handleOnPress={() => console.log("Adding tenant related images...")}
        caption="Add lease related photos or documents"
      />
    );
  };

  renderTenantInfo = () => {
    const { primaryTenantName, phone, email } = this.state;

    return (
      <Container center flex={false}>
        <TextInput
          required
          label="Name"
          value={primaryTenantName}
          onChangeText={(primaryTenantName: string) =>
            this.setState({ primaryTenantName })
          }
          style={styles.input}
        />
        <TextInput
          keyboardType="phone-pad"
          label="Phone"
          value={phone}
          onChangeText={(phone: string) => this.setState({ phone })}
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
    } = this.state;

    const leaseTypes = Object.values(constants.LEASE_TYPE);

    const rentPeriods = Object.values(constants.RECURRING_PAYMENT_TYPE).filter(
      (e) => e !== constants.RECURRING_PAYMENT_TYPE.MONTH
    );

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
      </Container>
    );
  };

  renderNavigationButtons = () => {
    const { handleCancelClicked, navigation } = this.props;

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
          onPress={() => navigation.goBack()}
        >
          <Text offWhite center semibold>
            Save
          </Text>
        </Button>
      </Container>
    );
  };

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={true}
        keyboardShouldPersistTaps={"handled"}
        enableAutomaticScroll={true}
      >
        <Container
          center
          color="accent"
          padding={[0, 0, theme.sizes.padding * 3]}
        >
          <ScrollView keyboardShouldPersistTaps={"handled"}>
            <Text
              h1
              offWhite
              center
              style={{ paddingTop: theme.sizes.padding }}
            >
              Add Tenant
            </Text>
            {this.renderImageSection()}
            <HeaderDivider title="Primary Tenant Information" />
            {this.renderTenantInfo()}
            <HeaderDivider title="Lease Information" />
            {this.renderLeaseInfo()}
            {this.renderNavigationButtons()}
          </ScrollView>
        </Container>
      </KeyboardAwareScrollView>
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
});
