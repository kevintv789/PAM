import * as Button from "./src/components/common/Button";
import * as Container from "./src/components/common/Container";
import * as Text from "./src/components/common/Text";

export interface ContainerProps {
  margin?: any;
  padding?: any;
  flex?: any;
  row?: any;
  column?: any;
  center?: any;
  middle?: any;
  left?: any;
  right?: any;
  top?: number;
  bottom?: number;
  card?: any;
  shadow?: any;
  color?: keyof typeof Container.styles;
  space?: any;
  animated?: any;
  wrap?: any;
  style?: any;
  onStartShouldSetResponder?: any;
}

export interface TextProps {
  h1?: any;
  h2?: any;
  h3?: any;
  title?: any;
  body?: any;
  caption?: any;
  size?: any;
  transform?: any;
  align?: any;
  regular?: any;
  bold?: any;
  semibold?: any;
  medium?: any;
  weight?: any;
  light?: any;
  center?: any;
  right?: any;
  spacing?: any;
  height?: any;
  color?: keyof typeof Text.styles;
  accent?: any;
  primary?: any;
  secondary?: any;
  tertiary?: any;
  offWhite?: any;
  black?: any;
  white?: any;
  gray?: any;
  gray2?: any;
  style?: any;
  red?: any;
  numberOfLines?: number;
}

export interface ButtonProps {
  style?: any;
  opacity?: any;
  color?: any;
  end?: any;
  start?: any;
  locations?: any;
  shadow?: any;
  onPress?: any;
  flat?: boolean;
}

export interface WelcomeScreenProps {
  navigation?: any;
}

export interface TextInputProps {
  label?: string;
  onFocus?: any;
  error?: any;
  secure?: boolean;
  rightLabel?: string;
  rightStyle?: any;
  onRightPress?: any;
  email?: string;
  phone?: string;
  number?: number;
  style?: any;
  value?: string;
  required?: boolean;
  dateTime?: boolean;
  onChangeDate?: any;
  dateValue?: Date;
  onChangeText?: any;
  defaultValue?: string;
  multiline?: boolean;
  editable?: boolean;
  keyboardType?: string;
  gray?: any;
  size?: number;
  numberOfLines?: number
}

export interface TextInputState {
  toggleSecure?: boolean;
  isFocused?: boolean;
  datePickerShow?: boolean;
}
