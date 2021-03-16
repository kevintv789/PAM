import { Dimensions, FlatList, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { constants, theme } from "shared";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import _Container from "components/common/Container";
import _HeaderDivider from "components/common/HeaderDivider";
import _Pills from "components/common/Pills";
import _SelectableBox from "components/common/SelectableBox";
import _Text from "components/common/Text";
import _TextInput from "components/common/TextInput";
import _Toggle from "components/common/Toggle";
import moment from "moment";

const Container: any = _Container;
const Text: any = _Text;
const HeaderDivider: any = _HeaderDivider;
const TextInput: any = _TextInput;
const Toggle: any = _Toggle;
const Pills: any = _Pills;
const SelectableBox: any = _SelectableBox;

const { width } = Dimensions.get("window");

export default function RecurringPaymentComponent(props: any) {
  const paymentPeriods = constants.RECURRING_PAYMENT_PERIODS;
  const notifyOptions = [
    { label: "No", value: false },
    { label: "Yes", value: true },
  ];

  const [periodSelected, setPeriodSelected] = useState("Month");
  const [startingFrom, setStartingFrom] = useState(
    moment().format("MM/DD/YYYY")
  );
  const [until, setUntil] = useState("");
  const [notify, setNotify] = useState(false);

  const { navigation } = props;

  const renderRecurringType = () => (
    <FlatList
      keyboardShouldPersistTaps={"handled"}
      data={paymentPeriods}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <Pills
          label={item}
          selectable
          containerStyle={{
            borderColor:
              item === periodSelected
                ? theme.colors.secondary
                : theme.colors.offWhite,
          }}
          labelStyle={{
            color:
              item === periodSelected
                ? theme.colors.secondary
                : theme.colors.offWhite,
          }}
          handlePillSelected={(selected: string) => setPeriodSelected(selected)}
        />
      )}
      keyExtractor={(item: any) => item}
      snapToAlignment="center"
      style={styles.periods}
    />
  );

  const renderStartAndUntilInputs = () => {
    const untilDate = moment(until).isValid()
      ? moment(until).toDate()
      : undefined;

    return (
      <Container flex={false} center>
        <TextInput
          dateTime
          label="Starting From"
          style={styles.input}
          value={startingFrom}
          dateValue={moment(startingFrom).toDate()}
          onChangeDate={(value: string) => setStartingFrom(value)}
        />
        <TextInput
          dateTime
          label="Until"
          style={styles.input}
          value={until}
          dateValue={untilDate}
          onChangeDate={(value: string) => setUntil(value)}
        />
      </Container>
    );
  };

  const renderNotifyOptions = () => (
    <Container style={{ justifyContent: "flex-start" }}>
      <HeaderDivider title="Notify Me" style={styles.divider} />
      {periodSelected === "Month" && (
        <Container>
          <SelectableBox
            boldedLabel="1 Day"
            regularLabel="before the due date"
            timePeriod="1"
            handlePressed={(timePeriod: string) => console.log(timePeriod)}
          />
          <SelectableBox
            boldedLabel="3 Days"
            regularLabel="before the due date"
            timePeriod="3"
            handlePressed={(timePeriod: string) => console.log(timePeriod)}
          />
          <SelectableBox
            boldedLabel="14 Days"
            regularLabel="before the due date"
            timePeriod="14"
            handlePressed={(timePeriod: string) => console.log(timePeriod)}
          />
        </Container>
      )}
    </Container>
  );

  const recurringText = `${periodSelected} from ${startingFrom} ${
    until ? "until " + until : ""
  }`;

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      scrollEnabled={true}
      keyboardShouldPersistTaps={"handled"}
      enableAutomaticScroll={true}
    >
      <Container color="accent" padding={[theme.sizes.padding, 0]}>
        <TouchableWithoutFeedback
          style={{ paddingLeft: theme.sizes.base }}
          onPress={() => {
            navigation.goBack();
            navigation.state.params.onGoBack({ recurringText });
          }}
        >
          <Image
            source={require("assets/icons/left_arrow.png")}
            style={{ width: 35, height: 35 }}
          />
        </TouchableWithoutFeedback>

        <Text h1 offWhite center>
          Recurring Payment
        </Text>
        <HeaderDivider title="Due Every" style={styles.divider} />
        <Container flex={false}>{renderRecurringType()}</Container>
        {renderStartAndUntilInputs()}
        <Container flex={false} row space="between">
          <Text offWhite semibold style={{ padding: 20, top: 20 }}>
            Should I notify you?
          </Text>
          <Toggle
            options={notifyOptions}
            initialIndex={0}
            handleToggled={(notify: boolean) => {
              setNotify(notify);
            }}
            containerStyle={styles.notifyToggle}
            borderRadius={13}
            height={48}
          />
        </Container>

        {notify && renderNotifyOptions()}
      </Container>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  divider: {
    width,
    marginTop: theme.sizes.base,
    maxHeight: 40,
  },
  periods: {
    marginTop: theme.sizes.padding / 2,
    marginBottom: theme.sizes.padding,
    paddingLeft: theme.sizes.padding / 3,
  },
  input: {
    width: width * 0.9,
  },
  notifyToggle: {
    minWidth: 145,
    maxWidth: 145,
    marginHorizontal: theme.sizes.padding,
  },
});