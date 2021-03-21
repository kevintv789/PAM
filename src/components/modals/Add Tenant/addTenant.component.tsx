import {
  AddImageButton,
  Container,
  HeaderDivider,
  Text,
} from "components/common";
import React, { Component } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { theme } from "shared";

export default class AddTenantComponent extends Component {
  renderImageSection = () => {
    return (
      <AddImageButton
        handleOnPress={() => console.log("Adding tenant related images...")}
        caption="Add lease related photos or documents"
      />
    );
  };

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1 }}
        scrollEnabled={true}
        keyboardShouldPersistTaps={"handled"}
        enableAutomaticScroll={true}
      >
        <Container center color="accent">
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
            <HeaderDivider title="Lease Information" />
          </ScrollView>
        </Container>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({});
