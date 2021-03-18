import { Animated } from "react-native";

export interface State {
  expanded: boolean;
  animatedHeaderHeight: Animated.Value;
  animatedHeaderImageWidth: Animated.Value;
  animatedHeaderImageHeight: Animated.Value;
  animatedContainerHeight: Animated.Value;
  animatedHeaderPropertyAddressTop: Animated.Value;
  animatedExpandedContentOpacity: Animated.Value;
  expensesData: any;
  tenantData: any;
  propertyData: any;
}

export interface Props {
  propertyData: any;
}
