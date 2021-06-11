import { Note } from "./NotesModel";

export interface State {
  showNotesModal: boolean;
  notes: any;
  showUploadImagesModal: boolean;
  isUploadingImages: boolean;
  showWarningModal: boolean;
  imageToDelete: any;
  imagesUrl: any;
}

export interface Props {
  propertyData?: any;
  financesData?: any;
  totalIncome?: number;
  navigation?: any;
  getTenants?: (tenantIds: string[]) => {};
  tenantsData?: any[];
  imagesUrl?: any[];
  onDeleteImageFromProperty?: (image: any) => {};
  onImageDragEnd?: (data: any) => {};
}
