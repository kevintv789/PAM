export interface State {
  propertyTypes: Array<String>;
  typeSelected: string;
  propertyNickName: string;
  streetAddress: string;
  streetAddressResults: Array<String>;
  showKeyboard: boolean;
  showNotesModal: boolean;
  notesValue: any;
  errors: string[];
  autoFill: boolean;
}

export interface Props {
  navigation?: any;
  addProperty?: any;
}
