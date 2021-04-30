export interface State {
  showNotesModal: boolean;
  notesValue: any;
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
