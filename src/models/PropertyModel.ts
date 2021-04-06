import { Animated } from "react-native";

export interface State {
  expanded: boolean;
  animatedHeaderHeight: Animated.Value;
  animatedHeaderImageWidth: Animated.Value;
  animatedHeaderImageHeight: Animated.Value;
  animatedContainerHeight: Animated.Value;
  animatedHeaderPropertyAddressTop: Animated.Value;
  animatedExpandedContentOpacity: Animated.Value;
  animatedPropertyAddressWidth: Animated.Value;
  financesData: any;
  tenantData: any;
  propertyData: any;
}

export interface Props {
  propertyData: any;
  getExpense?: any;
  getTenants?: any;
  financesData?: any;
  tenantData: any;
  navigation?: any;
  onPropertySelect: () => void;
}
