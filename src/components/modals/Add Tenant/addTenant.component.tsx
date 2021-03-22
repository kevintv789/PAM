import {
  AddImageButton,
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
import moment from "moment";

const { width } = Dimensions.get("window");

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
      rentPaidPeriod: "",
      rent: "$0.00",
      deposit: "",
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
    const { leaseStartDate, leaseEndDate } = this.state;

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
});
