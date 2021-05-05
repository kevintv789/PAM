export interface State {
  showNotesModal: boolean;
  notesValue: any;
  showUploadImagesModal: boolean;
  isUploadingImages: boolean;
}

export interface Props {
  propertyData?: any;
  financesData?: any;
  totalIncome?: number;
  navigation?: any;
  getTenants?: (tenantIds: string[]) => {};
  tenantsData?: any[];
  imagesUrl?: any[]
}
