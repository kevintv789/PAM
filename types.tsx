import { styles } from "./components/common/Container";

export interface ContainerProps {
  margin: number;
  padding: number;
  flex: any;
  row: any;
  column: any;
  center: any;
  middle: any;
  left: number;
  right: number;
  top: number;
  bottom: number;
  card: any;
  shadow: any;
  color: keyof typeof styles;
  space: any;
  animated: any;
  wrap: any;
  style: any;
}
