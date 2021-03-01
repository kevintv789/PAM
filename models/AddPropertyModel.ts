export interface State {
  propertyTypes: Array<String>;
  typeSelected: string;
  propertyNickName: string;
  streetAddress: string;
  streetAddressResults: Array<String>;
  showKeyboard: boolean;
}

export interface Props {
  handleCancelClicked: any;
  navigation: any;
}
