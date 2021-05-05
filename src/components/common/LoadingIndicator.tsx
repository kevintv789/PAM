import { ActivityIndicator } from "react-native";
import Container from "./Container";
import React from "react";
import { StyleSheet } from "react-native";

export default function LoadingIndicator(props: any) {
  const { size, color, center, middle, containerStyle } = props;

  return (
    <Container flex={false} center={center} middle={middle} style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
    </Container>
  );
}
