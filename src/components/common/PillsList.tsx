import { FlatList, StyleSheet } from "react-native";
import React, { useState } from "react";

import Container from "components/common/Container";
import Pills from "components/common/Pills";
import Text from "components/common/Text";
import { theme } from "shared";

export default function PillsList(props: any) {
  const { handlePillSelected, data, defaultSelected, label } = props;

  const [pillSelected, setPillSelected] = useState(
    defaultSelected ? defaultSelected : null
  );

  const handleSelected = (selected: any) => {
    setPillSelected(selected);
    handlePillSelected(selected);
  };

  return (
    <Container>
      {label && (
        <Text tertiary semibold style={styles.label}>
          {label}
        </Text>
      )}
      <FlatList
        keyboardShouldPersistTaps={"handled"}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pills
            label={item}
            selectable
            containerStyle={{
              borderColor:
                item === pillSelected
                  ? theme.colors.secondary
                  : theme.colors.offWhite,
            }}
            labelStyle={{
              color:
                item === pillSelected
                  ? theme.colors.secondary
                  : theme.colors.offWhite,
            }}
            handlePillSelected={(selected: any) => handleSelected(selected)}
          />
        )}
        keyExtractor={(item: any) => item}
        snapToAlignment="center"
        style={styles.periods}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  periods: {
    marginTop: theme.sizes.padding / 2,
    marginBottom: theme.sizes.padding,
    paddingLeft: theme.sizes.padding / 3,
  },
  label: {
    paddingHorizontal: 10,
    top: 10
  },
});
