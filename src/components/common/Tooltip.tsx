import Container from "./Container";
import React from "react";
import { StyleSheet } from "react-native";
import Tooltip from "rn-tooltip";
import { theme } from "shared";

export default function TooltipWrapper(props: any) {
  const {
    anchor,
    actionType = "press",
    content,
    withOverlay = false,
    width = 100,
    height = 70,
    tooltipContainerStyle,
    withPointer = false,
    tooltipRef
  } = props;

  return (
    <React.Fragment>
      <Tooltip
        ref={tooltipRef}
        popover={content}
        actionType={actionType}
        backgroundColor={theme.colors.offWhite}
        containerStyle={
          tooltipContainerStyle ? tooltipContainerStyle : styles.tooltip
        }
        height={height}
        width={width}
        withOverlay={withOverlay}
        withPointer={withPointer}
      >
        {anchor}
      </Tooltip>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    justifyContent: "space-around",
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 13,
    elevation: 2,
    flex: 1,
    marginHorizontal: -10,
    marginTop: -25,
  },
  tooltipText: {
    color: theme.colors.accent,
  },
});
