import React, { useState } from "react";

import Button from "components/common/Button";
import Container from "components/common/Container";
import { StyleSheet } from "react-native";
import Text from "components/common/Text";
import { theme } from "shared";

export default function Counter(props: any) {
  const { min, max, onCountChange, defaultValue } = props;
  const [counter, setCounter] = useState(defaultValue ? defaultValue : min);

  const reduce = () => {
    let count = counter;
    count--;
    if (count >= min) setCounter(count);
    onCountChange(counter);
  };

  const increase = () => {
    let count = counter;
    count++;
    if (count <= max) setCounter(count);
    onCountChange(counter);
  };

  return (
    <Container row center>
      <Button style={styles.button} onPress={() => reduce()}>
        <Text center offWhite bold>
          -
        </Text>
      </Button>
      <Text offWhite bold center style={styles.counterText}>
        {counter}
      </Text>
      <Button
        style={styles.button}
        color="secondary"
        onPress={() => increase()}
      >
        <Text center offWhite bold>
          +
        </Text>
      </Button>
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 40,
  },
  counterText: {
    paddingHorizontal: theme.sizes.base * 0.85,
  },
});
