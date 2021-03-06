export interface State {
  propertyTypes: Array<String>;
  typeSelected: string;
  propertyNickName: string;
  streetAddress: string;
  streetAddressResults: Array<String>;
  showKeyboard: boolean;
  showNotesModal: boolean;
  notesValue: string;
}

export interface Props {
  handleCancelClicked: any;
  navigation: any;
  handleNextClicked: any;
}
