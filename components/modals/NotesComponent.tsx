import { Container, Text, TextInput } from "..";
import { Dimensions, Image, StyleSheet } from "react-native";
import React, { Component } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import { NotesModel } from "../../models";
import moment from "moment";
import { theme } from "../../shared";

const { height } = Dimensions.get("window");

export default class NotesComponent extends Component<
  NotesModel.Props,
  NotesModel.State
> {
  constructor(props: any) {
    super(props);

    this.state = {
      value: undefined,
    };
  }

  formatCurrentDate = () => {
    return (
      moment().format("MMMM DD, YYYY") + " at " + moment().format("h:mm A")
    );
  };

  render() {
    const { label, handleBackClick, notesData } = this.props;
    const { value } = this.state;

    return (
      <Container color="accent">
        <ScrollView>
          <Container padding={[theme.sizes.padding * 2, 25, 25, 25]}>
            <TouchableOpacity onPress={() => handleBackClick(value)}>
              <Image
                source={require("../../assets/icons/left_arrow.png")}
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
            <Text offWhite size={24} bold style={styles.label}>
              {label} Notes
            </Text>
            <Text offWhite light style={{ paddingTop: 5 }}>
              {this.formatCurrentDate()}
            </Text>
            <TextInput
              onChangeText={(value: string) => this.setState({ value })}
              value={value}
              defaultValue={notesData ? notesData.text : ''}
              multiline
              editable
              style={styles.input}
            />
          </Container>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    paddingTop: theme.sizes.base,
  },
  input: {
    borderBottomWidth: 0,
    height,
  },
});
