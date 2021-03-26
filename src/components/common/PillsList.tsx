import { FlatList, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";

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

  // Note: useRef doesn't throw away any old refs that were once used
  // This allows the ref to work even when another view wants to open this component
  const flatListRef = useRef<FlatList<any>>();

  const goIndex = (index: number) => {
    if (flatListRef) {
      flatListRef.current?.scrollToIndex({
        animated: true,
        index,
        viewPosition: 0.5,
      });
    }
  };

  useEffect(() => {
    if (defaultSelected) {
      // grab index of the default selected item
      // and automatically scroll to the selected item
      const index = data.indexOf(defaultSelected);
      goIndex(index);
    }
  }, []);

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
        ref={flatListRef}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500)); // If FlatList fails to scroll to index automatically, then wait for 500 ms and try again
          wait.then(() => {
            goIndex(info.index);
          });
        }}
        renderItem={({ item, index }) => (
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
            handlePillSelected={(selected: any) => {
              handleSelected(selected);
              goIndex(index);
            }}
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
    top: 10,
  },
});
