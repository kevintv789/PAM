export interface State {
  propertyTypes: Array<String>;
  typeSelected: string;
  propertyNickName: string;
  streetAddress: string;
  streetAddressResults: Array<String>;
  showNotesModal: boolean;
  notesValue: any;
  errors: string[];
  autoFill: boolean;
  showKeyboard: boolean;
  isLoading: boolean;
  showAddImageModal: boolean;
  images: any[];
  imageStorageDownloadUrls: any[];
  showWarningModal: boolean;
  imageToDelete: any;
}

export interface Props {
  navigation?: any;
  addProperty?: any;
  updateProperty?: any;
}
